import React, { useRef, useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import Navbar from "../../components/Navbar/Navbar";
import Player from "../../components/Player/Player";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Footer from "../../components/Footer/Footer";
const logo = "/vibra.png";
import "./MainLayout.css";
import {PlayerProvider, usePlayer} from "../../components/Player/PlayerContext";


const MainLayout = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const { currentSong, setCurrentSong, currentIndex, setCurrentIndex, songs, setSongs } = usePlayer();


    const setCurrentSongWrapper = (song) => {
        console.log("Recibiendo nueva canción en MainLayout:", song);
        setCurrentSong(song);
    };

    const setCurrentIndexWrapper = (index) => {
        console.log("Recibiendo nuevo indice en MainLayout:", index);
        setCurrentIndex(index);
    };

    const setCurrentSongsWrapper = (songs) => {
        console.log("Recibiendo nuevas songs en MainLayout:", songs);
        setSongs(songs);
    };

    useEffect(() => {
        console.log("Nueva canción en Player:", currentSong);
    }, [currentSong]);

    // obtener usuario de localStorage al cargar el componente
    useEffect(() => {
        const updateUser = () => {
            const storedUser = localStorage.getItem("user");
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };

        updateUser(); // Cargar usuario al inicio

        window.addEventListener("storage", updateUser);

        return () => {
            window.removeEventListener("storage", updateUser);
        };
    }, []);

    //  Referencias para cada sección scrollable
    const playlistsRef = useRef(null);
    const recommendationsRef = useRef(null);
    const albumsRef = useRef(null);
    const artistsRef = useRef(null);

    //  Estado para saber qué sección está activa
    const [activeSection, setActiveSection] = useState("playlists");

    //  Cambia la sección activa cuando el mouse entra
    const setActive = (section) => setActiveSection(section);

    //  Desplazamiento con botones
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

    //  Eventos de arrastre horizontal
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
            <aside className="sidebar">
                <div className="profile-container">
                    {user ? (
                        <ProfileCard
                            user={user}
                            onLogout={() => {
                                localStorage.removeItem("user");
                                localStorage.removeItem("token");
                                window.dispatchEvent(new Event("storage"));
                                navigate("/");
                            }}
                        />
                    ) : (
                        <button
                            className="login-button"
                            onClick={() => navigate("/login")}
                        >
                            Iniciar Sesión
                        </button>
                    )}
                </div>
                <Navbar />
                <div className="player-container">
                        <Player currentSong={currentSong} currentIndex={currentIndex} songs={songs} />
                </div>
            </aside>

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
                    currentSong,
                    currentIndex,
                    songs,
                    playlistsRef,
                    recommendationsRef,
                    albumsRef,
                    artistsRef,
                    activeSection,
                    setActiveSection,
                    setActive,
                    handleMouseDown,
                    handleMouseMove,
                    handleMouseUp,
                    setCurrentSong: setCurrentSongWrapper,
                    setCurrentIndex: setCurrentIndexWrapper,
                    setSongs: setCurrentSongsWrapper,

                }}/>

                <Footer />
            </div>
        </div>
    );
};

// Envolver MainLayout con PlayerProvider
const MainLayoutWithProvider = () => {
    return (
        <PlayerProvider>
            <MainLayout />
        </PlayerProvider>
    );
};

export default MainLayoutWithProvider;
