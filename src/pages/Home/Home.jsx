import React from "react";
import "./Home.css"; // Estilos específicos para esta pantalla

const Home = () => {
    return (
        <div className="home-content">
            <p>Explora tu música favorita y disfruta de playlists personalizadas.</p>

            {/* 🔹 Sección de playlists destacadas */}
            <div className="featured-playlists">
                <div className="playlist-card">🎶 Playlist 1</div>
                <div className="playlist-card">🎶 Playlist 2</div>
                <div className="playlist-card">🎶 Playlist 3</div>
                <div className="playlist-card">🎶 Playlist 4</div>
            </div>
        </div>
    );
};

export default Home;
