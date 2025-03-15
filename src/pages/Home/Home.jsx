import React from "react";
import { useOutletContext } from "react-router-dom";
import "./Home.css";

const Home = () => {
    const { playlistsRef, recommendationsRef, albumsRef, artistsRef, setActive, handleMouseDown, handleMouseMove, handleMouseUp } = useOutletContext();

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
                    <div className="home-playlist-card">Playlist 1</div>
                    <div className="home-playlist-card">Playlist 2</div>
                    <div className="home-playlist-card">Playlist 3</div>
                    <div className="home-playlist-card">Playlist 4</div>
                    <div className="home-playlist-card">Playlist 5</div>
                    <div className="home-playlist-card">Playlist 6</div>
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
