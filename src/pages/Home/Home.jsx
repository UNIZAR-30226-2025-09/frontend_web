import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Home.css";
import { apiFetch } from "#utils/apiFetch";
import { getImageUrl } from "#utils/getImageUrl";
const logo = "/vibrablanco.png";
function CustomDot({ onClick, active }) {
    return (
        <button
            className={`custom-dot ${active ? "active" : ""}`}
            onClick={onClick}
            aria-label="Punto de navegación de carrusel"
        />
    );
}

const Home = () => {
    const navigate = useNavigate();
    const { recommendationsRef, albumsRef, artistsRef, setActive, handleMouseDown, handleMouseMove, handleMouseUp, handleAccessWithoutLogin } = useOutletContext(); // Obtener la función del Outlet
    const [ setCurrentSlide] = useState(0);
    const [vibraPlaylists, setVibraPlaylists] = useState([]);
    const [popularArtists, setPopularArtists] = useState([]);
    const [recommendedPlaylists, setRecommendedPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recentlyVisited, setRecentlyVisited] = useState([]);


    // Configuración responsive para el carrusel
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
            slidesToSlide: 1 // Reducido para mejor usabilidad
        },
        tablet: {
            breakpoint: { max: 1024, min: 768 },
            items: 3,
            slidesToSlide: 1
        },
        mobile: {
            breakpoint: { max: 767, min: 464 },
            items: 2,
            slidesToSlide: 1
        }
    };

    useEffect(() => {
        const fetchVibraPlaylists = async () => {
            try {
                const data = await apiFetch("/playlists/vibra");
                console.log("Playlists Vibra:", data); // Debug
                if (data && Array.isArray(data) && data.length > 0) {
                    setVibraPlaylists(data);
                }
            } catch (error) {
                console.error("Error al obtener las playlists de Vibra:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVibraPlaylists();
    }, []);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const data = await apiFetch("/artist/artists");
                if (data && Array.isArray(data)) {
                    setPopularArtists(data);
                }
            } catch (error) {
                console.error("Error al obtener los artistas:", error);
            }
        };

        fetchArtists();
    }, []);

    useEffect(() => {
        const fetchRecommendedPlaylists = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("Token no encontrado");
                    return;
                }

                // Llamamos a la nueva ruta que devuelve las playlists recomendadas
                const data = await apiFetch("/user/recommended-playlists", {
                    method: "GET",  // Hacemos un GET
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                setRecommendedPlaylists(data.recommendedPlaylists);  // Actualizamos las playlists recomendadas
            } catch (error) {
                console.error("Error al obtener las playlists recomendadas:", error);
            }
        };

        fetchRecommendedPlaylists();
    }, []);  // Llamar solo una vez cuando el componente se monta


    // Función para redirigir a la página de detalles de la playlist
    const handlePlaylistClick = (playlistId, e) => {
        if (!localStorage.getItem("token")) {
            e.preventDefault();  // Prevenir la redirección si el usuario no está logueado
            handleAccessWithoutLogin(e); // Mostrar el popup
        } else {
            navigate(`/playlist/${playlistId}`);  // Navegar si el usuario está logueado
        }
    };

    // Función para redirigir a la página de detalles de la playlist
    const handleArtistClick = (artistId, e) => {
        if (!localStorage.getItem("token")) {
            e.preventDefault();  // Prevenir la redirección si el usuario no está logueado
            handleAccessWithoutLogin(e); // Mostrar el popup
        } else {
            navigate(`/artist/${artistId}`);  // Navegar si el usuario está logueado
        }
    };

    useEffect(() => {
        const fetchRecentlyVisited = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem('user')).id;
                const response = await apiFetch(`/playlists/recent/${userId}`, { method: "GET" });

                let data = Array.isArray(response) ? response : response.data;

                if (Array.isArray(data)) {
                    // Eliminar duplicados por ID
                    const uniquePlaylists = data.filter((playlist, index, self) =>
                        index === self.findIndex((p) => p.id === playlist.id)
                    );
                    setRecentlyVisited(uniquePlaylists);
                }
            } catch (error) {
                console.error("Error al obtener playlists recientemente visitadas:", error);
            }
        };

        if (localStorage.getItem('user')) {
            fetchRecentlyVisited();
        }
    }, []);

    console.log("Recently Visited: ", recentlyVisited);

    return (
        <div className="home-content">
            {recentlyVisited.length > 0 && (
                <>
                    <h1 onClick={() => setActive("recentlyVisited")}>Visitado Recientemente</h1>
                    <div className="scroll-container">
                        <div className="home-recommendations recently-visited-grid">
                            {recentlyVisited.map((playlist) => (
                                <div key={playlist.id} className="playlist-wrapper">
                                    <div
                                        className="home-playlist-card"
                                        onClick={(e) => handlePlaylistClick(playlist.id, e)}
                                    >
                                        <img
                                            src={getImageUrl(playlist.front_page, "/default-playlist.jpg")}
                                            alt={playlist.name}
                                            className="playlist-image"
                                            onError={(e) => { e.target.src = "/default-playlist.jpg" }}
                                        />
                                    </div>
                                    <div onClick={(e) => handlePlaylistClick(playlist.id, e)}>
                                        <p className="playlist-title">{playlist.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Sección de playlists creadas por Vibra */}
            <h1 onClick={() => setActive("playlists")}>Descubre lo mejor de Vibra</h1>

            {loading ? (
                <p>Cargando playlists...</p>
            ) : vibraPlaylists.length > 0 ? (
                <div className="carousel-container">
                    <Carousel
                        responsive={responsive}
                        autoPlay={false}
                        swipeable={true}
                        draggable={true}
                        showDots={true}
                        infinite={true}
                        partialVisible={false}
                        customDot={<CustomDot />}
                        beforeChange={(previousSlide, nextSlide) => setCurrentSlide(nextSlide)}
                        containerClass="carousel-container"
                        itemClass="carousel-item"
                        dotListClass="custom-dot-list"
                    >
                        {vibraPlaylists.map((playlist) => {
                            const playlistImage = getImageUrl(playlist.front_page, "/default-playlist.jpg");
                            return (
                                <div key={playlist.id} className="playlist-wrapper">
                                    <div
                                        className="home-playlist-card"
                                        onClick={(e) => handlePlaylistClick(playlist.id, e)}
                                    >
                                        <img
                                            src={playlistImage}
                                            alt={playlist.name}
                                            className="playlist-image"
                                            onError={(e) => {e.target.src = "/default-playlist.jpg"}}
                                        />
                                    </div>
                                    <div onClick={(e) => handlePlaylistClick(playlist.id, e)}>
                                        <p className="playlist-title">{playlist.name}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </Carousel>
                </div>
            ) : (
                <p>No hay playlists disponibles</p>
            )}


            {/* Sección de recomendaciones */}
            <h1 onClick={() => setActive("recommendations")}>Tus recomendaciones</h1>
            <div
                className="scroll-container"
                ref={recommendationsRef}
                onMouseDown={(e) => handleMouseDown(e, recommendationsRef)}
                onMouseMove={(e) => handleMouseMove(e, recommendationsRef)}
                onMouseUp={() => handleMouseUp(recommendationsRef)}
                onMouseLeave={() => handleMouseUp(recommendationsRef)}
            >
                <div className="home-recommendations">
                    {localStorage.getItem("token") ? (
                        recommendedPlaylists.length > 0 ? (
                            recommendedPlaylists.map((playlist) => {
                                const playlistImage = getImageUrl(playlist.front_page, "/default-playlist.jpg");
                                return (
                                    <div key={playlist.id} className="playlist-wrapper" onClick={(e) => handleAccessWithoutLogin(e)}>
                                        <div className="home-playlist-card" onClick={(e) => handlePlaylistClick(playlist.id, e)}>
                                            <img
                                                src={playlistImage}
                                                alt={playlist.name}
                                                className="playlist-image"
                                                onError={(e) => e.target.src = "/default-playlist.jpg"}
                                            />
                                        </div>
                                        <div onClick={(e) => handlePlaylistClick(playlist.id, e)}>
                                            <p className="playlist-title">{playlist.name}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Cargando recomendaciones...</p>
                        )
                    ) : (
                        <div className="login-banner">
                            <div className="login-banner-icon">
                                <img src={logo} alt="Vibra Logo" />
                            </div>
                            <div className="login-banner-text">
                                <h3>¡Personaliza tu experiencia musical!</h3>
                                <p>Inicia sesión para ver recomendaciones</p>
                            </div>
                            <div className="login-banner-buttons">
                                <button className="banner-login-button" onClick={() => navigate("/login")}>Iniciar sesión</button>
                                <button className="register-button" onClick={() => navigate("/register")}>Registrarse</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Nueva sección: Últimos Álbums */}
            <h1 onClick={() => setActive("albums")}>Últimos Álbums</h1>
            <div
                className="scroll-container"
                ref={albumsRef}
                onMouseDown={(e) => handleMouseDown(e, albumsRef)}
                onMouseMove={(e) => handleMouseMove(e, albumsRef)}
                onMouseUp={() => handleMouseUp(albumsRef)}
                onMouseLeave={() => handleMouseUp(albumsRef)}
            >
                <div className="home-albums">
                    <div className="home-album-card" onClick={(e) => handleAccessWithoutLogin(e)}>Álbum 1</div>
                    <div className="home-album-card" onClick={(e) => handleAccessWithoutLogin(e)}>Álbum 2</div>
                    <div className="home-album-card" onClick={(e) => handleAccessWithoutLogin(e)}>Álbum 3</div>
                    <div className="home-album-card" onClick={(e) => handleAccessWithoutLogin(e)}>Álbum 4</div>
                    <div className="home-album-card" onClick={(e) => handleAccessWithoutLogin(e)}>Álbum 5</div>
                    <div className="home-album-card" onClick={(e) => handleAccessWithoutLogin(e)}>Álbum 6</div>
                </div>
            </div>


            {/* Nueva Sección de Artistas - FIXED */}
            <h1 onClick={() => setActive("artists")}>Artistas Populares</h1>
            <div
                className="scroll-container"
                ref={artistsRef}
                onMouseDown={(e) => handleMouseDown(e, artistsRef)}
                onMouseMove={(e) => handleMouseMove(e, artistsRef)}
                onMouseUp={() => handleMouseUp(artistsRef)}
                onMouseLeave={() => handleMouseUp(artistsRef)}
            >
                <div className="home-artists">
                    {popularArtists.length > 0 ? (
                        popularArtists.map((artist) => {
                            const artistImage = getImageUrl(artist.photo, "/default-artist.jpg");

                            return (
                                <div key={artist.id} className="artist-wrapper" onClick={(e) => handleArtistClick(artist.id, e)}>
                                    <div className="home-artist-card">
                                        <img
                                            src={artistImage}
                                            alt={artist.name}
                                            className="artist-image"
                                            onError={(e) => e.target.src = "/default-artist.jpg"}
                                        />
                                    </div>
                                    <p className="artist-title">{artist.name}</p>
                                </div>
                            );
                        })
                    ) : (
                        <p>Cargando artistas...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;