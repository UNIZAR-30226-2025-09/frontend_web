// Detectar el modo de ejecución basado en una variable de entorno
// Vite expone las variables de entorno con el prefijo VITE_
const mode = import.meta.env.MODE || 'enlocal';

// Configurar las URLs según el modo
let BASE_URL, MEDIA_URL;

if (mode === 'nube') {
    // Configuración para modo cloud
    BASE_URL = "http://164.90.160.181/request/api";
    MEDIA_URL = "http://164.90.160.181"; // URL para archivos multimedia
} else {
    // Configuración para modo local
    BASE_URL = "http://localhost/request/api";
    MEDIA_URL = "http://localhost:5001"; // URL para archivos multimedia
}

// Exportamos las URLs para que estén disponibles en otros archivos
export { BASE_URL, MEDIA_URL };

// PRE:
// Función reutilizable para hacer peticiones HTTP al backend.
// Se le pasa un endpoint (relativo a la base), y un objeto de opciones como método, body, headers, etc.
// Usa fetch con JSON y lanza errores si la respuesta no es exitosa.
export const apiFetch = async (endpoint, options = {}) => {
    const { body, ...rest } = options;

    console.log(`Ejecutando en modo: ${mode}, usando ${BASE_URL}`);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            ...(rest.headers || {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`Fetch error: ${response.status}`);
    }

    // POST:
    // Devolvemos la respuesta parseada como JSON
    return response.json();
};