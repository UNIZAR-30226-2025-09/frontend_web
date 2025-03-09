import React from 'react';
import styled from 'styled-components';

const PlaylistBanner = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    background-color: #334155; /* Cambiado a un azul oscuro más claro */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    margin-bottom: 10px;
    transition: background-color 0.3s ease; /* Transición para el hover */

    &:hover {
        background-color: #2c3949; /* Azul ligeramente más claro al hacer hover */
    }
`;

const PlaylistImage = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
`;

const PlaylistInfo = styled.div`
    flex: 1;
`;

const PlaylistTitle = styled.h1`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
    color: white;
    transition: color 0.3s ease; /* Transición para el hover */

    &:hover {
        color: #3498db; /* Azul claro al hacer hover */
    }
`;

const PlaylistDetails = styled.div`
    font-size: 12px;
    color: #b0c4de;
`;

const PlaylistGenre = styled.span`
    margin-right: 5px;
`;

const PlaylistNumSongs = styled.span`
    margin-left: 5px;
`;

const BannerPlaylist = ({ image, children, autor, numCanciones }) => {
    return (
        <PlaylistBanner>
            <PlaylistImage src={image} alt="Playlist Cover" />
            <PlaylistInfo>
                <PlaylistTitle>{children}</PlaylistTitle>
                <PlaylistDetails>
                    <PlaylistGenre>{autor}</PlaylistGenre>
                    <PlaylistNumSongs>{numCanciones} Canciones</PlaylistNumSongs>
                </PlaylistDetails>
            </PlaylistInfo>
        </PlaylistBanner>
    );
};

export default BannerPlaylist;