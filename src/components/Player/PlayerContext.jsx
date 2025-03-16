// src/Reproductor/PlayerContext.jsx
import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    // Guardamos la lista de canciones y el índice de la canción actual
    const [songs, setSongs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSong, setCurrentSong] = useState(null);

    return (
        <PlayerContext.Provider
            value={{
                songs,
                setSongs,
                currentIndex,
                setCurrentIndex,
                currentSong,
                setCurrentSong
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
