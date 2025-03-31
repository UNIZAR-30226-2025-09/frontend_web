import React from "react";
import { useParams } from "react-router-dom";
import "./Artist.css";

const Artist = () => {
    const { artistId } = useParams();
    const displayName = artistId ? decodeURIComponent(artistId) : "Artista destacado";

    return (
        <div className="artist-container">
            <div className="artist-header">
                <img src="/artist-placeholder.jpg" alt="Artista" className="artist-image" />
                <div className="artist-info">
                    <h1 className="artist-name">{displayName}</h1>
                    <p className="artist-subtext"># oyentes mensuales</p>
                </div>
            </div>

            <div className="artist-songs-section">
                <h2 className="songs-title">Canciones populares</h2>
                <ul className="song-list">
                    {[1, 2, 3, 4, 5].map((song, index) => (
                        <li key={index} className="song-item">
                            <div className="song-index">{index + 1}</div>
                            <div className="song-details">
                                <p className="song-title">Canción {index + 1}</p>
                                <p className="song-duration">3:30</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Artist;
