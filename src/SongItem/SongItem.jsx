import React from "react";
import { FaPlay } from "react-icons/fa";
import "./SongItem.css";

const SongItem = ({ song }) => {
    return (
        <div className="song-item">
            <span className="play-icon"><FaPlay /></span>
            <div className="song-details">
                <p className="song-title">{song.title}</p>
                <p className="song-artist">{song.artist}</p>
            </div>
            <p className="song-duration">{song.duration}</p>
        </div>
    );
};

export default SongItem;
