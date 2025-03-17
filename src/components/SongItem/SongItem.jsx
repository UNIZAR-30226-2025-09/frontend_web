import "react";
import { FaPlay } from "react-icons/fa";
import "./SongItem.css";

// eslint-disable-next-line react/prop-types
const SongItem = ({ song }) => {
    return (
        <div className="song-item">
            <span className="play-icon"><FaPlay /></span>
            <div className="song-details">
                <p className="song-title">{song.name}</p>

                <p className="song-artist">{song.artists && song.artists.length > 0
                    ? song.artists.map((artist) => artist.name).join(", ")
                    : "Artista desconocido"}</p>
            </div>
            <p className="song-duration">{song.duration}</p>
        </div>
    );
};

export default SongItem;