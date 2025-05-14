// Detectar el modo de ejecución basado en una variable de entorno
const mode = import.meta.env.MODE || 'enlocal';

// Configurar la URL base según el modo
let BASE_URL;

if (mode === 'nube') {
    // Configuración para modo cloud
    BASE_URL = "http://164.90.160.181/request";
} else {
    // Configuración para modo local
    BASE_URL = "http://localhost/request";
}

// PRE:
// Esta función recibe un path relativo (como una imagen del backend) y construye una URL absoluta
// usando una IP base definida en BASE_URL. Si el path ya es una URL absoluta, la devuelve sin cambios.
// Si no se pasa un path, devuelve una imagen fallback.
export const getImageUrl = (path, fallback = "/default.jpg") => {
    if (!path) return fallback;

    // Si el path ya es una URL completa, la devolvemos tal cual
    if (path.startsWith("http")) return path;

    //console.log(`Obteniendo imagen en modo: ${mode}, usando ${BASE_URL}`);

    // POST:
    // Devolvemos la URL completa uniendo BASE_URL + path limpio (sin / inicial)
    return `${BASE_URL}/${path.replace(/^\/?/, "")}`;
};

// Añadir mas funciones dependiendo de lo que querais obtener...