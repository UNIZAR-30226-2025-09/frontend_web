import {FaHeart, FaEllipsisH, FaPlay, FaPause, FaRandom, FaSearch, FaTimes} from "react-icons/fa";
import { useEffect, useState } from "react";
import {useOutletContext, useParams, useNavigate} from "react-router-dom";
import { PlayerProvider} from "../../components/Player/PlayerContext.jsx";
import Collaborators from "../../components/Collaborators/Collaborators.jsx";
import "./Playlist.css"; // Layout y estilos generales
import "../../components/SongItem/SongItem.css"; // Estilos de la lista de canciones
import "../../components/Collaborators/Collaborators.css";
import {apiFetch} from "#utils/apiFetch";
import { getImageUrl } from "#utils/getImageUrl";
import CreatePlaylistModal from "../../components/PlaylistModal/PlaylistModal.jsx";
import OptionsPopup from "../../components/PopUpSelection/OptionsPopup.jsx";
import Rating from '../../components/Rating/Rating.jsx';

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
    const [firstPlay, setFirstPlay] = useState(0);
    const [adds, setAdds] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [sortOption, setSortOption] = useState(null);
    const [newImage, setNewImage] = useState(null); // para guardar el archivo subido
    const [newImagePreview, setNewImagePreview] = useState(null); // para mostrar preview
    const user_Id = JSON.parse(localStorage.getItem('user')).id;  // Asegúrate de que la clave sea la correcta
    const { currentSong, setCurrentSong, setActiveSection, activeSection, setCurrentIndex, setSongs, setIsPlaying,
            isPlaying, setPlaylistActive, playlistActive, setSongActive } = useOutletContext();
    const navigate = useNavigate();
    const[showCollabModal, setShowCollabModal] = useState(false);

    const [showSharePopup, setShowSharePopup] = useState(false);
    const [shareSearch, setShareSearch] = useState("");
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [friendsList, setFriendsList] = useState([]);

    const [searchVisible, setSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSongs, setFilteredSongs] = useState([]);

    useEffect(() => {
        if (!playlist) return;

        if (!searchTerm.trim()) {
            setFilteredSongs(playlist.songs);
            return;
        }

        const filtered = playlist.songs.filter(song =>
            song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (song.album?.name && song.album.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        setFilteredSongs(filtered);
    }, [searchTerm, playlist]);

    // Inicializa las canciones filtradas cuando se carga la playlist
    useEffect(() => {
        if (playlist) {
            setFilteredSongs(playlist.songs);
        }
    }, [playlist]);

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
        if (searchVisible) {
            setSearchTerm('');
        }
    };

    const options = [
        playlist?.user_id && playlist.user_id === user_Id ? { label: "Eliminar Playlist" } : null,
        playlist?.user_id && playlist.user_id === user_Id ? { label: `Hacer ${playlist?.type === "public" ? "privada" : "pública"}` } : null,
        playlist?.typeP === "playlist" ? {
            label: "Gestionar Colaboradores",
            action: () => setShowCollabModal(true),
        } : null,
        {
            label: "Compartir",
            submenu: [
                { label: "Copiar enlace" },
                { label: "Compartir con amigos", "data-testid": "share-with-friends" },  // <- aquí
            ],
        },
    ].filter(option => option != null);

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
        const fetchRating = async () => {
            try {
                const data = await apiFetch(`/ratingPlaylist/${playlistId}/rating`);
                setAverageRating(data.averageRating);
            } catch (error) {
                console.error("Error al obtener la valoración:", error);
            }
        };

        fetchRating();
    }, [playlistId]);

    useEffect(() => {
        const fetchUserPlaylists = async () => {
            try {
                const personalPlaylists = await apiFetch(`/playlists/users/${user_Id}/playlists`, {
                    method: "GET",
                });

                const collaborativePlaylists = await apiFetch(`/collaborators/playlists-for-user/${user_Id}`, {
                    method: "GET",
                });

                // Combinar ambas listas (si no quieres duplicados, filtra por ID)
                const combinedPlaylists = [...personalPlaylists, ...collaborativePlaylists];

                setUserPlaylists(combinedPlaylists);

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
        setFirstPlay(0);
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

                setPlaylist(data);

                const likeData = await apiFetch(`/playlists/${playlistId}/like?user_id=${user_Id}`, {
                    method: "GET"
                });

                const adds = await apiFetch(`/songs/adds`, {
                    method: "GET"
                });

                setAdds(adds);
                setIsLiked(likeData.isLiked);

                // REGISTRAR VISITA
                const recordVisit = async () => {
                    try {
                        await apiFetch(`/playlists/${playlistId}/visit`, {
                            method: "POST",
                            body: { userId: user_Id }
                        });
                        console.log("Guardando visita de playlist:", playlistId, "usuario:", user_Id);
                    } catch (error) {
                        console.error("Error registrando la visita:", error);
                    }
                };

                await recordVisit();

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
            updateUserFavoriteStyle();
        } catch (error) {
            console.error("Error al dar/quitar like:", error);
        }
    };

    if (!playlist) {
        return <p>Cargando playlist...</p>;
    }

    const handlePlaySong = (song, index, songs) => {
        let result = [];
        console.log(`Reproduciendo: ${song.name}`);
        console.log("Guardando canción en el estado:", song);

        // Comprueba si currentSong existe antes de acceder a sus propiedades
        if (!currentSong || currentSong.type !== "anuncio") {
            if (isShuffling) {
                setIsShuffling(prev => !prev);
            }

            if (!user.is_premium) {
                console.log("USUARIO es premium metiendo anuncios", user.is_premium);
                result = addsSong(songs);

                setCurrentSong(song);
                setCurrentIndex(0);
                setSongs(result);
            } else {
                setCurrentSong(song);
                setCurrentIndex(0);
                setSongs(songs);
            }
            console.log("Cancion ultima desde handle play SONG: ", song.id);
            updateLastPlaybackState(song.id);
            setPlaylistActive(playlistId);
            setSongActive(0);
            console.log("Cambiando isplaying en playlist a traves de cancion");
            setIsPlaying(true);
        }
    };

    const updateLastPlaybackState = async (id) => {
        if (!user_Id || !currentSong) return;

        try {
            let response;
            if(firstPlay === 0){
                 response = await apiFetch(`/lastPlaybackState/${user_Id}`, {
                    method: "POST",
                    body: { positionMinutes: 0,
                        positionSeconds: 0,
                        songId: id,
                        playlistId: playlistId, },
                });
            }
            else{
                 response = await apiFetch(`/lastPlaybackState/${user_Id}`, {
                    method: "POST",
                    body: {songId: id,
                           playlistId: playlistId, },
                });
            }

            const result = await response.json();
            console.log("Última posición de reproducción actualizada:", result);
        } catch (error) {
            console.error("Error al actualizar la última posición de reproducción:", error);
        }
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
        console.log("Reproduciendo canciones...");
        let result = [];
        
        // Verificar si estamos en la misma playlist que ya está sonando
        const isCurrentPlaylist = playlistActive === playlistId;
        
        // Si estamos en la misma playlist, solo alternamos play/pause sin cambiar la canción
        if (isCurrentPlaylist) {
            console.log("Alternando reproducción en la playlist actual");
            setIsPlaying(!isPlaying);
            return;
        }
        
        // A partir de aquí, estamos cambiando de playlist
        console.log("Iniciando reproducción de nueva playlist");
        
        // Si el modo aleatorio está activado, barajamos las canciones
        if (isShuffling) {
            // Shuffle array of songs
            const shuffledSongs = shuffleArray(songs);
            // Reproducir la primera canción del array mezclado
            console.log("PREMIUM USER: ", user.is_premium);
    
            if (!user.is_premium) {
                console.log("USUARIO no es premium, metiendo anuncios");
                result = addsSong(shuffledSongs);
                console.log("VALOR ID CANCION PLAY SONGS: ", result[0].id);
                setCurrentSong(result[0]);
                setCurrentIndex(0);
                setSongs(result);
                updateLastPlaybackState(result[0].id);
            } else {
                setCurrentSong(shuffledSongs[0]);
                setCurrentIndex(0);
                setSongs(shuffledSongs);
                updateLastPlaybackState(shuffledSongs[0].id);
            }
        } else {
            if (!user.is_premium) {
                console.log("USUARIO no es premium, metiendo anuncios");
                result = addsSong(songs);
                setCurrentSong(result[0]);
                setCurrentIndex(0);
                setSongs(result);
                updateLastPlaybackState(result[0].id);
            } else {
                setCurrentSong(songs[0]);
                setCurrentIndex(0);
                setSongs(songs);
                updateLastPlaybackState(songs[0].id);
            }
        }
        
        // Actualizar la playlist activa y activar la reproducción
        setPlaylistActive(playlistId);
        setSongActive(0);
        setFirstPlay(firstPlay + 1);
        
        // Siempre comenzar reproducción cuando cambiamos de playlist
        setIsPlaying(true);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSaveChanges = async () => {
        try {
            const updatedPlaylist = {
                ...playlist,
                name: newTitle || playlist.name,
                description: newDescription || playlist.description,
            };

            // Si hay imagen nueva, conviértela a base64 y añádela
            if (newImage) {
                const base64Image = await convertFileToBase64(newImage);
                updatedPlaylist.front_page = base64Image;
            }

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
        } else if (option.label === "Hacer privada") {
            try {
                const response = await apiFetch(`/playlists/${playlistId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: { type: "private" },
                });

                console.log("Playlist actualizada a privada:", response);
                window.location.reload();
            } catch (error) {
                console.error("Error al actualizar la playlist:", error);
            }
        } else if (option.label === "Hacer pública") {
            try {
                const response = await apiFetch(`/playlists/${playlistId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: { type: "public" },
                });

                console.log("Playlist actualizada a pública:", response);
                window.location.reload();
            } catch (error) {
                console.error("Error al actualizar la playlist:", error);
            }
        } else if (option.label === "Gestionar Colaboradores") {
            if (playlist?.typeP === "playlist") {
                setShowCollabModal(true); // Abre el modal
                console.log("Abriendo modal para invitar colaboradores");
            } else {
                console.log("No se puede invitar colaboradores a esta playlist porque no es del tipo permitido");
                alert("Solo puedes invitar colaboradores a playlists de tipo 'typeP: playlist'.");
            }


        } else if (option.label === "Copiar enlace") {
            const url = `${window.location.origin}/playlist/${playlistId}`;
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

    const addToQueue = (song) => {
        console.log("Agregando canción a la cola:", song);

        setSongs(prevSongs => {
            // Verifica si ya existe en la cola (opcional)
            const exists = prevSongs.some(s => s.id === song.id && s.type !== 'anuncio');
            if (exists) {
                console.log("La canción ya está en la cola.");
                return prevSongs;
            }

            const updatedQueue = [...prevSongs, song];
            console.log("Nueva cola de reproducción:", updatedQueue);
            return updatedQueue;
        });
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
                    playlist_id: playlistId // Pasar el ID de la playlist correcta
                }
            });

            // Actualizar estilo favorito después de dar like a la canción
            updateUserFavoriteStyle();

            console.log("Respuesta del servidor:", response);
            window.location.reload();
        }
        else if (option.label === "Agregar a la cola")
        {
            addToQueue(song);
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

    const sortedSongs = [...(playlist?.songs || [])];

    if (sortOption === 'title') {
        sortedSongs.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'artist') {
        sortedSongs.sort((a, b) => {
            const artistA = a.album?.name || '';
            const artistB = b.album?.name || '';
            return artistA.localeCompare(artistB);
        });
    } else if (sortOption === 'date') {
        sortedSongs.sort((a, b) => {
            const dateA = new Date(a.song_playlist?.date);
            const dateB = new Date(b.song_playlist?.date);
            return dateA - dateB;
        });
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Mostrar una preview
        const previewUrl = URL.createObjectURL(file);
        setNewImagePreview(previewUrl);
        setNewImage(file);
    };

    // Esta parte reemplaza el return actual con un código más limpio

    return (
        <>
            {showSharePopup && (
                <div className="popup-overlay">
                    <div className="popup-content playlist-share-popup">
                        <div className="playlist-popup-header">
                            <h3>Compartir playlist con amigos</h3>
                        </div>
                        <div className="playlist-search-container">
                            <span className="playlist-search-icon">
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
                                className="playlist-edit-input"
                            />
                            {shareSearch && (
                                <button
                                    className="playlist-clear-search"
                                    onClick={() => setShareSearch('')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="playlist-friends-list">
                            {friendsList.filter(f => f.nickname.toLowerCase().includes(shareSearch.toLowerCase())).length > 0 ? (
                                friendsList
                                    .filter(f => f.nickname.toLowerCase().includes(shareSearch.toLowerCase()))
                                    .map(f => (
                                        <label key={f.friendId} className="playlist-friend-item">
                                            <div className="playlist-checkbox-wrapper">
                                                <input
                                                    type="checkbox"
                                                    id={`playlist-friend-${f.friendId}`}
                                                    checked={selectedFriends.includes(f.friendId)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setSelectedFriends(prev => [...prev, f.friendId]);
                                                        } else {
                                                            setSelectedFriends(prev => prev.filter(id => id !== f.friendId));
                                                        }
                                                    }}
                                                />
                                                <span className="playlist-custom-checkbox"></span>
                                            </div>
                                            {f.user_picture ? (
                                                <img src={getImageUrl(f.user_picture)} alt={f.nickname} className="playlist-friend-avatar" />
                                            ) : (
                                                <span className="playlist-friend-initials">{f.nickname[0]}</span>
                                            )}
                                            <span className="playlist-friend-name">{f.nickname}</span>
                                            {selectedFriends.includes(f.friendId) && (
                                                <span className="playlist-selected-badge">✓</span>
                                            )}
                                        </label>
                                    ))
                            ) : (
                                <div className="playlist-friends-empty">
                                    {shareSearch
                                        ? "No se encontraron amigos con ese nombre"
                                        : "No tienes amigos para compartir esta playlist"}
                                </div>
                            )}
                        </div>
                        <div className="playlist-popup-actions">
                            <button
                                className="playlist-share-btn"
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
                                                    message: `Te comparto esta playlist: ${playlist.name}`,
                                                    shared_content: {
                                                        type: 'playlist',
                                                        id: playlist.id,
                                                        name: playlist.name,
                                                        image: playlist.front_page ? playlist.front_page : null,
                                                        url: `${window.location.origin}/playlist/${playlist.id}`
                                                    }
                                                }
                                            });
                                        }
                                        setShowSharePopup(false);
                                        setSelectedFriends([]);
                                        setShareSearch("");
                                        alert("Playlist compartida por chat!");
                                    } catch (error) {
                                        alert("Hubo un error al compartir");
                                    }
                                }}
                            >
                                Enviar
                            </button>
                            <button
                                className="playlist-cancel-btn"
                                onClick={() => setShowSharePopup(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="layout">
                <div className="box">
                    <div className="play-cont">
                        <div
                            className={`${playlist.typeP !== "Vibra_likedSong" && playlist?.user_id && playlist.user_id === user_Id ? 'image' : 'imagenoedit'}`}
                            onClick={handleEditToggle} 
                            style={{cursor: "pointer"}}>
                            <img
                                src={`${getImageUrl(playlist.front_page)}?t=${Date.now()}`}
                                width="275"
                                alt="Playlist Cover"
                                onError={(e) => (e.target.src = "/default-playlist.jpg")}
                            />
                        </div>
                        <div className="playlist-info">
                            {playlist.typeP !== "Vibra_likedSong" && playlist?.user_id && playlist.user_id === user_Id && isEditing ? (
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

                                        <label htmlFor="playlistImage">Imagen de portada</label>
                                        <input
                                            id="playlistImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="edit-input"
                                        />

                                        {newImagePreview && (
                                            <div className="image-preview-play">
                                                <img
                                                    src={newImagePreview}
                                                    alt="Vista previa"
                                                    style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
                                                />
                                            </div>
                                        )}

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
                                        Total -- {playlist.songs?.length} canciones
                                    </p>

                                    {playlist.typeP !== "Vibra_likedSong" && (
                                        <div className="rating-section">
                                            <p>Valoración promedio: {averageRating} / 5</p>
                                            <Rating
                                                playlistId={playlistId}
                                                userId={user_Id}
                                                initialRating={0}
                                                onRatingUpdate={(newRating) => setAverageRating(newRating)}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="playlist-actions">
                        <div className="rep-cont">
                            <button
                                className="play-btn"
                                onClick={() => {
                                    if (!currentSong || currentSong.type !== "anuncio") {
                                        handlePlaySongs(playlist.songs, isPlaying);
                                    }
                                }}
                            >
                                {playlistActive === playlistId && isPlaying && currentSong?.type !== "anuncio" ? (
                                    <FaPause/>
                                ) : (
                                    <FaPlay aria-label="Play" />
                                )}
                            </button>

                            <button className="shuffle-btn" onClick={toggleShuffle}>
                                <FaRandom className={`shuffle-icon ${isShuffling ? "active" : ""}`}/>
                            </button>
                            {playlist.typeP !== "Vibra_likedSong" && (
                                <div className="popup-wrapper">
                                    <OptionsPopup

                                        trigger={
                                            <button
                                                data-testid="popup-trigger"
                                                aria-label="Opciones"
                                                className="popup-trigger-button"
                                            >
                                                <FaEllipsisH className="playlist-main-options-icon" />
                                            </button>
                                        }
                                        options={options}
                                        position="bottom-right"
                                        submenuPosition="right"
                                        onOptionSelect={handleOptionSelect}
                                    />
                                </div>
                            )}
                        </div>

                        {playlist.typeP !== "Vibra_likedSong" && (
                            <div className="actions-right">
                                <div className={`playlist-song-search-container ${searchVisible ? 'expanded' : ''}`}>
                                    {searchVisible && (
                                        <>
                                            <FaSearch className="search-icon-inside"/>
                                            <input
                                                type="text"
                                                className="playlist-song-search-input"
                                                placeholder="Buscar en esta playlist..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                autoFocus
                                            />
                                            {searchTerm && (
                                                <button
                                                    className="playlist-song-search-clear"
                                                    onClick={() => setSearchTerm('')}
                                                >
                                                    <FaTimes/>
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>



                                <button
                                    className="playlist-song-search-button"
                                    onClick={toggleSearch}
                                    data-testid="search-toggle"
                                    aria-label="Buscar en playlist"
                                >

                                    <FaSearch className="playlist-search-icon-btn"/>

                                </button>

                                <button className="shuffle-btn" onClick={toggleLike}>
                                    <FaHeart
                                        className={`playlist-heart-icon ${isLiked ? "liked" : ""}`}
                                    />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Opciones de ordenación */}
                    <div className="sort-buttons">
                        <button 
                            className={sortOption === 'title' ? 'active' : ''} 
                            onClick={() => setSortOption('title')}>
                            Ordenar por Título
                        </button>
                        <button 
                            className={sortOption === 'artist' ? 'active' : ''} 
                            onClick={() => setSortOption('artist')}>
                            Ordenar por Artista
                        </button>
                        <button 
                            className={sortOption === 'date' ? 'active' : ''} 
                            onClick={() => setSortOption('date')}>
                            Ordenar por Fecha
                        </button>
                    </div>

                    {/* Cabecera de la tabla */}
                    <div className="song-header">
                        <span># / Play</span>
                        <span>Portada</span>
                        <span>Título</span>
                        <span>Álbum</span>
                        <span>Fecha Añadida</span>
                        <span>Duración</span>
                    </div>


                    {/* Lista de canciones */}
                    <div className="song-cont">
                        <div className="song-list">
                            {/* Usamos filteredSongs o sortedSongs dependiendo de si hay un término de búsqueda */}
                            {(searchTerm ? filteredSongs : sortedSongs).length > 0 ? (
                                (searchTerm ? filteredSongs : sortedSongs).map((song, index) => (
                                    <div 
                                        key={song.id || index} 
                                        className={`song-item ${currentSong?.id === song.id ? 'active' : ''} ${currentSong?.id === song.id && isPlaying ? 'playing' : ''}`}
                                    >
                                        {/* resto del contenido de la canción */}
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
                                                className={`song-play-button ${currentSong?.id === song.id && playlistActive === playlistId ? 'active' : ''}`}
                                                onClick={() => {
                                                    if (currentSong?.id === song.id && playlistActive === playlistId) {
                                                        setIsPlaying(!isPlaying);
                                                    } else {
                                                        handlePlaySong(song, index, playlist.songs);
                                                    }
                                                }}
                                            >
                                                {currentSong?.id === song.id && playlistActive === playlistId && isPlaying ? 
                                                    <FaPause /> : <FaPlay />}
                                            </button>
                                        </div>
                                        
                                        <img src={getImageUrl(song.photo_video)} alt={song.name} className="song-cover"/>
                                        
                                        <span className="song-title" onClick={() => redirectToSong(song.id)}>{song.name}</span>
                                        
                                        <span className="song-artist">
                                            {song.album?.name || "Sin álbum"}
                                        </span>
                                        
                                        <span className="song-date">
                                            {song.song_playlist?.date || "Fecha desconocida"}
                                        </span>
                                        
                                        <span className="song-duration">
                                            {formatDuration(song.duration)}
                                        </span>
                                        
                                        <div className="playlist-song-options-wrapper">
                                            <OptionsPopup
                                                trigger={<FaEllipsisH className="playlist-song-options-icon"/>}
                                                options={[
                                                    {
                                                        label: "Agregar a playlist",
                                                        submenu: agregarAFavoritosSubmenu,
                                                    },
                                                    playlist.typeP !== "Vibra_likedSong" && playlist?.user_id && playlist.user_id === user_Id ? {label: "Eliminar canción"} : null,
                                                    {
                                                        label: song.liked ? "Eliminar de favoritos" : "Agregar a favoritos",
                                                    },
                                                    {label: "Ver detalles"},
                                                    {label: "Agregar a la cola"},
                                                ].filter(option => option != null)}
                                                position={index >= filteredSongs.length - 2 ? "top-right" : "bottom-right"}
                                                submenuPosition="left"
                                                onOptionSelect={(option, idx) => handleSongOptionSelect(option, idx, song)}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="playlist-no-results">
                                    No se encontraron canciones que coincidan con la búsqueda
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* Modal de colaboradores */}
                {showCollabModal && (
                    <Collaborators
                        playlistId={playlistId}
                        onClose={() => setShowCollabModal(false)}
                    />
                )}

                {/* Modal para crear playlist */}
                {showCreateModal && (
                    <CreatePlaylistModal
                        onSubmit={handleCreatePlaylist}
                        onClose={() => setShowCreateModal(false)}
                    />
                )}
            </div>
        </>
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