// NUBE
const BASE_URL = "http://164.90.160.181/request";
// LOCAL
//const BASE_URL = "http://localhost/request";

// PRE:
// Esta función recibe un path relativo (como una imagen del backend) y construye una URL absoluta
// usando una IP base definida en BACKEND. Si el path ya es una URL absoluta, la devuelve sin cambios.
// Si no se pasa un path, devuelve una imagen fallback.
export const getImageUrl = (path, fallback = "/default.jpg") => {
    if (!path) return fallback;

    // Si el path ya es una URL completa, la devolvemos tal cual
    if (path.startsWith("http")) return path;

    // POST:
    // Devolvemos la URL completa uniendo BASE_IP + path limpio (sin / inicial)
    return `${BASE_URL}/${path.replace(/^\/?/, "")}`;
};

// Añadir mas funciones dependiendo de lo que querais obtener...