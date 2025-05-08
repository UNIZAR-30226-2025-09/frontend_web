import {FaHeart, FaEllipsisH, FaPlay, FaPause} from "react-icons/fa";
import { useEffect, useState } from "react";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import { apiFetch } from "#utils/apiFetch"; // Suponiendo que esta función existe
import { getImageUrl } from "#utils/getImageUrl"; // Suponiendo que esta función existe
import "./Song.css";
import {PlayerProvider} from "../../components/Player/PlayerContext.jsx";
import axios from "axios";
import OptionsPopup from "../../components/PopUpSelection/OptionsPopup.jsx";
import CreatePlaylistModal from "../../components/PlaylistModal/PlaylistModal.jsx";

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
    const user_Id = JSON.parse(localStorage.getItem('user')).id;
    const [selectedSong, setSelectedSong] = useState(null);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const { currentSong, setCurrentSong, setActiveSection, activeSection, setCurrentIndex, setSongs, isPlaying,
            setIsPlaying, setPlaylistActive, songActive, setSongActive} = useOutletContext();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [firstPlay, setFirstPlay] = useState(0);

    const [showSharePopup, setShowSharePopup] = useState(false);
    const [shareSearch, setShareSearch] = useState("");
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [friendsList, setFriendsList] = useState([]);

    const navigate = useNavigate();

    // Función para actualizar el estilo favorito del usuario
    const updateUserFavoriteStyle = async () => {
        try {
            const token = localStorage.getItem("token");  // Asumimos que el token JWT está en el localStorage

            if (!token) {
                console.error("Token no proporcionado");
                return;
            }

            const response = await apiFetch("/user/updateStyle", {
                method: "POST",  // Utilizamos POST para enviar los datos
                headers: {
                    "Authorization": `Bearer ${token}`,  // Enviamos el token en los encabezados
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Estilo favorito actualizado:", data.style_fav);
            } else {
                console.error("Error al actualizar el estilo favorito:", data.error);
            }
        } catch (error) {
            console.error("Error en la actualización del estilo favorito:", error);
        }
    };

    useEffect(() => {
        console.log("Entrando a Song, activando sección...");

        if (activeSection !== "songs") {
            setActiveSection("songs");
        }
    }, [setActiveSection, activeSection]);

    const agregarAFavoritosSubmenu = [
        { label: "Crear playlist" },
        ...userPlaylists.map((pl) => ({
            label: pl.name,
            playlistId: pl.id,
        })),
    ];

    useEffect(() => {
        const fetchUserPlaylists = async () => {
            try {
                const data = await apiFetch(`/playlists/users/${user_Id}/playlists`, {
                    method: "GET",
                });
                setUserPlaylists(data);
                console.log("playlist del user: ", data);
            } catch (error) {
                console.error("Error al obtener las playlists del usuario:", error);
            }
        };

        if (user_Id) {
            fetchUserPlaylists();
        }
    }, [user_Id]);

    useEffect(() => {
        if (!songId) return;

        const fetchSong = async () => {
            try {
                console.log(`Obteniendo canción con ID: ${songId}`);

                const data = await apiFetch(`/songs/${songId}`, {
                    method: "GET"
                });

                const response = await apiFetch(`/song_like/${songId}/like?userId=${user_Id}`, {
                    method: "GET"
                });
                console.log("useEffect - Respuesta del endpoint checkIfLiked:", response);
                
                setIsLiked(response.isLiked);

                console.log("Canción cargada:", data);
                setSong(data);

            } catch (error) {
                console.error("Error al obtener la canción:", error);
            }

        };
        setFirstPlay(0);
        fetchSong();
    }, [songId, user_Id]);

    const toggleLike = async () => {
        try {
            // Primero obtener o crear la playlist de "Me Gusta"
            const likedPlaylistRes = await apiFetch('/playlists/songliked', {
                method: 'POST',
                body: {
                    user_id: user_Id
                }
            });
            console.log("Playlist de Me Gusta obtenida/creada:", likedPlaylistRes.playlist);
            
            const playlistId = likedPlaylistRes.playlist.id; // Obtener el ID de la playlist

            // Luego agregar la canción a esa playlist

            const response = await apiFetch(`/song_like/${songId}/like`, {
                method: 'POST',
                body: {
                    user_id: user_Id,
                    playlist_id: playlistId // Pasar el ID de la playlist correcta
                }
            });
            
            console.log("Respuesta del servidor:", response);
            setIsLiked(response.liked);

            // Actualizar estilo favorito después de dar like a la canción
            updateUserFavoriteStyle();
        } catch (error) {
            console.error("Error al agregar/eliminar el like", error);
        }
    };

    const handlePlaySong = () => {
        console.log(`Reproduciendo: ${song.name}`);
        setCurrentSong(song);
        setCurrentIndex(0);
        setSongs([song]);
        
        // Establece el songActive con el ID de la canción actual
        setSongActive(song.id); // Importante: usa el mismo tipo de dato
        
        setPlaylistActive(0);
        if(firstPlay === 0){
            updateLastPlaybackState();
            setFirstPlay(1);
        }
    
        setIsPlaying(true); // Siempre establece isPlaying en true cuando se hace clic
    };

    const updateLastPlaybackState = async () => {
        if (!user_Id || !currentSong) return;

        const positionMinutes = 0;
        const positionSeconds = 0;

        try {
            const response = await apiFetch(`/lastPlaybackState/${user_Id}`, {
                method: "POST",
                body: { positionMinutes: positionMinutes,
                        positionSeconds: positionSeconds,
                        songId: songId,
                        playlistId: null, },
                });

            const result = await response.json();
            console.log("Última posición de reproducción actualizada:", result);
        } catch (error) {
            console.error("Error al actualizar la última posición de reproducción:", error);
        }
    };

    const handlePlaySongs = (isPlaying) => {
        console.log("Reproduciendo canciones en modo aleatorio...");

        if(!isPlaying && firstPlay === 0) {
            setCurrentSong(song);
            setCurrentIndex(0);
            setSongs([song]);

            setSongActive(songId);
            setPlaylistActive(0);
            updateLastPlaybackState();
            setFirstPlay(1);
        }

        console.log("Cambiando isplaying en playlist");
        setIsPlaying(!isPlaying);
    };

    const isSingle = song?.type !== "album";
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

    const handleSongOptionSelect = async (option, idx, song) => {
        console.log("Opción seleccionada:", option, idx, song);

        if (option.label === "Crear playlist") {
            setSelectedSong(song);
            setShowCreateModal(true);
        }
        else if (option.label === "Ver detalles")
        {
            navigate(`/songs/${song.id}`);
        }
        else if (userPlaylists.some(pl => pl.id === option.playlistId)) {
            // Si la opción tiene playlistId, es una playlist existente, por lo que se añade la canción a esa playlist.
            try {
                const response = await apiFetch(`/playlists/${option.playlistId}/addSong`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: { songId: song.id }
                });
                console.log("Canción agregada a la playlist existente:", response);
            } catch (error) {
                console.error("Error al añadir la canción a la playlist existente:", error);
            }
        }
        else if (option.label === "Agregar a favoritos" || option.label === "Eliminar de favoritos")
        {
            const likedPlaylistRes = await apiFetch('/playlists/songliked', {
                method: 'POST',
                body: {
                    user_id: user_Id
                }
            });
            console.log("Playlist de Me Gusta obtenida/creada:", likedPlaylistRes.playlist);
            
            const playlistId = likedPlaylistRes.playlist.id; // Obtener el ID de la playlist
            
            // Luego agregar la canción a esa playlist
            const response = await apiFetch(`/song_like/${song.id}/likeUnlike`, {
                method: 'POST',
                body: {
                    user_id: user_Id,
                    playlist_id: playlistId // Pasar el ID de la playlist correcta
                }
            });

            // Actualizar estilo favorito después de dar like a la canción
            updateUserFavoriteStyle();

            console.log("Respuesta del servidor:", response); // Quitar .data
            setIsLiked(response.liked);
        } else if (option.label === "Copiar enlace") {
            const url = `${window.location.origin}/songs/${song.id}`;
            await navigator.clipboard.writeText(url);
            alert("¡Enlace copiado al portapapeles!");
        } else if (option.label === "Compartir con amigos") {
            // Carga la lista de amigos solo si aún no la tienes
            if (friendsList.length === 0) {
                try {
                    const data = await apiFetch('/social/getFriendsList', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setFriendsList(data.friends || []);
                } catch (e) {
                    alert("Error al cargar amigos");
                }
            }
            setShowSharePopup(true);
        }
        else
        {
            // Aquí manejas las demás opciones
            console.log("Opción no manejada:", option);
        }
    };

    const handleCreatePlaylist = async ({ title, description }) => {
        try {
            const newPlaylist = await apiFetch(`/playlists`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: {
                    name: title,
                    description: description,
                    user_id: user_Id,
                    type: "private",
                },
            });
            console.log("Playlist creada:", newPlaylist);

            // Añade la canción a la nueva playlist
            const response = await apiFetch(`/playlists/${newPlaylist.id}/addSong`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: { songId: selectedSong.id },
            });
            console.log("Canción agregada a la nueva playlist:", response);
        } catch (error) {
            console.error("Error al crear la playlist y agregar la canción:", error);
        } finally {
            setShowCreateModal(false);
        }
    };

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
                        onClick={() => {
                            if (songActive === song.id && isPlaying) {
                                setIsPlaying(false);
                            } else {
                                handlePlaySong();
                            }
                        }}
                    >
                        {songActive === song.id && isPlaying ? <FaPause/> : <FaPlay/>}
                    </button>
                        <OptionsPopup
                            trigger={<FaEllipsisH className="song-options-icon"/>}
                            options={[
                                {
                                    label: "Agregar a playlist",
                                    submenu: agregarAFavoritosSubmenu,
                                },
                                {
                                    label: isLiked ?  "Eliminar de favoritos" : "Agregar a favoritos" ,
                                },
                                {
                                    label: "Compartir",
                                    submenu: [
                                        { label: "Copiar enlace" },
                                        { label: "Compartir con amigos" },
                                    ],
                                },
                            ].filter(option => option != null)}
                            position="bottom-right"
                            submenuPosition="right"
                            onOptionSelect={(option, idx) => handleSongOptionSelect(option, idx, song)}
                        />
                        {showCreateModal && (
                            <CreatePlaylistModal
                                onSubmit={handleCreatePlaylist}
                                onClose={() => setShowCreateModal(false)}
                            />
                        )}
                    </div>

                    <div className="actions-right">
                        <button className="like-btn" onClick={toggleLike}>
                            <FaHeart className={`icon heart-icon ${isLiked ? "liked" : ""}`}/>
                        </button>
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
                    <div 
                        key={song.id || 0} 
                        className={`song-item ${songActive == songId ? 'active' : ''} ${songActive == songId && isPlaying ? 'playing' : ''}`}
                    >
                        {/* Columna 1: (# / botón al hover) */}
                        <div className="song-action">
                            <span className="song-index">{1}</span>
                            <div className="playing-indicator">
                                <div className="bar-container">
                                    <div className="bar"></div>
                                    <div className="bar"></div>
                                    <div className="bar"></div>
                                    <div className="bar"></div>
                                </div>
                            </div>
                            <button
                                className="song-item-play-button"
                                onClick={() => {
                                    if (songActive === song.id && isPlaying) {
                                        setIsPlaying(false);
                                    } else {
                                        handlePlaySong();
                                    }
                                }}
                            >
                                {songActive === song.id && isPlaying ? <FaPause /> : <FaPlay />}
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

            {showSharePopup && (
                <div className="popup-overlay">
                    <div className="popup-content song-share-popup">
                        <div className="song-popup-header">
                            <h3>Compartir canción con amigos</h3>
                        </div>
                        <div className="song-search-container">
                            <span className="song-search-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Buscar amigo..."
                                value={shareSearch}
                                onChange={e => setShareSearch(e.target.value)}
                                className="song-edit-input"
                            />
                            {shareSearch && (
                                <button 
                                    className="song-clear-search" 
                                    onClick={() => setShareSearch('')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="song-friends-list">
                            {friendsList.filter(f => f.nickname.toLowerCase().includes(shareSearch.toLowerCase())).length > 0 ? (
                                friendsList
                                    .filter(f => f.nickname.toLowerCase().includes(shareSearch.toLowerCase()))
                                    .map(f => (
                                        <label key={f.friendId} className="song-friend-item">
                                            <div className="song-checkbox-wrapper">
                                                <input
                                                    type="checkbox"
                                                    id={`song-friend-${f.friendId}`}
                                                    checked={selectedFriends.includes(f.friendId)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setSelectedFriends(prev => [...prev, f.friendId]);
                                                        } else {
                                                            setSelectedFriends(prev => prev.filter(id => id !== f.friendId));
                                                        }
                                                    }}
                                                />
                                                <span className="song-custom-checkbox"></span>
                                            </div>
                                            {f.user_picture ? (
                                                <img src={getImageUrl(f.user_picture)} alt={f.nickname} className="song-friend-avatar" />
                                            ) : (
                                                <span className="song-friend-initials">{f.nickname[0]}</span>
                                            )}
                                            <span className="song-friend-name">{f.nickname}</span>
                                            {selectedFriends.includes(f.friendId) && (
                                                <span className="song-selected-badge">✓</span>
                                            )}
                                        </label>
                                    ))
                            ) : (
                                <div className="song-friends-empty">
                                    {shareSearch
                                        ? "No se encontraron amigos con ese nombre"
                                        : "No tienes amigos para compartir esta canción"}
                                </div>
                            )}
                        </div>
                        <div className="song-popup-actions">
                            <button
                                className="song-share-btn"
                                onClick={async () => {
                                    try {
                                        for (const friendId of selectedFriends) {
                                            await apiFetch('/chat/send', {
                                                method: 'POST',
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                                },
                                                body: {
                                                    user2_id: friendId,
                                                    message: `Te comparto esta canción: ${song.name}`,
                                                    shared_content: {
                                                        type: 'song',
                                                        id: song.id,
                                                        name: song.name,
                                                        image: song.photo_video ? song.photo_video : null,
                                                        url: `${window.location.origin}/songs/${song.id}`
                                                    }
                                                }
                                            });
                                        }
                                        setShowSharePopup(false);
                                        setSelectedFriends([]);
                                        setShareSearch("");
                                        alert("Canción compartida por chat!");
                                    } catch (error) {
                                        alert("Hubo un error al compartir");
                                    }
                                }}
                            >
                                Enviar
                            </button>
                            <button
                                className="song-cancel-btn"
                                onClick={() => setShowSharePopup(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
