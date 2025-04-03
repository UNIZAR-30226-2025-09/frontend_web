import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchBar.css';
import {apiFetch} from "#utils/apiFetch";
import {getImageUrl} from "#utils/getImageUrl";
import {useNavigate} from "react-router-dom";

const SearchBar = ({ playerViewModel }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [allSongs, setAllSongs] = useState([]);
    const [allPlaylists, setAllPlaylists] = useState([]);
    const [allArtists, setAllArtists] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [filteredArtists, setFilteredArtists] = useState([]);
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    // Fetch all data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [songsResponse, playlistsResponse, artistsResponse] = await Promise.all([
                    fetchAllSongs(),
                    fetchAllPlaylists(),
                    fetchAllArtists()
                ]);

                setAllSongs(songsResponse);
                setAllPlaylists(playlistsResponse);
                setAllArtists(artistsResponse);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Filter results when search query changes
    useEffect(() => {
        if (searchQuery.trim()) {
            setFilteredSongs(
                allSongs.filter(song =>
                    song.name.toLowerCase().includes(searchQuery.toLowerCase())
                ).slice(0, 3) // Mostrar máximo 3 canciones
            );

            setFilteredPlaylists(
                allPlaylists.filter(playlist =>
                    playlist.title.toLowerCase().includes(searchQuery.toLowerCase())
                ).slice(0, 3) // Mostrar máximo 3 playlists
            );

            setFilteredArtists(
                allArtists.filter(artist =>
                    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
                ).slice(0, 3) // Mostrar máximo 3 artistas
            );
        } else {
            setFilteredSongs([]);
            setFilteredPlaylists([]);
            setFilteredArtists([]);
        }
    }, [searchQuery, allSongs, allPlaylists, allArtists]);

    const clearSearch = () => {
        setSearchQuery('');
        searchInputRef.current?.blur();
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    // Fetch functions using apiFetch
    const fetchAllSongs = async () => {
        try {
            const data = await apiFetch('/songs/');
            return data.map(song => ({
                id: song.id,
                name: song.name,
                duration: song.duration,
                lyrics: song.lyrics || "",
                photo_video: song.photo_video || "",
                url_mp3: song.url_mp3 || ""
            }));
        } catch (error) {
            console.error("Error fetching songs:", error);
            return [];
        }
    };

    const fetchAllPlaylists = async () => {
        try {
            const data = await apiFetch('/playlists/');
            return data.map(playlist => ({
                id: playlist.id,
                title: playlist.name,
                imageUrl: playlist.front_page || "/playlist-placeholder.jpg",
                idAutor: playlist.user_id,

                description: playlist.description || "",
                esPublica: playlist.type,
                esAlbum: playlist.typeP
            }));
        } catch (error) {
            console.error("Error fetching playlists:", error);
            return [];
        }
    };

    const fetchAllArtists = async () => {
        try {
            const data = await apiFetch('/artist/artists/');
            return data.map(artist => ({
                id: artist.id,
                name: artist.name,
                biography: artist.bio || "",
                photo: artist.photo || "/artist-placeholder.jpg"
            }));
        } catch (error) {
            console.error("Error fetching artists:", error);
            return [];
        }
    };

    const playSong = (songId) => {
        console.log("Redirigiendo a la canción...", songId);
        navigate(`/songs/${songId}`);
    };
    const handlePlaylistClick = (playlistId, e) => {
        if (!localStorage.getItem("token")) {
            e.preventDefault();  // Prevenir la redirección si el usuario no está logueado
            handleAccessWithoutLogin(e); // Aquí va el código para manejar la falta de logueo (por ejemplo, mostrar un popup)
        } else {
            navigate(`/playlist/${playlistId}`);  // Navegar si el usuario está logueado
        }
    };
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="search-container">
            <div className="search-bar-container">
                <div className="search-box">
                    <form className="search-form">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder="Buscar..."
                            className="search-input"
                        />
                        {searchQuery && (
                            <FaTimes className="clear-icon" onClick={clearSearch} />
                        )}
                        <button type="submit" className="search-button">
                            <FaSearch />
                        </button>
                    </form>
                </div>
            </div>

            <div className="search-results">
                {filteredSongs.length > 0 && (
                    <div className="result-section">
                        <h2 className="section-title">Canciones</h2>
                        <ul className="result-list">
                            {filteredSongs.map((song) => (
                                <li key={song.id} className="result-item" onClick={() => playSong(song.id)}>
                                    <div className="result-image">
                                        <img src={getImageUrl(song.photo_video)} alt={song.name} className="song-cover" />
                                    </div>
                                    <div className="result-text">
                                        <p className="playlist-title">{song.name}</p>  {/* Usar la clase correcta */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {filteredPlaylists.length > 0 && (
                    <div className="result-section">
                        <h2 className="section-title">Playlists</h2>
                        <ul className="result-list">
                            {filteredPlaylists.slice(0, 3).map((playlist) => ( // Limitar a 3 resultados
                                <li
                                    key={playlist.id}
                                    className="playlist-item"
                                    onClick={() => handlePlaylistClick(playlist.id)}
                                >
                                    <div className="playlist-images">
                                        {/* Asegúrate de que la URL de la imagen esté correctamente formada */}
                                        <img
                                            src={getImageUrl(playlist.imageUrl) || "/playlist-placeholder.jpg"}
                                            alt={playlist.title}
                                            className="playlist-images" // Usar clase consistente para imagen
                                        />
                                    </div>
                                    <div className="playlist-info">
                                        <p className="playlist-title">{playlist.title}</p>  {/* Usar la clase correcta */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {filteredArtists.length > 0 && (
                    <div className="result-section">
                        <h2 className="section-title">Artistas</h2>
                        <ul className="result-list">
                            {filteredArtists.map((artist) => (
                                <li key={artist.id} className="result-item">
                                    <div className="result-image">
                                        <img src={getImageUrl(artist.photo)} alt={artist.name} className="playlist-images" /> {/* Usar la clase de imagen correcta */}
                                    </div>
                                    <div className="result-text">
                                        <p className="playlist-title">{artist.name}</p> {/* Usar la clase correcta para el nombre */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SearchBar;
