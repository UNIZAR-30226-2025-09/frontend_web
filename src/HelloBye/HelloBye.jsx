import React, { useEffect, useState } from "react";

const HelloBye = () => {
    const [message, setMessage] = useState("");
    const [farewell, setFarewell] = useState("");

    useEffect(() => {
        fetch("/request/api/hello")
            .then(async (res) => {
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    setMessage(`El servidor me saluda con una API: ${data.message}`);
                } catch (error) {
                    console.error("Error al parsear JSON en /api/hello:", text);
                }
            })
            .catch((err) => console.error("Error en la petición a /api/hello:", err));

        fetch("/request/api/bye")
            .then(async (res) => {
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    setFarewell(`El servidor se despide con una API: ${data.message}`);
                } catch (error) {
                    console.error("Error al parsear JSON en /api/bye:", text);
                }
            })
            .catch((err) => console.error("Error en la petición a /api/bye:", err));
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
            <h1>React + Nginx + Node</h1>
            <p>{message}</p>
            <p>{farewell}</p>
        </div>
    );
};

export default HelloBye;