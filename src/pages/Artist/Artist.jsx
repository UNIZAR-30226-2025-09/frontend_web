import { FaEllipsisH, FaPlay, FaPause, FaRandom, FaCheckCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { PlayerProvider } from "../../components/Player/PlayerContext.jsx";
import { apiFetch } from "#utils/apiFetch";
import { getImageUrl } from "#utils/getImageUrl";
import OptionsPopup from "../../components/PopUpSelection/OptionsPopup.jsx";
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

    const handlePlaySong = (song, index, songs) => {
        console.log(`Reproduciendo: ${song.name}`);
        console.log("Guardando canción en el estado:", song);
        setCurrentSong( song );
        setCurrentIndex( index );
        setSongs(songs);
    };

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
                                    trigger={<FaEllipsisH className="icon" />}
                                    options={[{
                                        label: "Compartir",
                                        submenu: [
                                            { label: "Copiar enlace" },
                                            { label: "Compartir con amigos" },
                                        ],
                                    }]}
                                    position="bottom-right"
                                    submenuPosition="right"
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
                                    <div key={song.id || index} className="song-item">
                                        <div className="song-action">
                                            <span className="song-index">{index + 1}</span>
                                            <button
                                                className="play-icon"
                                                onClick={() => handlePlaySong(song, index, songs)}
                                            >
                                                <FaPlay />
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

                                        <div className="song-options">
                                            <OptionsPopup
                                                trigger={<FaEllipsisH className="song-options-icon" />}
                                                options={[
                                                    { label: "Agregar a favoritos" },
                                                    {
                                                        label: "Ver detalles",
                                                        onClick: (e) => {
                                                            e.stopPropagation();
                                                            redirectToSong(song.id);
                                                        }
                                                    }
                                                ]}
                                                position="bottom-right"
                                                submenuPosition="left"
                                            />
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
                                    <div key={song.id || index} className="song-item">
                                        <div className="song-action">
                                            <span className="song-index">{index + 1}</span>
                                            <button
                                                className="play-icon"
                                                onClick={() => handlePlaySong(song, index, singles)} // Asegúrate de pasar "singles"
                                            >
                                                <FaPlay/>
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
                                                trigger={<FaEllipsisH className="song-options-icon"/>}
                                                options={[
                                                    {label: "Agregar a favoritos"},
                                                    {
                                                        label: "Ver detalles",
                                                        onClick: (e) => {
                                                            e.stopPropagation();
                                                            redirectToSong(song.id);
                                                        }
                                                    }
                                                ]}
                                                position="bottom-right"
                                                submenuPosition="left"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
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
