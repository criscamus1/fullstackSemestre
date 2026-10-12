const formContacto = document.getElementById("registro");
const avisoContacto = document.getElementById("aviso-contacto");

formContacto.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const texto = document.getElementById("contenido").value.trim();

  let error = "";
  if (nombre.length < 3) error = "El nombre debe tener al menos 3 letras.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) error = "El correo no es válido.";
  else if (texto.length < 10) error = "El mensaje debe tener al menos 10 caracteres.";

  if (error) {
    avisoContacto.textContent = error;
    avisoContacto.className = "mt-2 error";
    return;
  }
  const mensajes = leer("mensajes", mensajesData);
  mensajes.push({ id: Math.max(0, ...mensajes.map((m) => m.id)) + 1, fecha: new Date().toISOString().slice(0, 10), nombre: nombre, email: correo, texto: texto, leido: false });
  localStorage.setItem("mensajes", JSON.stringify(mensajes));
  formContacto.reset();
  avisoContacto.textContent = "¡Mensaje enviado! Te responderemos pronto.";
  avisoContacto.className = "mt-2 stock-ok";
});
