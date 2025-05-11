// NUBE
export const BASE_URL = "http://164.90.160.181/request/api";
export const MEDIA_URL = "http://164.90.160.181"; // URL para archivos multimedia

// LOCAL
//export const BASE_URL = "http://localhost/request/api";
//export const MEDIA_URL = "http://localhost:5001"; // URL para archivos multimedia

// PRE:
// Función reutilizable para hacer peticiones HTTP al backend.
// Se le pasa un endpoint (relativo a la base), y un objeto de opciones como método, body, headers, etc.
// Usa fetch con JSON y lanza errores si la respuesta no es exitosa.
export const apiFetch = async (endpoint, options = {}) => {
    const { body, ...rest } = options;

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



