import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import "./Home.css";
import {apiFetch} from "#utils/apiFetch";
import { getImageUrl } from "#utils/getImageUrl";

const Home = () => {
    const navigate = useNavigate();
    const { playlistsRef, recommendationsRef, albumsRef, artistsRef, setActive, handleMouseDown, handleMouseMove, handleMouseUp } = useOutletContext();

    const [vibraPlaylists, setVibraPlaylists] = useState([]);
    const [popularArtists, setPopularArtists] = useState([]);

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

    // Función para redirigir a la página de detalles de la playlist
    const handlePlaylistClick = (playlistId) => {
        navigate(`/playlist/${playlistId}`);  // Navega a la ruta de la playlist usando su id
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
                                <div key={playlist.id} className="playlist-wrapper">  {/* 🔥 Contenedor general para que imagen y texto no estén juntos */}
                                    <div className="home-playlist-card" onClick={() => handlePlaylistClick(playlist.id)}>
                                        <img
                                            src={playlistImage}
                                            alt={playlist.name}
                                            className="playlist-image"
                                            onError={(e) => e.target.src = "/default-playlist.jpg"} // Si la imagen falla, usa una por defecto
                                        />
                                    </div>
                                    <div onClick={() => handlePlaylistClick(playlist.id)}>
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
                    <div className="home-recommendation-card">Canción 1</div>
                    <div className="home-recommendation-card">Canción 2</div>
                    <div className="home-recommendation-card">Canción 3</div>
                    <div className="home-recommendation-card">Canción 4</div>
                    <div className="home-recommendation-card">Canción 5</div>
                    <div className="home-recommendation-card">Canción 6</div>
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
                    <div className="home-album-card">Álbum 1</div>
                    <div className="home-album-card">Álbum 2</div>
                    <div className="home-album-card">Álbum 3</div>
                    <div className="home-album-card">Álbum 4</div>
                    <div className="home-album-card">Álbum 5</div>
                    <div className="home-album-card">Álbum 6</div>
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
                                <div key={artist.id} className="artist-wrapper">
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
                            );                        })
                    ) : (
                        <p>Cargando artistas...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
