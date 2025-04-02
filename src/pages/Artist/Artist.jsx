import { FaEllipsisH, FaPlay, FaPause, FaRandom } from "react-icons/fa";
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
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [singles, setSingles] = useState([]);
    const [view, setView] = useState("songs");  // Nuevo estado para manejar la vista activa (songs, albums, singles)
    const user_Id = JSON.parse(localStorage.getItem('user')).id;
    const { setCurrentSong, setCurrentIndex, setSongs: setPlayerSongs, setIsPlaying, isPlaying, setPlaylistActive, setSongActive } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const data = await apiFetch(`/artist/${artistId}`, { method: "GET" });
                setArtist(data.artist);
                setSongs(data.songs);
                setAlbums(data.albums);  // Set the albums for the artist
                setSingles(data.singles);  // Set the singles for the artist
            } catch (error) {
                console.error("Error al obtener los detalles del artista:", error);
            }
        };

        if (artistId) {
            fetchArtist();
        }
    }, [artistId, user_Id]);

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

    const handlePlaySongs = (songs, isPlaying) => {
        if (!isPlaying) {
            if (isShuffling) {
                const shuffledSongs = shuffleArray(songs);
                setCurrentSong(shuffledSongs[0]);
                setCurrentIndex(0);
                setPlayerSongs(shuffledSongs);
            } else {
                setCurrentSong(songs[0]);
                setCurrentIndex(0);
                setPlayerSongs(songs);
            }
            //setPlaylistActive(songs);
            //setSongActive(0);
        }
        setIsPlaying(!isPlaying);
    };

    const redirectToSong = (songId) => {
        navigate(`/songs/${songId}`);
    };

    const redirectToAlbum = (albumId) => {
        navigate(`/playlist/${albumId}`);
    };

    if (!artist || !songs) {
        return <p>Cargando artista...</p>;
    }

    return (
        <div className="layout">
            <div className="box">
                <div className="play-cont">
                    <div className="image">
                        <img
                            src={getImageUrl(artist.photo)}
                            width="275"
                            alt="Artist Photo"
                            onError={(e) => (e.target.src = "/default-artist.jpg")}
                        />
                    </div>
                    <div className="artist-info">
                        <p className="text-gray-300 text-sm uppercase">Artista</p>
                        <h1>{artist.name}</h1>
                        <p>{artist.bio}</p>
                    </div>
                </div>

                <div className="playlist-actions">
                    <div className="rep-cont">
                        <button
                            className="play-btn"
                            onClick={() => handlePlaySongs(songs, isPlaying)}
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

                {/* Mostrar según la vista seleccionada */}
                {view === "songs" && (
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
                                                onClick={() => handlePlaySongs(songs, isPlaying)}
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
                {view === "albums" && (
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
                {view === "singles" && (
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
                                                onClick={() => handlePlaySongs(singles, isPlaying)}
                                            >
                                                <FaPlay />
                                            </button>
                                        </div>

                                        <img src={getImageUrl(song.photo_video)} alt={song.name} className="song-cover" />

                                        <span className="song-title" onClick={() => redirectToSong(song.id)}>
                                            {song.name}
                                        </span>

                                        <span className="song-artist">Sin Álbum</span>

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
