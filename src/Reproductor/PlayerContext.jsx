// src/Reproductor/PlayerContext.jsx
import React, { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    return (
        <PlayerContext.Provider value={{ currentSong, setCurrentSong }}>
            {children}
        </PlayerContext.Provider>
    );
};

PlayerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const usePlayer = () => useContext(PlayerContext);
