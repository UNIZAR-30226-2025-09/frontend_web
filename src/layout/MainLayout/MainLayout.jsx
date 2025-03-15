import React, { useRef, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import Navbar from "../../components/Navbar/Navbar";
import Player from "../../components/Player/Player";
import logo from "/public/vibra.png";
import "./MainLayout.css";

const MainLayout = ({ user }) => {
    const navigate = useNavigate();

    // 🔹 Referencias para cada sección scrollable
    const playlistsRef = useRef(null);
    const recommendationsRef = useRef(null);
    const albumsRef = useRef(null);
    const artistsRef = useRef(null);

    // 🔹 Estado para saber qué sección está activa
    const [activeSection, setActiveSection] = useState("playlists");

    // 🔹 Cambia la sección activa cuando el mouse entra
    const setActive = (section) => setActiveSection(section);

    // 🔹 Desplazamiento con botones
    const scrollActiveSection = (direction) => {
        let ref;
        if (activeSection === "playlists") ref = playlistsRef;
        else if (activeSection === "recommendations") ref = recommendationsRef;
        else if (activeSection === "albums") ref = albumsRef;
        else ref = artistsRef;

        if (ref?.current) {
            const scrollAmount = 300;
            ref.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // 🔹 Eventos de arrastre horizontal
    const handleMouseDown = (e, ref) => {
        if (!ref.current) return;
        ref.current.isDragging = true;
        ref.current.startX = e.pageX - ref.current.offsetLeft;
        ref.current.scrollLeft = ref.current.scrollLeft;
        ref.current.style.cursor = "grabbing";
    };

    const handleMouseMove = (e, ref) => {
        if (!ref.current?.isDragging) return;
        e.preventDefault();
        const x = e.pageX - ref.current.offsetLeft;
        const walk = (x - ref.current.startX) * 2;
        ref.current.scrollLeft = ref.current.scrollLeft - walk;
    };

    const handleMouseUp = (ref) => {
        if (!ref.current) return;
        ref.current.isDragging = false;
        ref.current.style.cursor = "grab";
    };

    return (
        <div className="main-layout">
            <div className="sidebar">
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
                <Navbar/>
                <div className="player-container">
                    <Player/>
                </div>
            </div>

            <div className="main-content">
                {/* Ahora la barra superior queda fija dentro de .main-content */}
                <div className="top-bar">
                    <div className="nav-arrows">
                        <button className="arrow left" onClick={() => scrollActiveSection("left")}>{"<"}</button>
                        <button className="arrow right" onClick={() => scrollActiveSection("right")}>{">"}</button>
                    </div>
                    <SearchBar/>
                    <img src={logo} alt="Logo" className="app-logo"/>
                </div>

                <Outlet context={{
                    playlistsRef,
                    recommendationsRef,
                    albumsRef,
                    artistsRef,
                    setActive,
                    handleMouseDown,
                    handleMouseMove,
                    handleMouseUp
                }}/>
            </div>
        </div>
    );
};

export default MainLayout;
