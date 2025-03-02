import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
    const [message, setMessage] = useState("Cargando...");

    // Hacer petición a la API del backend al cargar el componente
    useEffect(() => {
        fetch("http://localhost:5000/api/hello") // URL del backend
            .then((response) => response.json())
            .then((data) => setMessage(data.message))
            .catch((error) => console.error("Error:", error));
    }, []);

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <h2>{message}</h2> {/* Aquí se mostrará el mensaje del backend */}
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

export default App;
