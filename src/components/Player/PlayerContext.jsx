// src/Reproductor/PlayerContext.jsx
import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    // Guardamos la lista de canciones y el índice de la canción actual
    const [songs, setSongs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlistActive, setPlaylistActive] = useState(0);
    return (
        <PlayerContext.Provider
            value={{
                isPlaying,
                setIsPlaying,
                songs,
                setSongs,
                currentIndex,
                setCurrentIndex,
                currentSong,
                setCurrentSong,
                playlistActive,
                setPlaylistActive,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

PlayerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const usePlayer = () => useContext(PlayerContext);
