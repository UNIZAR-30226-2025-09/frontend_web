import React from 'react';
import styled from 'styled-components';
import BannerPlaylist  from "../BannerPlaylist/BannerPlaylist.jsx";
const SidebarWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px;
    //background-color: #f8f8f8;
    background-color:transparent;
    overflow-y: auto; // Permite desplazamiento si hay muchas playlists
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #bed0dd;
`;

const PlaylistList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
`;



const CreatePlaylistButton = styled.button`
    width: 100%;
    padding: 10px;
    margin-top: 15px;
    background-color: #585350;
    color: white;
    font-size: 14px;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s ease-in-out;

    &:hover {
        background-color: #48c6bc;
    }
`;

const SidebarLibrary = () => {
    return (
        <SidebarWrapper>
            <SectionTitle>Tu biblioteca</SectionTitle>
            <PlaylistList>
                <BannerPlaylist>Favoritos</BannerPlaylist>
                <BannerPlaylist>Playlist de Dei V</BannerPlaylist>
            </PlaylistList>
            <CreatePlaylistButton>Crear playlist</CreatePlaylistButton>
        </SidebarWrapper>
    );
};

export default SidebarLibrary;