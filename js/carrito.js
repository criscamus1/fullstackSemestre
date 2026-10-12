function leer(clave, porDefecto) {
  try { return JSON.parse(localStorage.getItem(clave)) || porDefecto; }
  catch (e) { return porDefecto; }
}

// Productos: los editados por el admin, o los de productosInfo.js
function todosLosProductos() {
  const guardados = leer("productos", []);
  return guardados.length > 0 ? guardados : productosData;
}
function guardarProductos(lista) {
  localStorage.setItem("productos", JSON.stringify(lista));
}
function guardarStock(id, unidades) {
  const stocks = leer("stock", {});
  stocks[id] = unidades;
  localStorage.setItem("stock", JSON.stringify(stocks));
}
function buscar(id) {
  return todosLosProductos().find((p) => p.id == id);
}
function stockDe(id) {
  const p = buscar(id);
  return leer("stock", {})[id] ?? (p ? p.stock : 0) ?? 0;
}
function verCarrito() {
  return leer("carrito", []);
}

function cambiar(id, delta) {
  id = Number(id);
  if (delta > stockDe(id)) return false;
  const carrito = verCarrito();
  let item = carrito.find((i) => i.id === id);
  if (!item) { item = { id: id, cantidad: 0 }; carrito.push(item); }
  delta = Math.max(delta, -item.cantidad);
  item.cantidad += delta;

  guardarStock(id, stockDe(id) - delta);
  localStorage.setItem("carrito", JSON.stringify(carrito.filter((i) => i.cantidad > 0)));
  contador();
  return true;
}
function vaciar() {            
  verCarrito().forEach((i) => cambiar(i.id, -i.cantidad));
}
function pagar() {             
  localStorage.setItem("carrito", "[]");
  contador();
}

// Órdenes: las de ejemplo (ordenesInfo.js) o las guardadas en localStorage
function todasLasOrdenes() {
  return leer("ordenes", ordenesData);
}
function totalOrden(o) {
  return o.items.reduce((s, i) => s + i.precio * i.cantidad, 0);
}
// Guarda lo que hay en el carrito como una orden nueva (se llama justo antes de pagar)
function guardarOrden(numero) {
  const items = verCarrito().map((i) => {
    const p = buscar(i.id);
    return { id: p.id, nombre: p.nombre, precio: p.precio, cantidad: i.cantidad };
  });
  const lista = todasLasOrdenes();
  lista.push({ id: numero, fecha: new Date().toISOString().slice(0, 10), cliente: "Cliente web", estado: "Pendiente", items: items });
  localStorage.setItem("ordenes", JSON.stringify(lista));
}

function totalCarrito() {
  return verCarrito().reduce((s, i) => s + buscar(i.id).precio * i.cantidad, 0);
}
function cantidadCarrito() {
  return verCarrito().reduce((s, i) => s + i.cantidad, 0);
}
function contador() {
  const span = document.getElementById("contador-carrito");
  if (span) span.textContent = cantidadCarrito();
}
function etiquetaStock(n) {
  if (n <= 0) return `<span class="stock-agotado">Agotado</span>`;
  if (n <= 5) return `<span class="stock-bajo">${n === 1 ? "¡Última unidad!" : "¡Quedan " + n + "!"}</span>`;
  return `<span class="stock-ok">Stock: ${n}</span>`;
}
const pesos = (n) => "$" + n.toLocaleString("es-CL");

contador();
