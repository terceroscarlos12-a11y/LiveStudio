const DB_NAME = "LiveStudioDB";
const DB_VERSION = 1;
const STORE_NAME = "imagenes";

function abrirDB() {
  return new Promise((resolve, reject) => {
    const solicitud = indexedDB.open(DB_NAME, DB_VERSION);

    solicitud.onupgradeneeded = (evento) => {
      const db = evento.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    solicitud.onsuccess = () => resolve(solicitud.result);
    solicitud.onerror = () => reject("Error al abrir IndexedDB");
  });
}

async function guardarImagenLocal(clave, archivo) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const transaccion = db.transaction(STORE_NAME, "readwrite");
    const almacen = transaccion.objectStore(STORE_NAME);
    const peticion = almacen.put(archivo, clave);

    peticion.onsuccess = () => resolve(true);
    peticion.onerror = () => reject("No se pudo guardar la imagen");
  });
}

async function obtenerImagenLocal(clave) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const transaccion = db.transaction(STORE_NAME, "readonly");
    const almacen = transaccion.objectStore(STORE_NAME);
    const peticion = almacen.get(clave);

    peticion.onsuccess = () => resolve(peticion.result || null);
    peticion.onerror = () => reject("No se pudo leer la imagen");
  });
}

function guardarPreferencia(clave, valor) {
  localStorage.setItem(`livestudio_${clave}`, JSON.stringify(valor));
}

function obtenerPreferencia(clave, valorPorDefecto) {
  const dato = localStorage.getItem(`livestudio_${clave}`);
  return dato ? JSON.parse(dato) : valorPorDefecto;
}

