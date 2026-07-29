// Sube este número cada vez que cambies algo importante en los archivos
// cacheados de abajo; obliga al navegador a detectar que este archivo
// cambió y a instalar la versión nueva del Service Worker.
const CACHE_NAME = 'escala-tiempo-v2';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  // No esperar a que se cierren las pestañas abiertas: activar la
  // versión nueva del Service Worker en cuanto termine de instalarse.
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('activate', (e) => {
  // Borra cualquier caché de una versión anterior (ej. "escala-tiempo-v1"),
  // para no dejar copias viejas guardadas por error ni ocupar espacio de más.
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Estrategia "red primero, caché como respaldo": intenta siempre
  // traer la versión más reciente del servidor. Solo si no hay
  // conexión (o falla la red), usa la última copia guardada.
  // Esto es justo lo contrario de la versión anterior ("caché primero,
  // para siempre"), que fue la causa de que la corrección de idiomas
  // no le llegara a nadie: con "caché primero" un archivo cacheado
  // una vez no se vuelve a comprobar jamás contra el servidor.
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
