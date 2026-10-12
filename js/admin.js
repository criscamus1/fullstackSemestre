
const $ = (s) => document.querySelector(s);
const esc = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const guardarLocal = (clave, valor) => localStorage.setItem(clave, JSON.stringify(valor));
const siguienteId = (lista) => Math.max(0, ...lista.map((x) => x.id)) + 1;

let seccion = "dashboard";   
let editando = null;         
let aviso = "", avisoMalo = false;   

const titulos = { dashboard: "Dashboard", ordenes: "Órdenes", productos: "Productos", categorias: "Categorías", usuarios: "Usuarios", reportes: "Reportes", perfil: "Perfil" };
const ESTADOS = ["Pendiente", "Enviada", "Entregada", "Cancelada"];

// Datos 
const categorias = () => leer("categorias", categoriasData);
const mensajes = () => leer("mensajes", mensajesData);
const perfil = () => leer("perfilAdmin", { nombre: "Administrador", email: "admin@tiendavirtual.cl" });
const registro = (lista) => lista.find((x) => x.id == editando) || {};   // el registro que se está editando ({} si es nuevo)

// ---------- Piezas reutilizables ----------
const kpi = (titulo, valor, clase = "") => `<div class="kpi ${clase}"><span>${titulo}</span><strong>${valor}</strong></div>`;
const campo = (nombre, etiqueta, valor, tipo = "text") => `<label>${etiqueta}<input name="${nombre}" type="${tipo}" value="${esc(valor)}"></label>`;
const tabla = (cabeceras, filas) => `<div class="tabla"><table><thead><tr>${cabeceras.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${filas}</tbody></table></div>`;
const botones = (id) => `<td class="acciones"><button class="sec chico" data-accion="editar" data-id="${id}">Editar</button> <button class="peligro chico" data-accion="borrar" data-id="${id}">Eliminar</button></td>`;
// Página de lista
function pagina(nombre, cabeceras, filas, campos) {
  const form = editando === null ? "" : `
    <form id="formulario" class="caja" novalidate>
      <h2>${editando === "nuevo" ? "Agregar " + nombre : "Editar " + nombre + " #" + editando}</h2>
      <div class="campos">${campos}</div>
      <p class="error-form" id="error-form"></p>
      <div class="fila-botones"><button type="submit">Guardar</button><button type="button" class="sec" data-accion="cancelar">Cancelar</button></div>
    </form>`;
  return form + `<div class="fila-botones"><button data-accion="nuevo">+ Agregar ${nombre}</button></div>` + tabla(cabeceras, filas);
}
//  Secciones 
const vistas = {};
vistas.dashboard = () => {
  const ventas = todasLasOrdenes().filter((o) => o.estado !== "Cancelada").reduce((s, o) => s + totalOrden(o), 0);   // las canceladas no suman
  const nuevos = mensajes().filter((m) => !m.leido).length;
  return `<div class="kpis">
    ${kpi("Ventas totales", pesos(ventas))}
    ${kpi("Órdenes", todasLasOrdenes().length)}
    ${kpi("Productos", todosLosProductos().length)}
    ${kpi("Usuarios", todosLosUsuarios().length)}
    ${kpi("Mensajes nuevos", nuevos, nuevos > 0 ? "alerta" : "")}
  </div>
  <h2>Cambiar el stock de un producto</h2>
  <form id="formulario" class="caja" novalidate>
    <div class="campos">
      <label>Producto<select name="producto">${todosLosProductos().map((p) => `<option value="${p.id}">${esc(p.nombre)} (stock ${stockDe(p.id)})</option>`).join("")}</select></label>
      ${campo("stock", "Nuevo stock", "", "number")}
    </div>
    <p class="error-form" id="error-form"></p>
    <button type="submit">Guardar stock</button>
  </form>`;
};

vistas.ordenes = () => {
  const lista = [...todasLasOrdenes()].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));
  const filas = lista.map((o) => `
    <tr>
      <td>${esc(o.id)}</td><td>${o.fecha}</td><td>${esc(o.cliente)}</td>
      <td>${o.items.map((i) => esc(i.nombre) + " x" + i.cantidad).join(", ")}</td>
      <td>${pesos(totalOrden(o))}</td>
      <td><select data-accion="estado" data-id="${esc(o.id)}">${ESTADOS.map((e) => `<option ${e === o.estado ? "selected" : ""}>${e}</option>`).join("")}</select></td>
      <td class="acciones"><button class="peligro chico" data-accion="borrar" data-id="${esc(o.id)}">Eliminar</button></td>
    </tr>`).join("");
  return lista.length ? tabla(["Orden", "Fecha", "Cliente", "Productos", "Total", "Estado", ""], filas) : `<p class="vacio">No hay órdenes.</p>`;
};

vistas.productos = () => {
  const p = registro(todosLosProductos());
  const filas = todosLosProductos().map((x) => `
    <tr><td>${x.id}</td><td><img src="${esc(x.imagen)}" alt=""></td><td>${esc(x.nombre)}</td><td>${esc(x.categoria || "—")}</td><td>${pesos(x.precio)}</td>
    <td class="${stockDe(x.id) <= 5 ? "bajo" : ""}">${stockDe(x.id)}</td>${botones(x.id)}</tr>`).join("");
  const opciones = categorias().map((c) => `<option ${c.nombre === p.categoria ? "selected" : ""}>${esc(c.nombre)}</option>`).join("");
  return pagina("producto", ["ID", "", "Nombre", "Categoría", "Precio", "Stock", ""], filas,
    campo("nombre", "Nombre", p.nombre) +
    `<label>Categoría<select name="categoria"><option value="">Elige una…</option>${opciones}</select></label>` +
    campo("precio", "Precio (CLP)", p.precio, "number") +
    campo("stock", "Stock", p.id ? stockDe(p.id) : "", "number") +
    campo("imagen", "Imagen (ruta, ej: steam/terraria.jpg)", p.imagen));
};

vistas.categorias = () => {
  const filas = categorias().map((c) => `<tr><td>${c.id}</td><td>${esc(c.nombre)}</td><td>${todosLosProductos().filter((p) => p.categoria === c.nombre).length}</td>${botones(c.id)}</tr>`).join("");
  return pagina("categoría", ["ID", "Nombre", "Productos", ""], filas, campo("nombre", "Nombre", registro(categorias()).nombre));
};

vistas.usuarios = () => {
  const u = registro(todosLosUsuarios());
  const filas = todosLosUsuarios().map((x) => `<tr><td>${x.id}</td><td>${esc(x.nombre)}</td><td>${esc(x.email)}</td>${botones(x.id)}</tr>`).join("");
  return pagina("usuario", ["ID", "Nombre", "Correo", ""], filas, campo("nombre", "Nombre", u.nombre) + campo("email", "Correo", u.email));
};

// Reportes
vistas.reportes = () => {
  const vendidos = {};
  todasLasOrdenes().filter((o) => o.estado !== "Cancelada").forEach((o) => o.items.forEach((i) => (vendidos[i.nombre] = (vendidos[i.nombre] || 0) + i.cantidad)));
  const mejor = Object.entries(vendidos).sort((a, b) => b[1] - a[1])[0];
  const bajos = todosLosProductos().filter((p) => stockDe(p.id) <= 5);
  const lista = [...mensajes()].sort((a, b) => b.id - a.id);
  return `
    <div class="kpis">
      ${kpi("Más vendido", mejor ? esc(mejor[0]) + " (" + mejor[1] + ")" : "—")}
      ${kpi("Stock bajo", bajos.length ? bajos.map((p) => esc(p.nombre) + ": " + stockDe(p.id)).join("<br>") : "Todo bien", bajos.length ? "alerta" : "")}
    </div>
    <h2>Mensajes de clientes (${lista.length})</h2>
    ${lista.length === 0 ? `<p class="vacio">Nadie ha dejado mensajes todavía.</p>` : lista.map((m) => `
      <div class="caja mensaje">
        <p><strong>${esc(m.nombre)}</strong> · ${esc(m.email)} · ${m.fecha} ${m.leido ? "" : `<span class="chip estado-Pendiente">Nuevo</span>`}</p>
        <p>${esc(m.texto)}</p>
        <div class="fila-botones">
          ${m.leido ? "" : `<button class="sec chico" data-accion="leido" data-id="${m.id}">Marcar como leído</button>`}
          <button class="peligro chico" data-accion="borrar" data-id="${m.id}">Eliminar</button>
        </div>
      </div>`).join("")}`;
};

vistas.perfil = () => {
  const p = perfil();
  return `<form id="formulario" class="caja" novalidate>
    <div class="campos">${campo("nombre", "Nombre", p.nombre)}${campo("email", "Correo", p.email)}</div>
    <p class="error-form" id="error-form"></p>
    <button type="submit">Guardar cambios</button>
  </form>`;
};

// Guardar formularios
const guardar = {};

guardar.dashboard = (d) => {
  const stock = Number(d.stock);
  if (d.stock === "" || !Number.isInteger(stock) || stock < 0) return "El stock debe ser un número entero (0 o más).";
  guardarStock(d.producto, stock);   // la tienda usa este mismo stock
  return "";
};
const emailValido = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

guardar.productos = (d) => {
  const lista = todosLosProductos();
  const nombre = d.nombre.trim(), precio = Number(d.precio), stock = Number(d.stock);
  if (nombre.length < 3) return "El nombre debe tener al menos 3 letras.";
  if (lista.some((p) => p.nombre.toLowerCase() === nombre.toLowerCase() && p.id != editando)) return "Ya existe un producto con ese nombre.";
  if (!d.categoria) return "Elige una categoría.";
  if (!Number.isInteger(precio) || precio <= 0) return "El precio debe ser un número entero mayor a 0.";
  if (!Number.isInteger(stock) || stock < 0) return "El stock debe ser un número entero (0 o más).";
  if (!d.imagen.trim()) return "Falta la ruta de la imagen.";
  let p = lista.find((x) => x.id == editando);
  if (!p) {   
    p = { id: siguienteId(lista), plataforma: "PC", estrellas: "★★★★☆", video: "", generos: [d.categoria], descripcion: "Sin descripción." };
    lista.push(p);
  }
  Object.assign(p, { nombre: nombre, categoria: d.categoria, precio: precio, stock: stock, imagen: d.imagen.trim() });
  guardarProductos(lista);
  guardarStock(p.id, stock);
  return "";
};

guardar.categorias = (d) => {
  const nombre = d.nombre.trim(), lista = categorias();
  if (nombre.length < 3) return "El nombre debe tener al menos 3 letras.";
  if (lista.some((c) => c.nombre.toLowerCase() === nombre.toLowerCase() && c.id != editando)) return "Esa categoría ya existe.";
  const c = lista.find((x) => x.id == editando);
  if (!c) lista.push({ id: siguienteId(lista), nombre: nombre });
  else {   // al renombrar, los productos de esa categoría siguen el nuevo nombre
    guardarProductos(todosLosProductos().map((p) => (p.categoria === c.nombre ? { ...p, categoria: nombre } : p)));
    c.nombre = nombre;
  }
  guardarLocal("categorias", lista);
  return "";
};

guardar.usuarios = (d) => {
  const nombre = d.nombre.trim(), email = d.email.trim();
  const error = validarUsuario(nombre, email, editando === "nuevo" ? 0 : editando);   // validación de usuarios.js
  if (error) return error;
  const lista = todosLosUsuarios();
  const u = lista.find((x) => x.id == editando);
  if (u) Object.assign(u, { nombre: nombre, email: email });
  else lista.push({ id: siguienteId(lista), nombre: nombre, email: email });
  guardarUsuarios(lista);
  return "";
};

guardar.perfil = (d) => {
  if (d.nombre.trim().length < 3) return "El nombre debe tener al menos 3 letras.";
  if (!emailValido(d.email.trim())) return "El correo no es válido.";
  guardarLocal("perfilAdmin", { nombre: d.nombre.trim(), email: d.email.trim() });
  return "";
};

// ---------- Eliminar (devuelven el aviso) ----------
const borrar = {
  productos(id) {
    guardarProductos(todosLosProductos().filter((p) => p.id != id));
    guardarLocal("carrito", verCarrito().filter((i) => i.id != id));   // que no quede en ningún carrito
    return "Producto eliminado.";
  },
  categorias(id) {
    const c = categorias().find((x) => x.id == id);
    const usados = todosLosProductos().filter((p) => p.categoria === c.nombre).length;
    if (usados > 0) { avisoMalo = true; return `No se puede eliminar "${c.nombre}": la usan ${usados} producto(s).`; }
    guardarLocal("categorias", categorias().filter((x) => x.id != id));
    return "Categoría eliminada.";
  },
  usuarios(id) { guardarUsuarios(todosLosUsuarios().filter((u) => u.id != id)); return "Usuario eliminado."; },
  ordenes(id) { guardarLocal("ordenes", todasLasOrdenes().filter((o) => o.id != id)); return "Orden eliminada."; },
  reportes(id) { guardarLocal("mensajes", mensajes().filter((m) => m.id != id)); return "Mensaje eliminado."; }
};

// ---------- Dibujar y navegar ----------
function dibujar() {
  $("#contenido").innerHTML = `<h1>${titulos[seccion]}</h1>${aviso ? `<p class="aviso ${avisoMalo ? "mal" : "bien"}">${aviso}</p>` : ""}${vistas[seccion]()}`;
  document.querySelectorAll("#menu a").forEach((a) => a.classList.toggle("activo", a.dataset.sec === seccion));
  $("#nombre-admin").textContent = perfil().nombre;
}
function ir() {
  const nombre = location.hash.slice(1);
  seccion = vistas[nombre] ? nombre : "dashboard";
  editando = null; aviso = ""; avisoMalo = false;
  dibujar();
}
window.addEventListener("hashchange", ir);

// Clics en botones
$("#contenido").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-accion]");
  if (!b) return;
  const id = b.dataset.id;
  aviso = ""; avisoMalo = false;
  switch (b.dataset.accion) {
    case "nuevo": editando = "nuevo"; break;
    case "editar": editando = id; break;
    case "cancelar": editando = null; break;
    case "leido": guardarLocal("mensajes", mensajes().map((m) => (m.id == id ? { ...m, leido: true } : m))); break;
    case "borrar":
      if (!confirm("¿Seguro que quieres eliminarlo?")) return;
      aviso = borrar[seccion](id);
      break;
  }
  dibujar();
});

$("#contenido").addEventListener("change", (e) => {
  if (e.target.dataset.accion !== "estado") return;
  const lista = todasLasOrdenes();
  lista.find((o) => o.id === e.target.dataset.id).estado = e.target.value;
  guardarLocal("ordenes", lista);
  aviso = "Estado de la orden actualizado.";
  dibujar();
});

// Enviar formulario
$("#contenido").addEventListener("submit", (e) => {
  e.preventDefault();
  const error = guardar[seccion](Object.fromEntries(new FormData(e.target)));
  if (error) { $("#error-form").textContent = error; return; }   
  aviso = "Guardado correctamente.";
  avisoMalo = false;
  editando = null;
  dibujar();
});

ir();
