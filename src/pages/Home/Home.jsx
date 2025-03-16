import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "./Home.css";

const Home = () => {
    const { playlistsRef, recommendationsRef, albumsRef, artistsRef, setActive, handleMouseDown, handleMouseMove, handleMouseUp } = useOutletContext();

    const [vibraPlaylists, setVibraPlaylists] = useState([]);

    // Obtener playlists con typeP = "Vibra" desde el backend
    useEffect(() => {
        const fetchVibraPlaylists = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/playlists/vibra");
                const data = await response.json();
                setVibraPlaylists(data);
            } catch (error) {
                console.error("Error al obtener las playlists de Vibra:", error);
            }
        };

        fetchVibraPlaylists();
    }, []);

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
                            const playlistImage = playlist.front_page
                                ? playlist.front_page.startsWith("http")
                                    ? playlist.front_page
                                    : `http://localhost:5001/${playlist.front_page.replace(/^\/?/, "")}`
                                : "/default-playlist.jpg";

                            return (
                                <div key={playlist.id} className="home-playlist-card">
                                    <img
                                        src={playlistImage}
                                        alt={playlist.name}
                                        className="playlist-image"
                                        onError={(e) => e.target.src = "/default-playlist.jpg"} // Si la imagen falla, usa una por defecto
                                    />
                                    <p className="playlist-title">{playlist.name}</p>
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
                    <div className="home-artist-card">Artista 1</div>
                    <div className="home-artist-card">Artista 2</div>
                    <div className="home-artist-card">Artista 3</div>
                    <div className="home-artist-card">Artista 4</div>
                    <div className="home-artist-card">Artista 5</div>
                    <div className="home-artist-card">Artista 6</div>
                </div>
            </div>

        </div>
    );
};

export default Home;
