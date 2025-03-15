import React from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
import SearchBar from "../../components/SearchBar/SearchBar";
import "./MainLayout.css";
import Navbar from "../../components/Navbar/Navbar";
import Player from "../../components/Player/Player";
import logo from "/public/vibra.png";

// eslint-disable-next-line react/prop-types
const MainLayout = ({ user }) => {
    const navigate = useNavigate(); // Inicializamos navigate

    return (
        <div className="main-layout">
            {/* Sidebar Izquierda */}
            <div className="sidebar">
                {/* Contenedor del perfil / iniciar sesión */}
                <div className="profile-container">
                    {user ? (
                        // Usuario logueado → Muestra perfil
                        <div>
                            <img src={user.profilePicture} alt="Avatar" className="profile-pic"/>
                            <p>{user.name}</p>
                            <p>{user.email}</p>
                        </div>
                    ) : (
                        // No logueado → Muestra botón de login
                        <button className="login-button" onClick={() => navigate("/login")}>
                            Iniciar Sesión
                        </button>
                    )}
                </div>

                {/* 🟦 Menú horizontal */}
                <Navbar />

                {/* 🎵 Contenedor del reproductor */}
                <div className="player-container">
                    <Player />
                </div>
            </div>

            {/* Contenedor Principal */}
            <div className="main-content">
                <div className="top-bar">
                    <div className="nav-arrows">
                        <button className="arrow left">{"<"}</button>
                        <button className="arrow right">{">"}</button>
                    </div>

                    <SearchBar/>

                    <img src={logo} alt="Logo" className="app-logo"/>
                </div>

                {/* Playlists */}
                <div className="playlist-container">
                    <div className="playlists">
                        <div className="playlist-card">Playlist 1</div>
                        <div className="playlist-card">Playlist 2</div>
                        <div className="playlist-card">Playlist 3</div>
                        <div className="playlist-card">Playlist 4</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
