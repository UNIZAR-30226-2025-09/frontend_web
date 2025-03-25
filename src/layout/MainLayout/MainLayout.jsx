
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
import {apiFetch} from "#utils/apiFetch";


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

    // Verificar si el usuario está guardado en localStorage y si sigue existiendo en la base de datos
    useEffect(() => {
        const checkUserSession = async () => {
            const token = localStorage.getItem("token");
            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (token && storedUser) {
                try {
                    // Verificar si el usuario sigue existiendo en la base de datos
                    const response = await apiFetch(`/user/${storedUser.id}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    // Verificar si la respuesta es válida y tiene datos
                    if (response && response.id) {
                        // Aquí ya tenemos los datos del usuario directamente en 'response'
                        setUser(response); // Cargar los datos del usuario
                    } else {
                        console.error("Error: no se recibieron datos del usuario");
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/");
                    }
                } catch (error) {
                    console.error("Error al verificar usuario:", error);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/"); // Redirigir al login en caso de error
                }
            } else {
                // Si no hay token o usuario, redirigir al login
                navigate("/");
            }
        };

        checkUserSession(); // Verificar al cargar el componente
    }, [navigate]);

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

    const onLogout = () => {
        // Eliminar los datos del usuario y token del localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        // Actualizar el estado de 'user' para reflejar que no hay un usuario logueado
        setUser(null);

        // Redirigir a la página principal (o a cualquier ruta que prefieras)
        navigate("/");
    };

    return (
        <div className="main-layout">
            <aside className="sidebar">
                <div className="profile-container">
                    {user ? (
                        <ProfileCard
                            user={user}
                            onLogout={onLogout}
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
