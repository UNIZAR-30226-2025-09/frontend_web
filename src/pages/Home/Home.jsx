import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import "./Home.css";
import { apiFetch } from "#utils/apiFetch";
import { getImageUrl } from "#utils/getImageUrl";

const Home = () => {
    const navigate = useNavigate();
    const { playlistsRef, recommendationsRef, albumsRef, artistsRef, setActive, handleMouseDown, handleMouseMove, handleMouseUp, handleAccessWithoutLogin } = useOutletContext(); // Obtener la función del Outlet

    const [vibraPlaylists, setVibraPlaylists] = useState([]);
    const [popularArtists, setPopularArtists] = useState([]);
    const [recommendedPlaylists, setRecommendedPlaylists] = useState([]);

    useEffect(() => {
        const fetchVibraPlaylists = async () => {
            try {
                const data = await apiFetch("/playlists/vibra");
                setVibraPlaylists(data);
            } catch (error) {
                console.error("Error al obtener las playlists de Vibra:", error);
            }
        };

        fetchVibraPlaylists();
    }, []);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const data = await apiFetch("/artist/artists");
                setPopularArtists(data);
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

    return (
        <div className="home-content">
            {/* Sección de playlists creadas por Vibra */}
            <h1 onClick={() => setActive("playlists")}>Descubre lo mejor de Vibra</h1>
            <div
                className="scroll-container"
                ref={playlistsRef}
                onMouseDown={(e) => handleMouseDown(e, playlistsRef)}
                onMouseMove={(e) => handleMouseMove(e, playlistsRef)}
                onMouseUp={() => handleMouseUp(playlistsRef)}
                onMouseLeave={() => handleMouseUp(playlistsRef)}
            >
                <div className="home-playlists">
                    {vibraPlaylists.length > 0 ? (
                        vibraPlaylists.map((playlist) => {
                            const playlistImage = getImageUrl(playlist.front_page, "/default-playlist.jpg");
                            return (
                                <div key={playlist.id} className="playlist-wrapper" onClick={(e) => handleAccessWithoutLogin(e)}>
                                    <div className="home-playlist-card" onClick={(e) => handlePlaylistClick(playlist.id, e)}>
                                        <img
                                            src={playlistImage}
                                            alt={playlist.name}
                                            className="playlist-image"
                                            onError={(e) => e.target.src = "/default-playlist.jpg"} // Si la imagen falla, usa una por defecto
                                        />
                                    </div>
                                    <div onClick={(e) => handlePlaylistClick(playlist.id, e)}>
                                        <p className="playlist-title">{playlist.name} </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>Cargando playlists...</p>
                    )}
                </div>
            </div>

            {/* Sección de recomendaciones */}
            {/* Sección de playlists recomendadas */}
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
                    {recommendedPlaylists.length > 0 ? (
                        recommendedPlaylists.map((playlist) => {
                            const playlistImage = getImageUrl(playlist.front_page, "/default-playlist.jpg");
                            return (
                                <div key={playlist.id} className="playlist-wrapper" onClick={(e) => handleAccessWithoutLogin(e)}>
                                    <div className="home-playlist-card" onClick={(e) => handlePlaylistClick(playlist.id, e)}>
                                        <img
                                            src={playlistImage}
                                            alt={playlist.name}
                                            className="playlist-image"
                                            onError={(e) => e.target.src = "/default-playlist.jpg"} // Si la imagen falla, usa una por defecto
                                        />
                                    </div>
                                    <div onClick={(e) => handlePlaylistClick(playlist.id, e)}>
                                        <p className="playlist-title">{playlist.name} </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>Cargando recomendaciones...</p>
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

            {/* Nueva Sección de Artistas */}
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
                                <div key={artist.id} className="artist-wrapper" onClick={(e) => handleAccessWithoutLogin(e)}>
                                    <div className="home-artist-card" onClick={(e) => handleArtistClick(artist.id, e)}>
                                        <img
                                            src={artistImage}
                                            alt={artist.name}
                                            className="artist-image"
                                            onError={(e) => e.target.src = "/default-artist.jpg"}
                                        />
                                    </div>
                                    <div onClick={(e) => handleArtistClick(artist.id, e)}>
                                        <p className="artist-title">{artist.name}</p>
                                    </div>
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
