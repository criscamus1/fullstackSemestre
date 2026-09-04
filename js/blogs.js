// Mostrar las noticias en blogs.html
const grillaBlogs = document.getElementById("grilla-blogs");

if (grillaBlogs) {
    blogsData.forEach(blog => {
        grillaBlogs.innerHTML += `
            <div class="col-md-4 mb-4">
                <a href="blogs_sesion.html?id=${blog.id}" class="blog-link">
                    <div class="card-blogs">
                        <img src="${blog.imagen}" alt="${blog.titulo}">

                        <div class="contenido-blog">
                            <p class="fecha-blog">${blog.fecha}</p>
                            <h3>${blog.titulo}</h3>
                            <p>${blog.resumen}</p>
                            <span class="leer-blog">Leer noticia →</span>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });
}
// Mostrar una noticia individual en blogs_sesion.html
const detalleBlog = document.getElementById("detalle-blog");

if (detalleBlog) {
    const parametros = new URLSearchParams(window.location.search);
    const id = Number(parametros.get("id"));
    const blog = blogsData.find(blog => blog.id === id);

    if (blog) {
        detalleBlog.innerHTML = `
            <h1>${blog.titulo}</h1>
            <p class="fecha-blog">${blog.fecha}</p>

            <img src="${blog.imagen}" alt="${blog.titulo}" class="imagen-detalle">

            <p class="resumen-detalle">${blog.resumen}</p>

            ${blog.parrafos.map(parrafo => `
                <p>${parrafo}</p>
            `).join("")}

            <a href="blogs.html" class="btn btn-primary">← Volver a las noticias</a>
        `;
    } else {
        detalleBlog.innerHTML = `
            <h1>Noticia no encontrada</h1>
            <a href="blogs.html" class="btn btn-primary">← Volver a las noticias</a>
        `;
    }
}
