import { FaHeart, FaEllipsisH, FaPlay } from "react-icons/fa";
import { useEffect, useState } from "react";
import {useOutletContext, useParams} from "react-router-dom";
import "./Playlist.css"; // Layout y estilos generales
import "../../components/SongItem/SongItem.css"; // Estilos de la lista de canciones
import { PlayerProvider} from "../../components/Player/PlayerContext.jsx";
import {SlPlaylist} from "react-icons/sl";

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
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [isShuffling, setIsShuffling] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const user_Id = 2;
    const { setCurrentSong, setActiveSection, activeSection, setCurrentIndex, setSongs } = useOutletContext();


    useEffect(() => {
        console.log(" Entrando a Playlist, activando sección...");

        if (activeSection !== "playlists") {
            setActiveSection("playlists");
        }
    }, [setActiveSection, activeSection]);

    // Alternar el estado del modo aleatorio
    const toggleShuffle = () => {
        setIsShuffling(prev => !prev);
    };

    // Función para mezclar la lista (algoritmo de Fisher-Yates)
    const shuffleArray = (array) => {
        let shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

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
                console.log("Canciones de la playlist", data.songs);
                // Verificar si el usuario ya ha dado like
                const likeResponse = await fetch(`http://localhost:5001/api/playlists/${playlistId}/like?user_id=${user_Id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                const likeData = await likeResponse.json();
                setIsLiked(likeData.isLiked);
            } catch (error) {
                console.json("Error al obtener la playlist:", error);
            }
        };

        fetchPlaylist();
    }, [playlistId, user_Id]);

    const toggleLike = async () => {
        try {
            const method = "POST"; // Siempre hacemos una petición POST (Sequelize maneja el toggle)

            console.log(" Enviando petición de like/unlike:");
            console.log(" user_id:", user_Id);
            console.log(" playlist_id:", playlistId);

            const response = await fetch(`http://localhost:5001/api/playlists/${playlistId}/like`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user_Id })
            });

            const responseData = await response.json();
            console.log(" Respuesta del servidor:", responseData);

            if (!response.ok) throw new Error(responseData.error || "Error al cambiar el estado del like");

            setIsLiked(responseData.liked);
        } catch (error) {
            console.error("Error al dar/quitar like:", error);
        }
    };




    if (!playlist) {
        return <p>Cargando playlist...</p>;
    }

    const handlePlaySong = (song, index, songs) => {
        console.log(`Reproduciendo: ${song.name}`);
        console.log("Guardando canción en el estado:", song);
        setCurrentSong( song );
        setCurrentIndex( index );
        setSongs(songs);
    };
    const handlePlaySongs = (songs) => {
        console.log("Reproduciendo canciones en modo aleatorio...");

        if(isShuffling){
            // Shuffle array of songs
            const shuffledSongs = shuffleArray(songs);
            // Reproducir la primera canción del array mezclado
            setCurrentSong(shuffledSongs[0]); // o la canción que desees
            setCurrentIndex(0); // O el índice correspondiente
            setSongs(shuffledSongs); // Actualiza las canciones
        }
        else{
            setCurrentSong(songs[0]); // o la canción que desees
            setCurrentIndex(0); // O el índice correspondiente
            setSongs(songs); // Actualiza las canciones
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = async () => {
        try {
            const updatedPlaylist = {
                ...playlist,
                name: newTitle || playlist.name,
                description: newDescription || playlist.description
            };

            const response = await fetch(`http://localhost:5001/api/playlists/${playlistId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedPlaylist)
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar: ${response.status}`);
            }

            const data = await response.json();
            setPlaylist(data);
            setIsEditing(false);
            console.log("Playlist actualizada en el backend:", data);

            setTimeout(() => {
                window.location.reload();
            }, 500);

        } catch (error) {
            console.error("Error al actualizar la playlist:", error);
        }
    };

    return (
        <div className="layout">
            {/* Columna derecha: contenido de la playlist */}
            <div className="box">
                <div className="play-cont">
                    <div className="image" onClick={handleEditToggle} style={{cursor: "pointer"}}>
                        <img src={playlist.front_page} width="275" alt="Playlist Cover"/>
                    </div>
                    <div className="playlist-info">
                        {isEditing ? (
                            <div className="popup-overlay">
                                <div className="popup-content">
                                    <label htmlFor="title">Título de la Playlist</label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="edit-input"
                                    />

                                    <label htmlFor="description">Descripción</label>
                                    <textarea
                                        id="description"
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        className="edit-input"
                                    />

                                    <button className="save-btn" onClick={handleSaveChanges}>Guardar</button>
                                    <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-300 text-sm uppercase">Lista</p>
                                <h1>{playlist.name}</h1>
                                <p>{playlist.description}</p>
                                <p>{playlist.user?.nickname || "Desconocido"} • Guardada {playlist.likes} veces • {playlist.songs.length} canciones</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="playlist-actions">
                    {/* Botón principal grande con solo el ícono */}
                    <div className="rep-cont">
                        <button className="play-btn" onClick={() => handlePlaySongs(playlist.songs)}>
                            <FaPlay/>
                        </button>

                        <button className="shuffle-btn" onClick={toggleShuffle}>
                            <SlPlaylist className={`shuffle-icon ${isShuffling ? "active" : ""}`}/>
                        </button>
                    </div>

                    <div className="actions-right">
                        <button className="shuffle-btn" onClick={toggleLike}>
                            <FaHeart
                                className={`icon heart-icon ${isLiked ? "liked" : ""}`}
                            />
                        </button>
                        <FaEllipsisH className="icon"/>
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
                                        onClick={() => handlePlaySong(song, index, playlist.songs)}
                                    >
                                        <FaPlay />
                                    </button>
                                </div>

                                {/* Columna 2: Portada */}
                                <img src={song.photo_video} alt={song.name} className="song-cover" />

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
