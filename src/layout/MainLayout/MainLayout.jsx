import React from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./MainLayout.css";
import Navbar from "../../components/Navbar/Navbar";
import Player from "../../components/Player/Player";


const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            {/* 📌 Sidebar Izquierda */}
            <div className="sidebar">
                {/* 🔵 Contenedor del perfil / iniciar sesión */}
                <div className="profile-container">
                    <p>Perfil / Iniciar Sesión</p>
                </div>

                {/* 🟦 Menú horizontal */}
                <Navbar />

                {/* 🎵 Contenedor del reproductor */}
                <div className="player-container">
                    <Player />
                </div>
            </div>

            {/* 📌 Contenedor Principal */}
            <div className="main-content">
                {/* 🔎 Barra de búsqueda */}
                <SearchBar />

                {/* 🎶 Playlists con flechas */}
                <div className="playlist-container">
                    <button className="arrow left">{"<"}</button>
                    <div className="playlists">
                        <div className="playlist-card">Playlist 1</div>
                        <div className="playlist-card">Playlist 2</div>
                        <div className="playlist-card">Playlist 3</div>
                        <div className="playlist-card">Playlist 4</div>
                    </div>
                    <button className="arrow right">{">"}</button>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
