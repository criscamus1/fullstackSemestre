const cont = document.getElementById("detalle-producto");
const p = buscar(new URLSearchParams(location.search).get("id"));   // busca el juego por su id

if (!p) {
  cont.innerHTML = "<p>No se encontró el producto solicitado.</p>";
} else {
  // Fotos: las de "galeria" (4 imágenes del juego). Si no tiene, se usan 4 vistas ampliadas de la portada (clases v0..v3).
  const fotos = (p.galeria || [p.imagen, p.imagen, p.imagen, p.imagen]).map((src, n) => ({ src: src, clase: p.galeria ? "real" : "v" + n }));
  // El tráiler va primero, como en Steam
  const items = p.video ? [{ video: p.video, src: p.imagen, clase: "v0" }, ...fotos] : fotos;
  const miniaturas = items.map((f, n) => `
    <button class="miniatura" data-n="${n}"><img src="${f.src}" class="${f.clase}">${f.video ? '<span class="play">▶</span>' : ""}</button>`).join("");
  const enlaceYT = p.video ? "watch?v=" + p.video : "results?search_query=" + encodeURIComponent(p.nombre + " trailer");

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

  // Foto grande: al hacer clic en una miniatura se cambia. Si es el tráiler, muestra un botón ▶ que lo reproduce.
  const visor = document.getElementById("visor");
  function ver(n) {
    const f = items[n];
    visor.innerHTML = f.video
      ? `<div class="portada-video"><img src="${f.src}"><button class="play-grande" id="btn-play">▶</button><span class="texto-trailer">Ver tráiler de ${p.nombre}</span></div>`
      : `<img src="${f.src}" class="${f.clase}">`;
    if (f.video) {
      document.getElementById("btn-play").onclick = () => {
        visor.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${f.video}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
      };
    }
    document.querySelectorAll(".miniatura").forEach((m, i) => m.classList.toggle("activa", i === n));
  }
  ver(0);
  document.querySelectorAll(".miniatura").forEach((m) => (m.onclick = () => ver(Number(m.dataset.n))));

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
