import React from "react";
import { FaPlay } from "react-icons/fa";
import "./SongItem.css";

const SongItem = ({ song }) => {
    return (
        <div className="song-item">
            <span className="play-icon"><FaPlay /></span>
            <div className="song-details">
                {/* Usamos 'song.name' en lugar de 'song.title' */}
                <p className="song-title">{song.name}</p>

                {/* No hay 'song.artist' en tu JSON, puedes usar un texto fijo o agregar un campo 'artist' si lo deseas */}
                <p className="song-artist">Artista desconocido</p>
            </div>
            <p className="song-duration">{song.duration}</p>
        </div>
    );
};

export default SongItem;
