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
        setFirstPlay(0);
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
        if(firstPlay === 0){
            updateLastPlaybackState();
            setSongActive(songId);
            setPlaylistActive(0);
            setFirstPlay(1);
        }

        if(!isPlaying){setIsPlaying(true);}
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

            // Actualizar estilo favorito después de dar like a la canción
            updateUserFavoriteStyle();

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
                        <OptionsPopup
                            trigger={<FaEllipsisH className="song-options-icon"/>}
                            options={[
                                {
                                    label: "Agregar a playlist",
                                    submenu: agregarAFavoritosSubmenu,
                                },
                                {
                                    label: song.liked ?  "Eliminar de favoritos" : "Agregar a favoritos" ,
                                },
                                {label: "Ver detalles"},
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
