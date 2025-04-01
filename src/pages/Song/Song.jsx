import {FaHeart, FaEllipsisH, FaPlay, FaPause} from "react-icons/fa";
import { useEffect, useState } from "react";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import { apiFetch } from "#utils/apiFetch"; // Suponiendo que esta función existe
import { getImageUrl } from "#utils/getImageUrl"; // Suponiendo que esta función existe
import "./Song.css";
import {PlayerProvider} from "../../components/Player/PlayerContext.jsx";
import axios from "axios"; // Estilos para las canciones

// Convierte segundos a m:ss
function formatDuration(seconds) {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

const SongContent = () => {
    const { songId } = useParams();
    const [song, setSong] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const user_Id = JSON.parse(localStorage.getItem('user')).id; // Asegúrate de que la clave sea la correcta
    const { setCurrentSong, setActiveSection, activeSection, setCurrentIndex, setSongs, isPlaying, 
            setIsPlaying, setPlaylistActive, songActive, setSongActive, currentSong } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Entrando a Song, activando sección...");

        if (activeSection !== "songs") {
            setActiveSection("songs");
        }
    }, [setActiveSection, activeSection]);

    useEffect(() => {
        if (!songId) return;

        const fetchSong = async () => {
            try {
                console.log(`Obteniendo canción con ID: ${songId}`);

                const data = await apiFetch(`/songs/${songId}`, {
                    method: "GET"
                });

                const url = `http://localhost:5001/api/song_like/${songId}/like?userId=${user_Id}`;
                console.log("useEffect - Llamando a URL:", url);

                const response = await axios.get(url);
                console.log("useEffect - Respuesta del endpoint checkIfLiked:", response.data);

                setIsLiked(response.data.isLiked);

                console.log("Canción cargada:", data);
                setSong(data);

            } catch (error) {
                console.error("Error al obtener la canción:", error);
            }
        };

        fetchSong();
    }, [songId, user_Id]);

    const toggleLike = async () => {
        try {
            // Primero obtener o crear la playlist de "Me Gusta"
            const likedPlaylistRes = await axios.post('http://localhost:5001/api/playlists/songliked', {
                user_id: user_Id
            });
            console.log("Playlist de Me Gusta obtenida/creada:", likedPlaylistRes.data.playlist);

            const playlistId = likedPlaylistRes.data.playlist.id; // Obtener el ID de la playlist

            // Luego agregar la canción a esa playlist

            const response = await axios.post(`http://localhost:5001/api/song_like/${songId}/like`, {
                user_id: user_Id,
                playlist_id: playlistId // Pasar el ID de la playlist correcta
            });

            console.log("Respuesta del servidor:", response.data);
            setIsLiked(response.data.liked);
        } catch (error) {
            console.error("Error al agregar/eliminar el like", error);
        }
    };

    const handlePlaySong = () => {
        console.log(`Reproduciendo: ${song.name}`);
        setCurrentSong(song);
        setCurrentIndex(0); // Suponiendo que sea la primera canción
        setSongs([song]); // En este caso solo se reproduce esta canción
    };

    const handlePlaySongs = (isPlaying) => {
        console.log("Reproduciendo canciones en modo aleatorio...");

        if(!isPlaying) {
            setCurrentSong(song); // o la canción que desees
            setCurrentIndex(0); // O el índice correspondiente
            setSongs([song]); // Actualiza las canciones

            setSongActive(songId);
            setPlaylistActive(0);
        }

        console.log("Cambiando isplaying en playlist");
        setIsPlaying(!isPlaying);
    };
    // Asegúrate de que 'song' esté disponible antes de intentar acceder a 'song.type'
    const isSingle = song?.type !== "album"; // Corregir la condición
    console.log("es single : ", isSingle);

    useEffect(() => {
        if (song && !isSingle && song.album && song.album[0]) {
            console.log("Redirigiendo a la playlist...", song.album[0]);
            navigate(`/playlist/${song.album[0].id}`);
        }
    }, [song, isSingle, navigate]);

    if (!song) {
        return <p>Cargando canción...</p>;
    }

    return (
        <div className="song-layout">
            <div className="song-box">
                <div className="song-cont">
                    <div className="song-image">
                        <img
                            src={getImageUrl(song.photo_video)}
                            alt="Song Cover"
                            width="275"
                            onError={(e) => (e.target.src = "/default-song.jpg")}
                        />
                    </div>
                    <div className="song-info">
                        <h1>{song.name}</h1>
                        <p>{song.artist?.nickname || "Desconocido"}</p>
                        <p>Sencillo</p> {/* Aquí podrías agregar más información de sencillo */}
                        <p>{formatDuration(song.duration)}</p>
                    </div>
                </div>

                <div className="song-actions">
                    <div className="rep-cont">
                        <button
                            className="play-btn"
                            onClick={() => handlePlaySongs(isPlaying)}
                        >
                            {songActive === songId && isPlaying ? <FaPause/> : <FaPlay/>}
                        </button>
                    </div>

                    <div className="actions-right">
                        <button className="like-btn" onClick={toggleLike}>
                            <FaHeart className={`icon heart-icon ${isLiked ? "liked" : ""}`}/>
                        </button>
                        <FaEllipsisH className="icon"/>
                    </div>
                </div>
                {/* Cabecera: 6 columnas (#/Play, Portada, Título, Álbum, Fecha, Duración) */}
                <div className="song-header">
                    <span># / Play</span>
                    <span>Portada</span>
                    <span>Título</span>
                    <span>Álbum</span>
                    <span>Fecha Añadida</span>
                    <span>Duración</span>
                </div>
                <div className="song-cont">

                    <div className="song-list">
                            <div key={song.id || 0} className="song-item">
                                {/* Columna 1: (# / botón al hover) */}
                                <div className="song-action">
                                    <span className="song-index">{1}</span>
                                    <button
                                        className="play-icon"
                                        onClick={handlePlaySong}
                                    >
                                        <FaPlay/>
                                    </button>
                                </div>

                                {/* Columna 2: Portada */}
                                <img src={getImageUrl(song.photo_video)} alt={song.name} className="song-cover"/>

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
                    </div>
                </div>
            </div>
        </div>
    );
};

const Song = () => {
    return (
        <PlayerProvider>
            <SongContent/>
        </PlayerProvider>
    );
};

export default Song;
