import { FaHeart, FaEllipsisH, FaPlay } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Playlist.css"; // Layout y estilos generales
import "../SongItem/songItem.css"; // Estilos de la lista de canciones
import Player from "../Reproductor/Player";
import { PlayerProvider, usePlayer } from "../Reproductor/PlayerContext.jsx";

// Convierte segundos a m:ss
function formatDuration(seconds) {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

const PlaylistContent = () => {
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const { setCurrentSong, setCurrentIndex, setSongs } = usePlayer();

    useEffect(() => {
        if (!playlistId) return;

        const fetchPlaylist = async () => {
            try {
                console.log(`Obteniendo playlist con ID: ${playlistId}`);
                const response = await fetch(`http://localhost:5001/api/playlists/${playlistId}`);
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }
                const data = await response.json();
                console.log("Playlist cargada:", data);
                setPlaylist(data);
                setSongs(data.songs); // Actualiza la lista de canciones en el contexto
            } catch (error) {
                console.error("Error al obtener la playlist:", error);
            }
        };

        fetchPlaylist();
    }, [playlistId, setSongs]);

    if (!playlist) {
        return <p>Cargando playlist...</p>;
    }

    const handlePlaySong = (song, index) => {
        console.log(`Reproduciendo: ${song.name}`);
        setCurrentSong(song);
        setCurrentIndex(index);
    };

    return (
        <div className="layout">
            {/* Columna izquierda: reproductor */}
            <div className="box-sidebar">
                <Player />
            </div>

            {/* Columna derecha: contenido de la playlist */}
            <div className="box">
                <div className="play-cont">
                    <div className="image">
                        <img src={playlist.front_page} width="275" alt="Playlist Cover" />
                    </div>
                    <div className="playlist-info">
                        <p className="text-gray-300 text-sm uppercase">Lista</p>
                        <h1>{playlist.name}</h1>
                        <p>
                            Diego337 • Guardada {playlist.user} veces •{" "}
                            {playlist.songs.length} canciones
                        </p>
                    </div>
                </div>

                <div className="playlist-actions">
                    {/* Botón principal grande con solo el ícono */}
                    <button className="play-btn">
                        <FaPlay />
                    </button>
                    <div className="actions-right">
                        <FaHeart className="icon" />
                        <FaEllipsisH className="icon" />
                    </div>
                </div>

                <div className="song-cont">
                    {/* Cabecera: 6 columnas (#/Play, Portada, Título, Álbum, Fecha, Duración) */}
                    <div className="song-header">
                        <span># / Play</span>
                        <span>Portada</span>
                        <span>Título</span>
                        <span>Álbum</span>
                        <span>Fecha Añadida</span>
                        <span>Duración</span>
                    </div>

                    <div className="song-list">
                        {playlist.songs.map((song, index) => (
                            <div key={song.id || index} className="song-item">
                                {/* Columna 1: (# / botón al hover) */}
                                <div className="song-action">
                                    <span className="song-index">{index + 1}</span>
                                    <button
                                        className="play-icon"
                                        onClick={() => handlePlaySong(song, index)}
                                    >
                                        <FaPlay />
                                    </button>
                                </div>

                                {/* Columna 2: Portada */}
                                <img src={song.cover} alt={song.name} className="song-cover" />

                                {/* Columna 3: Título */}
                                <span className="song-title">{song.name}</span>

                                {/* Columna 4: Álbum */}
                                <span className="song-artist">
                  {song.album?.name || "Sin álbum"}
                </span>

                                {/* Columna 5: Fecha */}
                                <span className="song-date">
                  {song.song_playlist?.date || "Fecha desconocida"}
                </span>

                                {/* Columna 6: Duración (min:seg) */}
                                <span className="song-duration">
                  {formatDuration(song.duration)}
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Playlist = () => {
    return (
        <PlayerProvider>
            <PlaylistContent />
        </PlayerProvider>
    );
};

export default Playlist;
