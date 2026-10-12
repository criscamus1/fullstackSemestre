// ===== Dibuja las partes que cambian: carrito, stock del catálogo y destacados =====

// 1) Stock en cada tarjeta de productos.html
document.querySelectorAll(".stock-tag").forEach((tag) => {
  const id = new URL(tag.closest("a").href).searchParams.get("id");
  tag.innerHTML = etiquetaStock(stockDe(id));
});

// 2) Juegos destacados en index.html (4 con stock)
const destacados = document.getElementById("destacados");
if (destacados) {
  destacados.innerHTML = todosLosProductos()
    .filter((p) => stockDe(p.id) > 0).slice(0, 4)
    .map((p) => `
      <a href="detalle_producto.html?id=${p.id}" class="tarjeta">
        <img src="${p.imagen}" alt="${p.nombre}">
        <span class="etiqueta-plataforma">${p.plataforma}</span>
        <h3>${p.nombre}</h3>
        <p class="estrellas">${p.estrellas}</p>
        <p class="precio">${pesos(p.precio)}</p>
      </a>`).join("");
}

// 3) Página carrito.html
const zona = document.getElementById("contenido-carrito");
function dibujarCarrito() {
  const carrito = verCarrito();
  if (carrito.length === 0) {
    zona.innerHTML = `<div class="carrito-vacio"><p>Tu carrito está vacío.</p><a href="productos.html" class="btn-comprar">Ver productos</a></div>`;
    return;
  }
  const filas = carrito.map((i) => {
    const p = buscar(i.id);
    return `
      <tr>
        <td><img src="${p.imagen}" alt="${p.nombre}" class="mini-carrito"></td>
        <td><a href="detalle_producto.html?id=${p.id}">${p.nombre}</a></td>
        <td>${pesos(p.precio)}</td>
        <td class="cantidad">
          <button class="btn-cant" data-id="${p.id}" data-delta="-1">−</button>
          <span>${i.cantidad}</span>
          <button class="btn-cant" data-id="${p.id}" data-delta="1" ${stockDe(p.id) <= 0 ? "disabled" : ""}>+</button>
        </td>
        <td>${pesos(p.precio * i.cantidad)}</td>
        <td><button class="btn-quitar" data-id="${p.id}" data-delta="${-i.cantidad}">✕</button></td>
      </tr>`;
  }).join("");
  zona.innerHTML = `
    <div class="carrito-layout">
      <div class="tabla-carrito"><table class="table align-middle">
        <thead><tr><th></th><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
        <tbody>${filas}</tbody></table></div>
      <aside class="resumen-carrito">
        <h4>Resumen</h4>
        <p>Productos: <strong>${cantidadCarrito()}</strong></p>
        <p class="total">Total: ${pesos(totalCarrito())}</p>
        <button class="btn-comprar" id="btn-pagar">Pagar ahora</button>
        <button class="btn-secundario" id="btn-vaciar">Vaciar carrito</button>
      </aside>
    </div>`;
}
if (zona) {
  dibujarCarrito();
  zona.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.id === "btn-vaciar") vaciar();
    else if (b.id === "btn-pagar") {
      const orden = "TV-" + Math.floor(100000 + Math.random() * 900000);
      const total = totalCarrito();
      pagar();
      zona.innerHTML = `<div class="compra-exitosa"><h3>¡Compra realizada con éxito!</h3><p>Número de orden: <strong>${orden}</strong></p><p class="total">Total pagado: ${pesos(total)}</p><a href="productos.html" class="btn-comprar">Seguir comprando</a></div>`;
      return;
    } else cambiar(b.dataset.id, Number(b.dataset.delta));
    dibujarCarrito();
  });
}
