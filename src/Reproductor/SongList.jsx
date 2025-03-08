// src/Reproductor/SongList.jsx
import React, { useState, useEffect } from "react";
import { usePlayer } from "./PlayerContext"; // Ajusta la ruta según tu proyecto

function SongList() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Aquí accedemos al setter del contexto
    const { setCurrentSong } = usePlayer();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/songs");
                if (!response.ok) {
                    console.error("Error de red:", response.status, response.statusText);
                    throw new Error(
                        `Error HTTP! Status: ${response.status} ${response.statusText}`
                    );
                }
                const data = await response.json();
                setSongs(data);
            } catch (e) {
                console.error("Error al cargar datos:", e);
                setError(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <p>Cargando canciones...</p>;
    }

    if (error) {
        return <p>Error al cargar las canciones: {error.message}</p>;
    }

    return (
        <ul>
            {songs.map((song) => (
                <li
                    key={song.id}
                    // Al hacer clic, establecemos la canción actual en el context
                    onClick={() => setCurrentSong(song)}
                    style={{ cursor: "pointer" }} // Para mostrar que se puede hacer clic
                >
                    {song.name} -{" "}
                    {song.artists && song.artists.length > 0
                        ? song.artists.map((artist) => artist.name).join(", ")
                        : "Artista desconocido"}
                </li>
            ))}
        </ul>
    );
}

export default SongList;
