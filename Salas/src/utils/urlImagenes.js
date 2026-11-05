// Host que sirve /imagenes, /documentos e /inventario (alias de Apache).
// Definir VITE_IMAGENES_URL en Front/Salas/.env para cambiarlo sin tocar código.
const BASE = import.meta.env.VITE_IMAGENES_URL || 'http://10.10.10.191'

export const urlImagen = (ruta) => `${BASE}${ruta}`
