
const ordenesData = [
  { id: "TV-418230", fecha: "2026-09-28", cliente: "Juan Pérez", estado: "Entregada", items: [
    { id: 5, nombre: "Terraria", precio: 9990, cantidad: 2 },
    { id: 3, nombre: "Project Zomboid", precio: 9990, cantidad: 1 } ] },
  { id: "TV-552071", fecha: "2026-10-01", cliente: "María López", estado: "Entregada", items: [
    { id: 11, nombre: "ELDEN RING Tarnished Edition", precio: 34990, cantidad: 1 },
    { id: 6, nombre: "Lies of P: Complete Edition", precio: 39990, cantidad: 1 } ] },
  { id: "TV-637914", fecha: "2026-10-03", cliente: "Carlos Díaz", estado: "Enviada", items: [
    { id: 8, nombre: "Super Mario Bros. Wonder", precio: 54990, cantidad: 1 },
    { id: 10, nombre: "Yoshi and the Mysterious Book", precio: 54990, cantidad: 1 } ] },
  { id: "TV-701285", fecha: "2026-10-05", cliente: "Fernanda Sanhueza", estado: "Pendiente", items: [
    { id: 12, nombre: "Resident Evil Requiem", precio: 44990, cantidad: 1 } ] },
  { id: "TV-819346", fecha: "2026-10-07", cliente: "Juan Gómez", estado: "Cancelada", items: [
    { id: 2, nombre: "EA Sports FC 27", precio: 48990, cantidad: 1 } ] },
  { id: "TV-926450", fecha: "2026-10-09", cliente: "María López", estado: "Pendiente", items: [
    { id: 9, nombre: "Pokémon Pokopia", precio: 49990, cantidad: 1 },
    { id: 4, nombre: "Raft: The Final Chapter", precio: 12990, cantidad: 2 },
    { id: 5, nombre: "Terraria", precio: 9990, cantidad: 1 } ] },
  { id: "TV-934118", fecha: "2026-10-10", cliente: "Juan Pérez", estado: "Enviada", items: [
    { id: 1, nombre: "Crimson Desert", precio: 34990, cantidad: 1 },
    { id: 3, nombre: "Project Zomboid", precio: 9990, cantidad: 2 } ] }
];

// Mensajes de ejemplo de "Contáctanos" (se ven en Reportes). leido: false = aparece como "Nuevo"
const mensajesData = [
  { id: 1, fecha: "2026-10-06", nombre: "Camila Rojas", email: "camila@example.com", texto: "Hola, ¿cuándo vuelve a haber stock de Final Fantasy X?", leido: true },
  { id: 2, fecha: "2026-10-09", nombre: "Pedro Soto", email: "pedro@example.com", texto: "Mi pedido TV-926450 aún aparece pendiente, ¿pueden revisarlo?", leido: false },
  { id: 3, fecha: "2026-10-11", nombre: "Valentina Muñoz", email: "vale@example.com", texto: "Me encanta la tienda. ¿Piensan agregar más juegos de Nintendo?", leido: false }
];
