import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "./Library.css";

const Library = () => {
    const { setActive, handleMouseDown, handleMouseMove, handleMouseUp } = useOutletContext();
    const [user, setUser] = useState(null);
    const [likedSongs, setLikedSongs] = useState([]);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [likedPlaylists, setLikedPlaylists] = useState([]);
    const [sortUserPlaylists, setSortUserPlaylists] = useState("recent");
    const [sortLikedPlaylists, setSortLikedPlaylists] = useState("recent");

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {
        fetch("http://localhost:5001/api/songs/liked")
            .then(res => res.json())
            .then(setLikedSongs)
            .catch(error => console.error("Error al obtener canciones con like:", error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:5001/api/playlists/user")
            .then(res => res.json())
            .then(setUserPlaylists)
            .catch(error => console.error("Error al obtener playlists del usuario:", error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:5001/api/playlists/liked")
            .then(res => res.json())
            .then(setLikedPlaylists)
            .catch(error => console.error("Error al obtener playlists con like:", error));
    }, []);

    const sortPlaylists = (type, setFunction, option) => {
        setFunction(option);
        let sortedPlaylists = type === "user" ? [...userPlaylists] : [...likedPlaylists];

        switch (option) {
            case "alphabetical":
                sortedPlaylists.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "recent":
                sortedPlaylists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "popular":
                sortedPlaylists.sort((a, b) => b.likes - a.likes);
                break;
            default:
                break;
        }

        type === "user" ? setUserPlaylists(sortedPlaylists) : setLikedPlaylists(sortedPlaylists);
    };

    return (
        <div className="library-content">
            {user && <h1 className="library-title">Bienvenido a tu biblioteca, {user.nickname}!</h1>}

            {/* 🔹 Sección: Canciones que te han gustado */}
            <div className="library-section-header">
                <h2>Canciones que te han  gustado</h2>
            </div>
            <div className="scroll-container">
                <div className="library-playlists">
                    {likedSongs.length > 0 ? likedSongs.map(song => (
                        <div key={song.id} className="library-song-card">
                            <img src={song.cover || "/default-song.jpg"} alt={song.title} className="library-song-image"/>
                            <p className="library-song-title">{song.title}</p>
                        </div>
                    )) : <div className="empty-message">No tienes canciones con "Me gusta".</div>}
                </div>
            </div>

            {/* 🔹 Sección: Tus Playlists */}
            <div className="library-section-header">
                <h2>Tus Playlists</h2>
                <div className="sort-options">
                    <button onClick={() => sortPlaylists("user", setSortUserPlaylists, "recent")}>Recientes</button>
                    <button onClick={() => sortPlaylists("user", setSortUserPlaylists, "alphabetical")}>Alfabético</button>
                    <button onClick={() => sortPlaylists("user", setSortUserPlaylists, "popular")}>Populares</button>
                </div>
            </div>
            <div className="scroll-container">
                <div className="library-playlists">
                    {userPlaylists.length > 0 ? userPlaylists.map(playlist => (
                        <div key={playlist.id} className="library-playlist-card">
                            <img src={playlist.front_page || "/default-playlist.jpg"} alt={playlist.name} className="library-playlist-image"/>
                            <p className="library-playlist-title">{playlist.name}</p>
                        </div>
                    )) : <div className="empty-message">No tienes playlists creadas.</div>}
                </div>
            </div>

            {/* 🔹 Sección: Playlists que te han gustado */}
            <div className="library-section-header">
                <h2>Playlists que te han gustado</h2>
                <div className="sort-options">
                    <button onClick={() => sortPlaylists("liked", setSortLikedPlaylists, "recent")}>Recientes</button>
                    <button onClick={() => sortPlaylists("liked", setSortLikedPlaylists, "alphabetical")}>Alfabético</button>
                    <button onClick={() => sortPlaylists("liked", setSortLikedPlaylists, "popular")}>Populares</button>
                </div>
            </div>
            <div className="scroll-container">
                <div className="library-playlists">
                    {likedPlaylists.length > 0 ? likedPlaylists.map(playlist => (
                        <div key={playlist.id} className="library-playlist-card">
                            <img src={playlist.front_page || "/default-playlist.jpg"} alt={playlist.name} className="library-playlist-image"/>
                            <p className="library-playlist-title">{playlist.name}</p>
                        </div>
                    )) : <div className="empty-message">No has dado like a ninguna playlist.</div>}
                </div>
            </div>
        </div>
    );
};

export default Library;
