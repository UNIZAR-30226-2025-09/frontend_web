import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch";
import { getImageUrl } from "../../utils/getImageUrl";
import "./EveryArtist.css";

const EveryArtist = () => {
    const navigate = useNavigate();
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchAllArtists = async () => {
            try {
                setLoading(true);
                const data = await apiFetch("/artist/artists");
                if (data && Array.isArray(data)) {
                    setArtists(data);
                }
            } catch (error) {
                console.error("Error al obtener los artistas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllArtists();
    }, []);

    const handleArtistClick = (artistId) => {
        navigate(`/artist/${artistId}`);
    };

    const filteredArtists = artists.filter(artist => 
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="every-artist-page">
            <div className="artists-header-container">
                <div className="every-artist-header">
                    <h1>Todos los artistas</h1>
                    <div className="search-container">
                        <div className="search-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="rgba(255,255,255,0.7)" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar artistas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="artist-search"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando artistas...</p>
                </div>
            ) : (
                <div className="artists-grid">
                    {filteredArtists.length > 0 ? (
                        filteredArtists.map((artist) => (
                            <div 
                                key={artist.id} 
                                className="artist-item" 
                                onClick={() => handleArtistClick(artist.id)}
                            >
                                <div className="artist-image-container">
                                    <img
                                        src={getImageUrl(artist.photo, "/default-artist.jpg")}
                                        alt={artist.name}
                                        className="artist-image"
                                        onError={(e) => e.target.src = "/default-artist.jpg"}
                                    />
                                    <div className="artist-overlay">
                                        <div className="play-icon">
                                            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="12" fill="rgba(33, 161, 241, 0.9)"/>
                                                <path d="M16 12L10 16.5V7.5L16 12Z" fill="white"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <p className="artist-name">{artist.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">No se encontraron artistas con ese nombre</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default EveryArtist;