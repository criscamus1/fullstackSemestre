function leer(clave, porDefecto) {
  try { return JSON.parse(localStorage.getItem(clave)) || porDefecto; }
  catch (e) { return porDefecto; }
}

// Productos: los editados por el admin, o los de productosInfo.js
function todosLosProductos() {
  const guardados = leer("productos", []);
  return guardados.length > 0 ? guardados : productosData;
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

  const stocks = leer("stock", {});
  stocks[id] = stockDe(id) - delta;
  localStorage.setItem("stock", JSON.stringify(stocks));
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
