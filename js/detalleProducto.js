const cont = document.getElementById("detalle-producto");
const p = buscar(new URLSearchParams(location.search).get("id"));   // busca el juego por su id

if (!p) {
  cont.innerHTML = "<p>No se encontró el producto solicitado.</p>";
} else {
  // Hay una sola foto por juego, así que las 4 miniaturas son "vistas" (zoom) de ella: clases v0..v3 en style.css
  const miniaturas = [0, 1, 2, 3].map((n) => `<button class="miniatura" data-n="${n}"><img src="${p.imagen}" class="v${n}"></button>`).join("");
  const trailer = p.video
    ? `<button class="btn-secundario" id="btn-trailer">▶ Ver tráiler</button>`
    : `<a class="link-trailer" target="_blank" href="https://www.youtube.com/results?search_query=${encodeURIComponent(p.nombre + " trailer")}">▶ Buscar tráiler en YouTube</a>`;

  cont.innerHTML = `
    <h2 class="detalle-titulo">${p.nombre}</h2>
    <div class="detalle-sub"><span class="etiqueta-plataforma">${p.plataforma}</span> <span class="estrellas">${p.estrellas}</span></div>
    <div class="detalle-grid">
      <div>
        <div class="galeria-principal"><div id="visor"></div></div>
        <div class="miniaturas">${miniaturas}</div>
        ${trailer}
      </div>
      <div>
        <p class="detalle-descripcion">${p.descripcion}</p>
        <div class="generos">${(p.generos || []).map((g) => `<span class="genero">${g}</span>`).join("")}</div>
        <div class="caja-compra">
          <p class="precio-detalle">${pesos(p.precio)}</p>
          <p id="stock-info"></p>
          <button id="btn-agregar" class="btn-comprar">Añadir al carrito</button>
          <button id="btn-comprar-ahora" class="btn-secundario">Comprar ahora</button>
          <p id="mensaje-carrito" class="mensaje-carrito"></p>
        </div>
      </div>
    </div>
`;

  // Fotos: al hacer clic en una miniatura se cambia la foto grande
  const visor = document.getElementById("visor");
  function verFoto(n) {
    visor.innerHTML = `<img src="${p.imagen}" class="v${n}">`;
    document.querySelectorAll(".miniatura").forEach((m, i) => m.classList.toggle("activa", i === n));
  }
  verFoto(0);
  document.querySelectorAll(".miniatura").forEach((m) => (m.onclick = () => verFoto(Number(m.dataset.n))));

  // Tráiler: reemplaza la foto grande por el video de YouTube
  if (p.video) {
    document.getElementById("btn-trailer").onclick = () => {
      visor.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${p.video}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    };
  }

  // Stock y compra
  const botones = [document.getElementById("btn-agregar"), document.getElementById("btn-comprar-ahora")];
  function mostrarStock() {
    document.getElementById("stock-info").innerHTML = etiquetaStock(stockDe(p.id));
    botones.forEach((b) => (b.disabled = stockDe(p.id) <= 0));
  }
  mostrarStock();
  botones[0].onclick = () => {
    const ok = cambiar(p.id, 1);                      // descuenta 1 de stock
    const msg = document.getElementById("mensaje-carrito");
    msg.textContent = ok ? p.nombre + " se agregó al carrito." : "No hay stock suficiente.";
    msg.className = "mensaje-carrito " + (ok ? "ok" : "error");
    mostrarStock();
  };
  botones[1].onclick = () => { if (cambiar(p.id, 1)) location.href = "carrito.html"; };
}
