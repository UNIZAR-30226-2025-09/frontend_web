// NUBE
//export const BASE_URL = "http://164.90.160.181/request/api";
//export const MEDIA_URL = "http://164.90.160.181"; // URL para archivos multimedia

// LOCAL
export const BASE_URL = "http://localhost/request/api";
export const MEDIA_URL = "http://localhost:5001"; // URL para archivos multimedia

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

    // Si la respuesta no es exitosa, parseamos el JSON del error y lanzamos con status
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || "Error en la petición");
        error.status = response.status;
        throw error;
    }

    // Si todo va bien, devolvemos el JSON
    return response.json();
};




