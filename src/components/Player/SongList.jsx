// src/Reproductor/SongList.jsx
import { useState, useEffect } from "react";
import {useOutletContext} from "react-router-dom";
import { apiFetch } from "#utils/apiFetch"; // Importamos apiFetch simplemente

function SongList() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Extraemos del contexto lo que necesitamos
    const {
        songs,
        setSongs,
        setCurrentSong,
        setCurrentIndex
    } = useOutletContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Usamos apiFetch directamente 
                const data = await apiFetch("/songs");
                
                // Guardamos la lista completa de canciones en el contexto
                setSongs(data);
            } catch (e) {
                console.error("Error al cargar datos:", e);
                setError(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [setSongs]);

    if (loading) return <p>Cargando canciones...</p>;
    if (error) return <p>Error al cargar las canciones: {error.message}</p>;

    return (
        <ul>
            {songs.map((song, index) => (
                <li
                    key={song.id}
                    onClick={() => {
                        // Cuando hacemos clic, establecemos la canción y su índice
                        setCurrentSong(song);
                        setCurrentIndex(index);
                    }}
                    style={{ cursor: "pointer" }}
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