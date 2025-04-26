import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "#utils/apiFetch";
import { getImageUrl } from "#utils/getImageUrl";
import "./Library.css";
import PlaylistModal from "../../components/PlaylistModal/PlaylistModal";
import { FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";  

const Library = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [likedSongPlaylist, setLikedSongPlaylist] = useState(null); // Playlist "Me Gusta"
    const [likedPlaylists, setLikedPlaylists] = useState([]);
    const [userPlaylists, setUserPlaylists] = useState([]);


    // Estado para mostrar modal de nueva playlist
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [overflowStates, setOverflowStates] = useState({
        likedSongs: false,
        userPlaylists: false,
        likedPlaylists: false
    });

    // Referencias para los contenedores de scroll
    const likedSongsRef = useRef(null);
    const userPlaylistsRef = useRef(null);
    const likedPlaylistsRef = useRef(null);

    const user_Id = JSON.parse(localStorage.getItem('user')).id;

    // Obtener datos del usuario con más detalle
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                if (storedUser) {
                    // Si necesitas más datos del usuario, puedes hacer una petición adicional
                    const userDetails = await apiFetch(`/users/${storedUser.id}`, {
                        method: "GET",
                    });
                    setUser({...storedUser, ...userDetails});
                }
            } catch (error) {
                console.error("Error al obtener detalles del usuario:", error);
                const storedUser = JSON.parse(localStorage.getItem("user"));
                if (storedUser) {
                    setUser(storedUser);
                }
            }
        };
        
        fetchUserDetails();
    }, []);

    // Fetch de las playlists del usuario
    useEffect(() => {
        const fetchUserPlaylists = async () => {
            try {
                const data = await apiFetch(`/playlists/users/${user_Id}/playlists`, {
                    method: "GET",
                });
                // Ordenar por más recientes primero
                const sortedPlaylists = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setUserPlaylists(sortedPlaylists);
            } catch (error) {
                console.error("Error al obtener las playlists del usuario:", error);
            }
        };

        if (user_Id) {
            fetchUserPlaylists();
        }
    }, [user_Id]);

    // NUEVO: Fetch de las playlists colaborativas
    useEffect(() => {
        const fetchCollaborativePlaylists = async () => {
            try {
                const data = await apiFetch(`/collaborators/playlists-for-user/${user_Id}`, {
                    method: "GET",
                });
                setCollaborativePlaylists(data);
            } catch (error) {
                console.error("Error al obtener las playlists colaborativas:", error);
            }
        };

        if (user_Id) {
            fetchCollaborativePlaylists();
        }
    }, [user_Id]);

    // Fetch de las playlists que te han gustado
    useEffect(() => {
        const getLikedPlaylists = async () => {
            try {
                const userId = user ? user.id : null;
                if (userId) {
                    const data = await apiFetch(`/playlists/liked/${userId}`);
                    // Ordenar por más recientes primero
                    const sortedPlaylists = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setLikedPlaylists(sortedPlaylists);
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

    // Comprobar si hay desbordamiento para mostrar botones de carrusel
    useEffect(() => {
        const checkOverflow = () => {
            const checkContainerOverflow = (ref) => {
                if (ref.current) {
                    return ref.current.scrollWidth > ref.current.clientWidth;
                }
                return false;
            };

            setOverflowStates({
                likedSongs: checkContainerOverflow(likedSongsRef),
                userPlaylists: checkContainerOverflow(userPlaylistsRef),
                likedPlaylists: checkContainerOverflow(likedPlaylistsRef)
            });
        };

        // Comprobar inicialmente y después de cualquier cambio en el tamaño de la ventana
        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, [userPlaylists, likedPlaylists, likedSongPlaylist]);

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
            const newPlaylist = await apiFetch("/playlists", {
                method: "POST",
                body: {
                    name: playlistData.title,
                    description: playlistData.description,
                    user_id: user_Id,
                    type: "private",
                    typeP: "playlist",
                },
            });

            // Agregar la nueva playlist al estado local y mantener ordenado por más recientes
            setUserPlaylists([newPlaylist, ...userPlaylists]);
            
            // Cerrar el modal
            closePlaylistModal();

            // Redirigir a la nueva playlist
            navigate(`/playlist/${newPlaylist.id}`);
        } catch (error) {
            console.error("Error al crear la playlist:", error);
        }
    };

    // Funciones para controlar el carrusel
    const scrollContainer = (containerRef, direction) => {
        if (!containerRef.current) return;
        
        const scrollAmount = 500; // Cantidad de scroll en píxeles
        const currentPosition = containerRef.current.scrollLeft;
        
        containerRef.current.scrollTo({
            left: direction === 'next' 
                ? currentPosition + scrollAmount 
                : currentPosition - scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="library-content">
            {/* Título principal con nombre de usuario */}
            <h1 className="library-title">
                Tu Colección Musical, <span className="user-name-highlight">{user?.name || user?.nickname || 'Usuario'}!</span>
            </h1>

            {/* Sección: Canciones que te han gustado */}
            <div className="library-section-header">
                <h2>Canciones que te han gustado</h2>
            </div>
            <div className="scroll-section">
                {overflowStates.likedSongs && (
                    <button 
                        className="carousel-control carousel-prev" 
                        onClick={() => scrollContainer(likedSongsRef, 'prev')}
                    >
                        <FaChevronLeft className="carousel-control-icon" />
                    </button>
                )}
                
                <div className="scroll-container" ref={likedSongsRef}>
                    <div className="library-playlists">
                        {likedSongPlaylist ? (
                            <div className="playlist-wrapper">
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
                
                {overflowStates.likedSongs && (
                    <button 
                        className="carousel-control carousel-next" 
                        onClick={() => scrollContainer(likedSongsRef, 'next')}
                    >
                        <FaChevronRight className="carousel-control-icon" />
                    </button>
                )}
            </div>

            {/* Sección: Tus Playlists */}
            <div className="library-section-header">
                <h2>Tus Playlists</h2>
                {/* Botón para crear nueva playlist */}
                <div className="create-playlist">
                    <button className="create-playlist-button" onClick={openPlaylistModal}>
                        <FaPlus className="create-playlist-icon" />
                        <span>Crear Playlist</span>
                    </button>
                </div>
            </div>
            <div className="scroll-section">
                {overflowStates.userPlaylists && (
                    <button 
                        className="carousel-control carousel-prev" 
                        onClick={() => scrollContainer(userPlaylistsRef, 'prev')}
                    >
                        <FaChevronLeft className="carousel-control-icon" />
                    </button>
                )}
                
                <div className="scroll-container" ref={userPlaylistsRef}>
                    <div className="library-playlists">
                        {userPlaylists.length > 0 ? userPlaylists.map(playlist => (
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
                        )) : <div className="empty-message">No tienes playlists creadas.</div>}
                    </div>
                </div>
                
                {overflowStates.userPlaylists && (
                    <button 
                        className="carousel-control carousel-next" 
                        onClick={() => scrollContainer(userPlaylistsRef, 'next')}
                    >
                        <FaChevronRight className="carousel-control-icon" />
                    </button>
                )}
            </div>

            {/* NUEVA SECCIÓN: Playlists Colaborativas */}
            <div className="library-section-header">
                <h2>Playlists Colaborativas</h2>
                
            </div>
            <div className="scroll-container">
                <div className="library-playlists">
                    {collaborativePlaylists.length > 0 ? collaborativePlaylists.map(playlist => (
                        <div key={playlist.id} className="playlist-wrapper">
                            <div className="library-playlist-card collaborative" onClick={() => handlePlaylistClick(playlist.id)}>
                                <div className="collaborative-badge">Colaborador</div>
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
                    )) : <div className="empty-message">No estás colaborando en ninguna playlist.</div>}
                </div>
            </div>

            {/* Sección: Playlists que te han gustado */}
            <div className="library-section-header">
                <h2>Playlists que te han gustado</h2>
            </div>
            <div className="scroll-section">
                {overflowStates.likedPlaylists && (
                    <button 
                        className="carousel-control carousel-prev" 
                        onClick={() => scrollContainer(likedPlaylistsRef, 'prev')}
                    >
                        <FaChevronLeft className="carousel-control-icon" />
                    </button>
                )}
                
                <div className="scroll-container" ref={likedPlaylistsRef}>
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
                
                {overflowStates.likedPlaylists && (
                    <button 
                        className="carousel-control carousel-next" 
                        onClick={() => scrollContainer(likedPlaylistsRef, 'next')}
                    >
                        <FaChevronRight className="carousel-control-icon" />
                    </button>
                )}
            </div>

            {/* Renderizar el modal de crear playlist si está activo */}
            {showPlaylistModal && (
                <PlaylistModal onSubmit={handleCreatePlaylist} onClose={closePlaylistModal} />
            )}
        </div>
    );
};

export default Library;