const datosUsuarios=[
  { "id": 1, "nombre": "Juan Pérez", "email": "juan@example.com" },
  { "id": 2, "nombre": "María López", "email": "maria@example.com" },
  { "id": 4, "nombre": "Carlos Díaz", "email": "carlos@example.com" },
  { "id": 5, "nombre": "Juan Gómez", "email": "juan@example.com" },
  { "id": 6, "nombre": "Fernanda Sanhueza", "email": "fernanda@example.com" }
]

// Usuarios: los guardados por el admin o los de arriba
function todosLosUsuarios() {
  try { return JSON.parse(localStorage.getItem("usuarios")) || datosUsuarios; }
  catch (e) { return datosUsuarios; }
}
function guardarUsuarios(lista) {
  localStorage.setItem("usuarios", JSON.stringify(lista));
}
// Validación común (editar y crear): devuelve el texto del error o "" si todo está bien
function validarUsuario(nombre, email, idActual) {
  if (nombre.length < 3) return "El nombre debe tener al menos 3 letras.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "El correo no es válido.";
  const repetido = todosLosUsuarios().some((u) => u.email.toLowerCase() === email.toLowerCase() && u.id != idActual);
  return repetido ? "Ese correo ya lo usa otro usuario." : "";
}