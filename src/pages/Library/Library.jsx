import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "#utils/apiFetch";
import { getImageUrl } from "#utils/getImageUrl";
import "./Library.css";
import PlaylistModal from "../../components/PlaylistModal/PlaylistModal";

const Library = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [likedSongPlaylist, setLikedSongPlaylist] = useState(null); // Playlist "Me Gusta"
    const [likedPlaylists, setLikedPlaylists] = useState([]);
    const [userPlaylists, setUserPlaylists] = useState([]);
    // Los estados de ordenación se han declarado pero no se usan; puedes revisarlos
    const [sortUserPlaylists, setSortUserPlaylists] = useState("recent");
    const [sortLikedPlaylists, setSortLikedPlaylists] = useState("recent");

    // Estado para mostrar modal de nueva playlist

    const [showPlaylistModal, setShowPlaylistModal] = useState(false);

    const user_Id = JSON.parse(localStorage.getItem('user')).id;  // Asegúrate de que la clave sea la correcta

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

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

    // Fetch de las playlists que te han gustado
    useEffect(() => {
        const getLikedPlaylists = async () => {
            try {
                const userId = user ? user.id : null;
                if (userId) {
                    const data = await apiFetch(`/playlists/liked/${userId}`);
                    setLikedPlaylists(data);
                }
            } catch (error) {
                console.error("Error al obtener playlists con like:", error);
            }
        };

        if (user) {
            getLikedPlaylists();
        }
    }, [user]);

    // Fetch de la playlist "Me Gusta"
    useEffect(() => {
        const getLikedSongPlaylist = async () => {
            try {
                const userId = user ? user.id : null;
                if (userId) {
                    const data = await apiFetch(`/playlists/liked-song/${userId}`);
                    setLikedSongPlaylist(data);
                }
            } catch (error) {
                console.error("Error al obtener la playlist 'Me Gusta':", error);
            }
        };

        if (user) {
            getLikedSongPlaylist();
        }
    }, [user]);

    const sortPlaylists = (type, setFunction, option) => {
        setFunction(option);
        let sortedPlaylists = type === "user" ? [...userPlaylists] : [...likedPlaylists];

        switch (option) {
            case "alphabetical":
                sortedPlaylists.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "recent":
                sortedPlaylists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "popular":
                sortedPlaylists.sort((a, b) => b.likes - a.likes);
                break;
            default:
                break;
        }

        type === "user" ? setUserPlaylists(sortedPlaylists) : setLikedPlaylists(sortedPlaylists);
    };

    // Función para redirigir a la página de detalles de la playlist
    const handlePlaylistClick = (playlistId) => {
        navigate(`/playlist/${playlistId}`);
    };


    // Funciones para controlar el modal de "Crear Playlist"
    const openPlaylistModal = () => {
        setShowPlaylistModal(true);
    };

    const closePlaylistModal = () => {
        setShowPlaylistModal(false);
    };

    const handleCreatePlaylist = async (playlistData) => {
        try {

            const newPlaylist = await apiFetch("/playlists", {  // Try different endpoint
                method: "POST",
                body: {
                    name: playlistData.title,
                    description: playlistData.description,
                    user_id: user_Id,
                    type: "private",
                },
            });

            // Agregar la nueva playlist al estado local
            setUserPlaylists([newPlaylist, ...userPlaylists]);
            // Cerrar el modal
            closePlaylistModal();

            // Redirigir a la nueva playlist
            navigate(`/playlist/${newPlaylist.id}`);
        } catch (error) {
            console.error("Error al crear la playlist:", error);
        }
    };


    return (
        <div className="library-content">
            {user && <h1 className="library-title">Bienvenido a tu biblioteca, {user.nickname}!</h1>}

            {/* Sección: Canciones que te han gustado */}
            <div className="library-section-header">
                <h2>Canciones que te han gustado</h2>
            </div>
            <div className="scroll-container">
                <div className="library-playlists">
                    {likedSongPlaylist ? (
                        <div key={likedSongPlaylist.id} className="playlist-wrapper">
                            <div className="library-playlist-card"
                                 onClick={() => handlePlaylistClick(likedSongPlaylist.id)}>
                                <img
                                    src={getImageUrl(likedSongPlaylist.front_page) || "/default-playlist.jpg"}
                                    alt={likedSongPlaylist.name}
                                    className="library-playlist-image"
                                />
                            </div>
                            <div onClick={() => handlePlaylistClick(likedSongPlaylist.id)}>
                                <p className="library-playlist-title">{likedSongPlaylist.name}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-message">No tienes una playlist 'Me Gusta'.</div>
                    )}
                </div>
            </div>

            {/* Sección: Tus Playlists */}
            <div className="library-section-header">
                <h2>Tus Playlists</h2>
                <div className="sort-options">
                    <button onClick={() => sortPlaylists("user", setSortUserPlaylists, "recent")}>Recientes</button>
                    <button onClick={() => sortPlaylists("user", setSortUserPlaylists, "alphabetical")}>Alfabético</button>
                    <button onClick={() => sortPlaylists("user", setSortUserPlaylists, "popular")}>Populares</button>
                </div>
                {/* Botón para crear nueva playlist */}
                <div className="create-playlist">
                    <button className="create-playlist-button" onClick={openPlaylistModal}>
                        <svg width="20" height="20" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="create-playlist-icon">
                            <circle cx="32" cy="32" r="32" fill="#333333"/>
                            <path d="M44 20V38C44 40.2091 42.2091 42 40 42C37.7909 42 36 40.2091 36 38C36 35.7909 37.7909 34 40 34C40.6839 34 41.3306 34.1554 41.9 34.4335V24L26 27V41C26 43.2091 24.2091 45 22 45C19.7909 45 18 43.2091 18 41C18 38.7909 19.7909 37 22 37C22.6839 37 23.3306 37.1554 23.9 37.4335V22L44 20Z" fill="#1DB954" stroke="#1DB954" stroke-width="1"/>
                        </svg>
                        <span>Crear Playlist</span>
                    </button>
                </div>
            </div>
            <div className="scroll-container">
                <div className="library-playlists">
                    {userPlaylists.length > 0 ? userPlaylists.map(playlist => (
                        <div key={playlist.id} className="library-playlist-card" onClick={() => handlePlaylistClick(playlist.id)}>
                            <img
                                src={getImageUrl(playlist.front_page) || "/default-playlist.jpg"}
                                alt={playlist.name}
                                className="library-playlist-image"
                            />
                            <p className="library-playlist-title">{playlist.name}</p>
                        </div>
                    )) : <div className="empty-message">No tienes playlists creadas.</div>}
                </div>
            </div>

            {/* Sección: Playlists que te han gustado */}
            <div className="library-section-header">
                <h2>Playlists que te han gustado</h2>
                <div className="sort-options">
                    <button onClick={() => sortPlaylists("liked", setSortLikedPlaylists, "recent")}>Recientes</button>
                    <button onClick={() => sortPlaylists("liked", setSortLikedPlaylists, "alphabetical")}>Alfabético</button>
                    <button onClick={() => sortPlaylists("liked", setSortLikedPlaylists, "popular")}>Populares</button>
                </div>
            </div>
            <div className="scroll-container">
                <div className="library-playlists">
                    {likedPlaylists.length > 0 ? likedPlaylists.map(playlist => (
                        <div key={playlist.id} className="playlist-wrapper">
                            <div className="library-playlist-card" onClick={() => handlePlaylistClick(playlist.id)}>
                                <img
                                    src={getImageUrl(playlist.front_page) || "/default-playlist.jpg"}
                                    alt={playlist.name}
                                    className="library-playlist-image"
                                />
                            </div>
                            <div onClick={() => handlePlaylistClick(playlist.id)}>
                                <p className="library-playlist-title">{playlist.name}</p>
                            </div>
                        </div>
                    )) : <div className="empty-message">No has dado like a ninguna playlist.</div>}
                </div>
            </div>

            {/* Renderizar el modal de crear playlist si está activo */}
            {showPlaylistModal && (
                <PlaylistModal onSubmit={handleCreatePlaylist} onClose={closePlaylistModal} />
            )}
        </div>
    );
};

export default Library;
