import React from "react";
import MainLayout from "../../layout/MainLayout/MainLayout";
import PlaylistGrid from "../../components/PlaylistGrid/PlaylistGrid";
import "./Home.css";

const Home = () => {
    return (
        <MainLayout user={null}>  {/* No hay usuario */}
            <div className="welcome-section">
                <h1>Bienvenido a MusicApp 🎵</h1>
                <p>Explora las mejores playlists y disfruta de la música.</p>
            </div>

            <section className="featured-playlists">
                <h2>Playlists Destacadas</h2>
                <PlaylistGrid />
            </section>
        </MainLayout>
    );
};

export default Home;
