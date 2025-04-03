import {FaHeart, FaEllipsisH, FaPlay, FaPause, FaRandom} from "react-icons/fa";
import { useEffect, useState } from "react";
import {useOutletContext, useParams, useNavigate} from "react-router-dom";
import { PlayerProvider} from "../../components/Player/PlayerContext.jsx";
import {SlPlaylist} from "react-icons/sl";
import "./Playlist.css"; // Layout y estilos generales
import "../../components/SongItem/SongItem.css"; // Estilos de la lista de canciones
import {apiFetch} from "#utils/apiFetch";
import { getImageUrl } from "#utils/getImageUrl";
import CreatePlaylistModal from "../../components/PlaylistModal/PlaylistModal.jsx";
import OptionsPopup from "../../components/PopUpSelection/OptionsPopup.jsx";
import axios from "axios";

"#utils/apiFetch.js"

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
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [user, setUser] = useState(null);
    const [adds, setAdds] = useState([]);
    const user_Id = JSON.parse(localStorage.getItem('user')).id;  // Asegúrate de que la clave sea la correcta
    const { setCurrentSong, setActiveSection, activeSection, setCurrentIndex, setSongs, setIsPlaying,
            isPlaying, setPlaylistActive, playlistActive, setSongActive } = useOutletContext();
    const navigate = useNavigate();

    const options = [
        playlist?.user_id && playlist.user_id === user_Id ? { label: "Eliminar Playlist" } : null,
        playlist?.user_id && playlist.user_id === user_Id ? { label: `Hacer ${playlist?.type === "public" ? "privada" : "pública"}` } : null,
        { label: "Invitar Colaboradores" },
        {
            label: "Compartir",
            submenu: [
                { label: "Copiar enlace" },
                { label: "Compartir con amigos" },
            ],
        },
    ].filter(option => option != null);

    const agregarAFavoritosSubmenu = [
        { label: "Crear playlist" },
        ...userPlaylists.map((pl) => ({
            label: pl.name,
            playlistId: pl.id,
        })),
    ];


    const redirectToSong = (songId) => {
        console.log("Redirigiendo a la canción...", songId);
        navigate(`/songs/${songId}`);
    };

    useEffect(() => {
        const fetchUserPlaylists = async () => {
            try {
                const data = await apiFetch(`/playlists/users/${user_Id}/playlists`, {
                    method: "GET",
                });
                setUserPlaylists(data);

                const userData = await apiFetch(`/user/${user_Id}`, {
                   method: "GET",
                });

                setUser(userData);
            } catch (error) {
                console.error("Error al obtener las playlists del usuario:", error);
            }
        };

        if (user_Id) {
            fetchUserPlaylists();
        }
    }, [user_Id]);

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

                const data = await apiFetch(`/playlists/${playlistId}?userId=${user_Id}`, {
                    method: "GET"
                });


                console.log("Playlist cargada:", data);
                console.log("Imagen de portada:", data.front_page); // Aquí verás la URL de la portada
                setPlaylist(data);
                console.log("Canciones de la playlist", data.songs);
                console.log("LIKES: ", data.likes);
                const likeData = await apiFetch(`/playlists/${playlistId}/like?user_id=${user_Id}`, {
                    method: "GET"
                });

                const adds = await apiFetch(`/songs/adds`, {
                    method: "GET"
                });

                console.log("Anuncios ", adds);

                setAdds(adds);

                setIsLiked(likeData.isLiked);
            } catch (error) {
                console.error("Error al obtener la playlist:", error);
            }
        };

        fetchPlaylist();
    }, [playlistId, user_Id]);

    const toggleLike = async () => {
        try {
            console.log(" Enviando petición de like/unlike:");
            console.log(" user_id:", user_Id);
            console.log(" playlist_id:", playlistId);

            const responseData = await apiFetch(`/playlists/${playlistId}/like`, {
                method: "POST",
                body: { user_id: user_Id }
            });

            console.log(" Respuesta del servidor:", responseData);

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

        console.log("Cambiando isplaying en playlist a traves de cancion");
        setIsPlaying(true);
    };

    function addsSong(songs) {
        let result = [];
        let songIndex = 0;
        let adIndex = 0;
        const songsLength = songs.length;
        const adsLength = adds.length;

        while (songIndex < songsLength) {
            // Añadir hasta 5 canciones al resultado
            for (let i = 0; i < 5 && songIndex < songsLength; i++) {
                result.push(songs[songIndex]);
                songIndex++;
            }

            // Añadir un anuncio (si hay anuncios disponibles)
            if (adIndex < adsLength) {
                result.push(adds[adIndex]); // Añadir anuncio con una propiedad 'isAd'
                if(adsLength > 1){
                    adIndex++;
                }
            }
            else{
                result.push(adds[adIndex]);
            }
        }

        console.log("RESULTADOS CANCIONES juntadas",result);
        return result;
    }

    const handlePlaySongs = (songs, isPlaying) => {
        console.log("Reproduciendo canciones en modo aleatorio...");
        let result = ([]);

            if(isShuffling){
                // Shuffle array of songs
                const shuffledSongs = shuffleArray(songs);
                // Reproducir la primera canción del array mezclado
                console.log("PREMIUM USER: ",user.is_premium);

                if(!user.is_premium){
                    console.log("USUARIO es premium metiendo anuncios", user.is_premium);
                    result = addsSong(shuffledSongs);

                    setCurrentSong(result[0]);
                    setCurrentIndex(0);
                    setSongs(result);
                }
                else{
                    setCurrentSong(shuffledSongs[0]);
                    setCurrentIndex(0);
                    setSongs(shuffledSongs);
                }
            }
            else{
                console.log("PREMIUM USER: is nt shuffling",user.is_premium);
                if(!user.is_premium){
                    result = addsSong(songs);

                    setCurrentSong(result[0]);
                    setCurrentIndex(0);
                    setSongs(result);
                }
                else{
                    setCurrentSong(songs[0]);
                    setCurrentIndex(0);
                    setSongs(songs);
                }
            }

            setPlaylistActive(playlistId);
            setSongActive(0);

        console.log("Cambiando isplaying en playlist");
        setIsPlaying(!isPlaying);
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

            const data = await apiFetch(`/playlists/${playlistId}`, {
                method: "PUT",
                body: updatedPlaylist
            });

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

    const handleOptionSelect = async (option, index) => {
        console.log("Opción seleccionada:", option, index);

        if (option.label === "Eliminar Playlist") {
            if (window.confirm("¿Estás seguro de eliminar la playlist?")) {
                try {
                    const response = await apiFetch(`/playlists/${playlistId}`, {
                        method: "DELETE",
                    });
                    console.log("Playlist eliminada:", response);
                    navigate("/");
                } catch (error) {
                    console.error("Error al eliminar la playlist:", error);
                }
            }
        } else if (option.label === "Hacer privada")
        {
            try {
                const response = await apiFetch(`/playlists/${playlistId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: { type: "private" }
                });

                console.log("Playlist actualizada a privada:", response);
                window.location.reload();
            } catch (error) {
                console.error("Error al eliminar la playlist:", error);
            }
        }
        else if (option.label === "Hacer pública")
        {
            try {
                const response = await apiFetch(`/playlists/${playlistId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: { type: "public" }
                });

                console.log("Playlist actualizada a privada:", response);
                window.location.reload();
            } catch (error) {
                console.error("Error al eliminar la playlist:", error);
            }
        }
        else
        {
            // Aquí manejas las demás opciones
            console.log("Opción no manejada:", option);
        }
    };


    const handleSongOptionSelect = async (option, idx, song) => {
        console.log("Opción seleccionada:", option, idx, song);

        if (option.label === "Crear playlist") {
            setSelectedSong(song);
            setShowCreateModal(true);
        } else if (option.label === "Eliminar canción") {
            try {
                const response = await apiFetch(`/playlists/${playlistId}/deleteSong`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: { songId: song.id }
                })
                console.log("Canción eliminada de la playlist:", response);
                window.location.reload();
            } catch (error) {
                console.error("Error al eliminar la canción de la playlist:", error);
            }
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
            const likedPlaylistRes = await axios.post('http://localhost:5001/api/playlists/songliked', {
                user_id: user_Id
            });
            console.log("Playlist de Me Gusta obtenida/creada:", likedPlaylistRes.data.playlist);

            const playlistId = likedPlaylistRes.data.playlist.id; // Obtener el ID de la playlist

            // Luego agregar la canción a esa playlist

            const response = await axios.post(`http://localhost:5001/api/song_like/${song.id}/likeUnlike`, {
                user_id: user_Id,
                playlist_id: playlistId // Pasar el ID de la playlist correcta
            });

            console.log("Respuesta del servidor:", response.data);
            window.location.reload();
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
        <div className="layout">
            {/* Columna derecha: contenido de la playlist */}
            <div className="box">
                <div className="play-cont">
                    <div className={`${playlist?.user_id && playlist.user_id === user_Id ? 'image' : 'imagenoedit'}`} onClick={handleEditToggle} style={{cursor: "pointer"}}>
                        <img
                            src={getImageUrl(playlist.front_page)}  // Usa getImageUrl aquí para generar la URL completa
                            width="275"
                            alt="Playlist Cover"
                            onError={(e) => (e.target.src = "/default-playlist.jpg")} // Si la imagen falla, muestra la imagen por defecto
                        />
                    </div>
                    <div className="playlist-info">
                        {playlist?.user_id && playlist.user_id === user_Id && isEditing ? (
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
                                <p>
                                    {playlist.owner?.nickname || "Desconocido"} •
                                    Guardada {playlist.likes || 0} veces •
                                    Total --  {playlist.songs?.length} canciones
                                </p>
                            </>
                        )}
                    </div>
                </div>

                <div className="playlist-actions">
                    {/* Botón principal grande con solo el ícono */}
                    <div className="rep-cont">
                        <button
                            className="play-btn"
                            onClick={() => handlePlaySongs(playlist.songs, isPlaying)}
                        >
                            {playlistActive === playlistId && isPlaying ? <FaPause/> : <FaPlay/>}
                        </button>

                        <button className="shuffle-btn" onClick={toggleShuffle}>
                            <FaRandom className={`shuffle-icon ${isShuffling ? "active" : ""}`}/>
                        </button>
                        <div className="popup-wrapper ">
                            <OptionsPopup
                                trigger={<FaEllipsisH className="icon"/>}
                                options={options}
                                position="bottom-right"
                                submenuPosition="right"
                                onOptionSelect={handleOptionSelect}
                            />
                        </div>
                    </div>

                    <div className="actions-right">
                        <button className="shuffle-btn" onClick={toggleLike}>
                            <FaHeart
                                className={`icon heart-icon ${isLiked ? "liked" : ""}`}
                            />
                        </button>
                    </div>
                </div>
                <div className="song-header">
                    <span># / Play</span>
                    <span>Portada</span>
                    <span>Título</span>
                    <span>Álbum</span>
                    <span>Fecha Añadida</span>
                    <span>Duración</span>
                </div>
                <div className="song-cont">
                    {/* Cabecera: 6 columnas (#/Play, Portada, Título, Álbum, Fecha, Duración) */}

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
                                        <FaPlay/>
                                    </button>
                                </div>

                                {/* Columna 2: Portada */}
                                <img src={getImageUrl(song.photo_video)} alt={song.name} className="song-cover"/>

                                {/* Columna 3: Título */}
                                <span className="song-title" onClick={() => redirectToSong(song.id)}>{song.name}</span>

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

                                {/* Contenedor de opciones (tres puntos) que aparece al hacer hover */}
                                <div className="song-options">
                                    <OptionsPopup
                                        trigger={<FaEllipsisH className="song-options-icon"/>}
                                        options={[
                                            {
                                                label: "Agregar a playlist",
                                                submenu: agregarAFavoritosSubmenu,
                                            },
                                            playlist?.user_id && playlist.user_id === user_Id ? {label: "Eliminar canción"} : null,
                                            {
                                                label: song.liked ?  "Eliminar de favoritos" : "Agregar a favoritos" ,
                                            },
                                            {label: "Ver detalles"},
                                        ].filter(option => option != null)}
                                        position="bottom-right"
                                        submenuPosition="left"
                                        onOptionSelect={(option, idx) => handleSongOptionSelect(option, idx, song)}
                                    />
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
            </div>
        </div>
    );
};

const Playlist = () => {
    return (
        <PlayerProvider>
            <PlaylistContent/>
        </PlayerProvider>
    );
};

export default Playlist;