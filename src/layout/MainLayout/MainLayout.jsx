import React from "react";
import { Outlet, useNavigate } from "react-router-dom"; // Importamos Outlet para renderizar páginas dinámicamente
import SearchBar from "../../components/SearchBar/SearchBar";
import "./MainLayout.css";
import Navbar from "../../components/Navbar/Navbar";
import Player from "../../components/Player/Player";
import logo from "/public/vibra.png";

const MainLayout = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="main-layout">
            {/* Sidebar Izquierda */}
            <div className="sidebar">
                {/* Contenedor del perfil / iniciar sesión */}
                <div className="profile-container">
                    {user ? (
                        <div>
                            <img src={user.profilePicture} alt="Avatar" className="profile-pic"/>
                            <p>{user.name}</p>
                            <p>{user.email}</p>
                        </div>
                    ) : (
                        <button className="login-button" onClick={() => navigate("/login")}>
                            Iniciar Sesión
                        </button>
                    )}
                </div>

                {/* Menú horizontal */}
                <Navbar />

                {/* Contenedor del reproductor */}
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

                {/* 🔹 Aquí cambiamos el contenido según la página visitada */}
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
