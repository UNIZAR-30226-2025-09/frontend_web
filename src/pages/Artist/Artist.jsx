import { FaEllipsisH, FaPlay, FaPause, FaRandom, FaCheckCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { PlayerProvider } from "../../components/Player/PlayerContext.jsx";
import { apiFetch } from "#utils/apiFetch";
import { getImageUrl } from "#utils/getImageUrl";
import OptionsPopup from "../../components/PopUpSelection/OptionsPopup.jsx";
import CreatePlaylistModal from "../../components/PlaylistModal/PlaylistModal.jsx";
import "./Artist.css"; // Estilos para el artista

// Convierte segundos a m:ss
function formatDuration(seconds) {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

const ArtistContent = () => {
    const { artistId } = useParams();
    const [artist, setArtist] = useState(null);
    const [isShuffling, setIsShuffling] = useState(false);
    const [songs, setSongs1] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [singles, setSingles] = useState([]);
    const [view, setView] = useState("songs");
    const user_Id = JSON.parse(localStorage.getItem('user')).id;
    const { setCurrentSong, setActiveSection, activeSection, setCurrentIndex, setSongs, setIsPlaying,
        isPlaying, setPlaylistActive, playlistActive, setSongActive, currentSong} = useOutletContext();
    const navigate = useNavigate();

    const [showSharePopup, setShowSharePopup] = useState(false);
    const [shareSearch, setShareSearch] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [friendsList, setFriendsList] = useState([]);

    const [userPlaylists, setUserPlaylists] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);


    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const data = await apiFetch(`/artist/${artistId}`, { method: "GET" });
                setArtist(data.artist);
                setAlbums(Array.isArray(data.albums) ? data.albums : []);
                setSingles(Array.isArray(data.singles) ? data.singles : []);


                // Si no hay canciones, inicializa el estado
                if (data.songs && data.songs.length > 0) {
                    setSongs1(data.songs);  // Set the songs if they exist
                } else {
                    setSongs1([]);  // Si no hay canciones, setea a un array vacío
                }
            } catch (error) {
                console.error("Error al obtener los detalles del artista:", error);
            }
        };

        if (artistId) {
            fetchArtist();
        }
    }, [artistId, user_Id]);

    useEffect(() => {
        if (view && currentSong) {
            // Si estamos en la vista de "álbumes", no cambiamos la lista de canciones
            if (view !== "albums" && isPlaying) {
                setSongs(view === "songs" ? songs : singles);  // Cambiamos la lista entre populares y sencillos
            }
        }
    }, [view, currentSong, isPlaying]);  // Dependencias del efecto

    // Añade este useEffect para cargar las playlists del usuario
    useEffect(() => {
        const fetchUserPlaylists = async () => {
            try {
                const data = await apiFetch(`/playlists/users/${user_Id}/playlists`, {
                    method: "GET",
                });
                setUserPlaylists(data);
            } catch (error) {
                console.error("Error al obtener las playlists del usuario:", error);
            }
        };

        if (user_Id) {
            fetchUserPlaylists();
        }
    }, [user_Id]);

    // Añade esta función para crear una playlist
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

    const updateUserFavoriteStyle = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token no proporcionado");
                return;
            }
    
            await apiFetch("/user/updateStyle", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            console.log("Estilo favorito actualizado correctamente");
        } catch (error) {
            console.error("Error en la actualización del estilo favorito:", error);
        }
    };
    
    const handleSongOptionSelect = async (option, song) => {
        console.log("Opción seleccionada:", option);
        
        if (option.label === "Crear playlist") {
            setSelectedSong(song);
            setShowCreateModal(true);
        } else if (option.label === "Ver detalles") {
            redirectToSong(song.id);
        } else if (option.label === "Agregar a favoritos" || option.label === "Eliminar de favoritos") {
            try {
                const likedPlaylistRes = await apiFetch('/playlists/songliked', {
                    method: 'POST',
                    body: {
                        user_id: user_Id
                    }
                });
                console.log("Playlist de Me Gusta obtenida/creada:", likedPlaylistRes.playlist);
                
                const playlistId = likedPlaylistRes.playlist.id;
                
                const response = await apiFetch(`/song_like/${song.id}/likeUnlike`, {
                    method: 'POST',
                    body: {
                        user_id: user_Id,
                        playlist_id: playlistId
                    }
                });
                
                // Actualizar estilo favorito después de dar like a la canción
                updateUserFavoriteStyle();
                
                console.log("Respuesta del servidor:", response.data);
                if (view === "songs") {
                    // Actualizar el estado de canciones populares
                    setSongs1(prevSongs => 
                        prevSongs.map(s => 
                            s.id === song.id ? { ...s, liked: !s.liked } : s
                        )
                    );
                } else if (view === "singles") {
                    // Actualizar el estado de singles
                    setSingles(prevSingles => 
                        prevSingles.map(s => 
                            s.id === song.id ? { ...s, liked: !s.liked } : s
                        )
                    );
                }
            } catch (error) {
                console.error("Error al agregar/quitar canción de favoritos:", error);
            }
        } else if (userPlaylists.some(pl => pl.name === option.label)) {
            // Es una playlist existente, añadir canción
            try {
                const playlist = userPlaylists.find(pl => pl.name === option.label);
                const response = await apiFetch(`/playlists/${playlist.id}/addSong`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: { songId: song.id }
                });
                console.log("Canción agregada a la playlist existente:", response);
                alert(`Canción añadida a la playlist "${option.label}"`);
            } catch (error) {
                console.error("Error al añadir la canción a la playlist existente:", error);
            }
        }
    };

    // Crear el submenu para agregar a playlists
    const agregarAFavoritosSubmenu = [
        { label: "Crear playlist" },
        ...userPlaylists.map((pl) => ({
            label: pl.name,
            playlistId: pl.id,
        })),
    ];

    const toggleShuffle = () => {
        setIsShuffling(prev => !prev);
    };

    const shuffleArray = (array) => {
        let shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    console.log("Canciones disponibles:", songs);  // Asegúrate de que aquí están las canciones correctas

    const handlePlaySong = (song, index, songsList) => {
        console.log(`Reproduciendo: ${song.name}`);
        console.log("Guardando canción en el estado:", song);
        
        // Asegúrate de que estamos reproduciendo esta canción correctamente
        setCurrentSong(song);
        setCurrentIndex(index);
        setSongs(songsList);
        setIsPlaying(true); // Importante: iniciar la reproducción automáticamente
        
        // Establecer la playlist activa como este artista
        setPlaylistActive(artistId);
    }

    const handlePlaySongs = () => {
        // Usamos la vista actual, pero si estamos en "álbumes", mantenemos la lista actual
        const currentSongs = view === "albums" ? songs : view === "songs" ? songs : singles;

        if (!isPlaying) {
            if (currentSongs.length > 0) {
                if (isShuffling) {
                    const shuffledSongs = shuffleArray(currentSongs);
                    setCurrentSong(shuffledSongs[0]);
                    setCurrentIndex(0);
                    setSongs(shuffledSongs);
                } else {
                    // Si estamos en la vista de álbumes, solo reanudamos la canción activa sin cambiar la lista
                    if (view === "albums") {
                        setIsPlaying(true);
                    } else {
                        setCurrentSong(currentSongs[0]);  // Solo actualizar la canción activa si no estamos en álbumes
                        setCurrentIndex(0);  // El índice de la canción que se está reproduciendo
                        setSongs(currentSongs);  // Mantener la lista actual de canciones
                        setIsPlaying(true);  // Reanudar la reproducción
                    }
                }
            }
        } else {
            setIsPlaying(false);  // Si está reproduciendo, pausamos la canción
        }
    };


    const redirectToSong = (songId) => {
        navigate(`/songs/${songId}`);
    };

    const redirectToAlbum = (albumId) => {
        navigate(`/playlist/${albumId}`);
    };

    // Aquí cambiamos la lógica para mostrar siempre los detalles del artista, incluso si no tiene canciones
    if (!artist) {
        return <p>Cargando artista...</p>;
    }

    const handleArtistOptionSelect = (option) => {
        if (option.label === "Copiar enlace") {
            const url = `${window.location.origin}/artist/${artistId}`;
            navigator.clipboard.writeText(url)
                .then(() => alert("Enlace copiado al portapapeles"))
                .catch(err => console.error('Error al copiar enlace:', err));
        } else if (option.label === "Compartir con amigos") {
            fetchFriendsList();
            setShowSharePopup(true);
        }
    };

    // Función para cargar la lista de amigos
    const fetchFriendsList = async () => {
        try {
            const data = await apiFetch('/social/getFriendsList', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFriendsList(data.friends || []);
        } catch (error) {
            console.error('Error al cargar la lista de amigos:', error);
            setFriendsList([]);
        }
    };

    return (
        <div className="layout">
            <div className="box">
                <div className="play-cont">
                    <div className="image1">
                        <img
                            src={getImageUrl(artist.photo)}
                            width="275"
                            alt="Artist Photo"
                            onError={(e) => (e.target.src = "/default-artist.jpg")}
                        />
                    </div>
                    <div className="artist-info">
                        <p className="verified-badge">
                            <FaCheckCircle className="verified-icon"/>
                            <span className="verified-text">Artista verificado</span>
                        </p>
                        <h1>{artist.name}</h1>
                        <p>{artist.bio}</p>
                    </div>
                </div>

                {/* Si hay canciones, mostramos el reproductor y las listas */}
                {songs.length > 0 && (
                    <div className="playlist-actions">
                        <div className="rep-cont">
                            <button
                                className="play-btn"
                                onClick={() => handlePlaySongs()}
                            >
                                {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>

                            <button className="shuffle-btn" onClick={toggleShuffle}>
                                <FaRandom className={`shuffle-icon ${isShuffling ? "active" : ""}`} />
                            </button>

                            <div className="popup-wrapper">
                            <OptionsPopup
                                trigger={<FaEllipsisH className="artist-main-options-icon" />}
                                options={[{
                                    label: "Compartir",
                                    submenu: [
                                        { label: "Copiar enlace" },
                                        { label: "Compartir con amigos" },
                                    ],
                                }]}
                                position="bottom-right"
                                submenuPosition="right"
                                onOptionSelect={(option) => {
                                    // Si es una opción anidada, pasamos la etiqueta
                                    if (option.item && option.item.label) {
                                        handleArtistOptionSelect(option.item);
                                    } else {
                                        handleArtistOptionSelect(option);
                                    }
                                }}
                            />
                            </div>
                        </div>
                    </div>
                )}

                {/* Botones para cambiar entre canciones, álbumes y sencillos */}
                <div className="view-switcher">
                    <button
                        onClick={() => setView("songs")}
                        className={view === "songs" ? "active" : ""}
                    >
                        Populares
                    </button>
                    <button
                        onClick={() => setView("albums")}
                        className={view === "albums" ? "active" : ""}
                    >
                        Álbumes
                    </button>
                    <button
                        onClick={() => setView("singles")}
                        className={view === "singles" ? "active" : ""}
                    >
                        Sencillos
                    </button>
                </div>

                {/* Mostrar las canciones*/}
                {view === "songs" && songs.length === 0 && (
                    <div className="empty-message">
                        Este artista aún no tiene canciones disponibles para reproducir.
                    </div>
                )}

                {/* Mostrar las canciones si existen */}
                {view === "songs" && songs.length > 0 && (
                    <>
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
                                {songs.map((song, index) => (
                                    <div 
                                        key={song.id || index} 
                                        className={`song-item ${currentSong?.id === song.id ? 'active' : ''} ${currentSong?.id === song.id && isPlaying ? 'playing' : ''}`}
                                    >   
                                        <div className="song-action">
                                            <span className="song-index">{index + 1}</span>
                                            <div className="playing-indicator">
                                                <div className="bar-container">
                                                    <div className="bar"></div>
                                                    <div className="bar"></div>
                                                    <div className="bar"></div>
                                                    <div className="bar"></div>
                                                </div>
                                            </div>
                                            <button
                                                className="artist-play-button"
                                                onClick={() => {
                                                    if (currentSong?.id === song.id) {
                                                        setIsPlaying(!isPlaying);
                                                    } else {
                                                        handlePlaySong(song, index, songs);
                                                    }
                                                }}
                                            >
                                                {currentSong?.id === song.id && isPlaying ? <FaPause /> : <FaPlay />}
                                            </button>
                                        </div>

                                        <img src={getImageUrl(song.photo_video)} alt={song.name} className="song-cover" />

                                        <span className="song-title" onClick={() => redirectToSong(song.id)}>
                                            {song.name}
                                        </span>

                                        <span className="song-artist">{song.album?.name || "Sin álbum"}</span>

                                        <span className="song-date">
                                            {song.date || "Fecha desconocida"}
                                        </span>

                                        <span className="song-duration">{formatDuration(song.duration)}</span>

                                        <div className="artist-song-options-wrapper">
                                            <OptionsPopup
                                                trigger={<FaEllipsisH className="artist-song-options-icon" />}
                                                options={[
                                                    {
                                                        label: "Agregar a playlist",
                                                        submenu: agregarAFavoritosSubmenu,
                                                    },
                                                    {
                                                        label: song.liked ? "Eliminar de favoritos" : "Agregar a favoritos",
                                                    },
                                                    {label: "Ver detalles"},
                                                ]}
                                                position="bottom-right"
                                                submenuPosition="left"
                                                onOptionSelect={(option) => handleSongOptionSelect(option, song)}
                                            />

                                            {/* Y mostrar el modal de creación de playlist cuando sea necesario */}
                                            {showCreateModal && (
                                                <CreatePlaylistModal
                                                    onSubmit={handleCreatePlaylist}
                                                    onClose={() => setShowCreateModal(false)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Mostrar los álbumes */}
                {view === "albums" && albums.length === 0 && (
                    <div className="empty-message">
                        Actualmente, este artista no tiene álbumes publicados.
                    </div>
                )}

                {view === "albums" && albums.length > 0 && (
                    <div className="albums-list">
                        {albums.map((album) => (
                            <div key={album.id} className="album-item" onClick={() => redirectToAlbum(album.id)}>
                                <img src={getImageUrl(album.front_page)} alt={album.name} className="album-cover" />
                                <span className="album-title">{album.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Mostrar los sencillos */}
                {view === "singles" && singles.length === 0 && (
                    <div className="empty-message">
                        Este artista aún no ha lanzado sencillos.
                    </div>
                )}

                {view === "singles" && singles.length > 0 && (
                    <>
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
                                {singles.map((song, index) => (
                                    <div 
                                        key={song.id || index} 
                                        className={`song-item ${currentSong?.id === song.id ? 'active' : ''} ${currentSong?.id === song.id && isPlaying ? 'playing' : ''}`}
                                    >
                                        <div className="song-action">
                                            <span className="song-index">{index + 1}</span>
                                            <div className="playing-indicator">
                                                <div className="bar-container">
                                                    <div className="bar"></div>
                                                    <div className="bar"></div>
                                                    <div className="bar"></div>
                                                    <div className="bar"></div>
                                                </div>
                                            </div>
                                            <button
                                                className="artist-play-button"
                                                onClick={() => {
                                                    if (currentSong?.id === song.id) {
                                                        setIsPlaying(!isPlaying);
                                                    } else {
                                                        handlePlaySong(song, index, songs);
                                                    }
                                                }}
                                            >
                                                {currentSong?.id === song.id && isPlaying ? <FaPause /> : <FaPlay />}
                                            </button>
                                        </div>

                                        <img src={getImageUrl(song.photo_video)} alt={song.name}
                                             className="song-cover"/>

                                        <span className="song-title" onClick={() => redirectToSong(song.id)}>
                                            {song.name}
                                        </span>

                                        <span className="song-artist">Sin Álbum</span>

                                        <span className="song-date">
                                            {song.date || "Fecha desconocida"}
                                        </span>

                                        <span className="song-duration">{formatDuration(song.duration)}</span>

                                        <div className="song-options">
                                            <OptionsPopup
                                                trigger={<FaEllipsisH className="song-options-icon" />}
                                                options={[
                                                    {
                                                        label: "Agregar a playlist",
                                                        submenu: agregarAFavoritosSubmenu,
                                                    },
                                                    {
                                                        label: song.liked ? "Eliminar de favoritos" : "Agregar a favoritos",
                                                    },
                                                    {label: "Ver detalles"},
                                                ]}
                                                position="bottom-right"
                                                submenuPosition="left"
                                                onOptionSelect={(option) => handleSongOptionSelect(option, song)}
                                            />

                                            {/* Y mostrar el modal de creación de playlist cuando sea necesario */}
                                            {showCreateModal && (
                                                <CreatePlaylistModal
                                                    onSubmit={handleCreatePlaylist}
                                                    onClose={() => setShowCreateModal(false)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {showSharePopup && (
                <div className="popup-overlay">
                    <div className="popup-content artist-share-popup">
                        <div className="artist-popup-header">
                            <h3>Compartir artista con amigos</h3>
                        </div>
                        <div className="artist-search-container">
                            <span className="artist-search-icon">
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
                                className="artist-edit-input"
                            />
                            {shareSearch && (
                                <button 
                                    className="artist-clear-search" 
                                    onClick={() => setShareSearch('')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="artist-friends-list">
                            {friendsList.filter(f => f.nickname.toLowerCase().includes(shareSearch.toLowerCase())).length > 0 ? (
                                friendsList
                                    .filter(f => f.nickname.toLowerCase().includes(shareSearch.toLowerCase()))
                                    .map(f => (
                                        <label key={f.friendId} className="artist-friend-item">
                                            <div className="artist-checkbox-wrapper">
                                                <input
                                                    type="checkbox"
                                                    id={`artist-friend-${f.friendId}`}
                                                    checked={selectedFriends.includes(f.friendId)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setSelectedFriends(prev => [...prev, f.friendId]);
                                                        } else {
                                                            setSelectedFriends(prev => prev.filter(id => id !== f.friendId));
                                                        }
                                                    }}
                                                />
                                                <span className="artist-custom-checkbox"></span>
                                            </div>
                                            {f.user_picture ? (
                                                <img src={getImageUrl(f.user_picture)} alt={f.nickname} className="artist-friend-avatar" />
                                            ) : (
                                                <span className="artist-friend-initials">{f.nickname[0]}</span>
                                            )}
                                            <span className="artist-friend-name">{f.nickname}</span>
                                            {selectedFriends.includes(f.friendId) && (
                                                <span className="artist-selected-badge">✓</span>
                                            )}
                                        </label>
                                    ))
                            ) : (
                                <div className="artist-friends-empty">
                                    {shareSearch
                                        ? "No se encontraron amigos con ese nombre"
                                        : "No tienes amigos para compartir este artista"}
                                </div>
                            )}
                        </div>
                        <div className="artist-popup-actions">
                            <button
                                className="artist-share-btn"
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
                                                    message: `Te comparto este artista: ${artist.name}`,
                                                    shared_content: {
                                                        type: 'artist',
                                                        id: artist.id,
                                                        name: artist.name,
                                                        image: artist.photo ? artist.photo : null,
                                                        url: `${window.location.origin}/artist/${artist.id}`
                                                    }
                                                }
                                            });
                                        }
                                        setShowSharePopup(false);
                                        setSelectedFriends([]);
                                        setShareSearch("");
                                        alert("Artista compartido por chat!");
                                    } catch (error) {
                                        console.error("Error al compartir:", error);
                                        alert("Hubo un error al compartir");
                                    }
                                }}
                            >
                                Enviar
                            </button>
                            <button
                                className="artist-cancel-btn"
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

const Artist = () => {
    return (
        <PlayerProvider>
            <ArtistContent />
        </PlayerProvider>
    );
};

export default Artist;