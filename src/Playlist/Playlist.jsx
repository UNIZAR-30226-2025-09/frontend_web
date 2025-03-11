import { FaPlay, FaHeart, FaEllipsisH } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Playlist.css";
import Player from "../Reproductor/Player";
import { PlayerProvider, usePlayer } from "../Reproductor/PlayerContext.jsx";

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
                // Actualiza la lista de canciones en el contexto
                setSongs(data.songs);
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
                        <p>Diego337 • Guardada {playlist.user} veces • {playlist.songs.length} canciones</p>
                    </div>
                </div>
                <div className="playlist-actions">
                    <button className="play-btn">
                        <FaPlay />
                    </button>
                    <div className="actions-right">
                        <FaHeart className="icon" />
                        <FaEllipsisH className="icon" />
                    </div>
                </div>
                <div className="song-cont">
                    <div className="song-header">
                        <span>#</span>
                        <span></span>
                        <span>Título</span>
                        <span>Álbum</span>
                        <span>Fecha Añadida</span>
                        <span>Duración</span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="song-list">
                        {playlist.songs.map((song, index) => (
                            <div key={song.id || index} className="song-item">
                                <span className="song-index">{index + 1}</span>
                                <button className="play-icon" onClick={() => handlePlaySong(song, index)}>
                                    <FaPlay />
                                </button>
                                <img src={song.cover} alt={song.name} className="song-cover" />
                                <span className="song-title">{song.name}</span>
                                <span>{song.album?.name || "Sin álbum"}</span>
                                <span className="song-date">{song.song_playlist?.date || "Fecha desconocida"}</span>
                                <span className="song-duration">{song.duration}</span>
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
