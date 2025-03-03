import React from 'react';
import styled from 'styled-components';

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 300px auto;
    grid-template-rows: 80px auto;
    width: 100vw;
    height: 100vh;
    grid-template-areas:
    "topbar topbar"
    "sidebar main";
    background-color: #182028; /* Negro azulado oscuro */
    gap: 10px; /* Separación entre elementos */
    padding: 10px; /* Padding general */
`;

const Sidebar = styled.div`
    grid-area: sidebar;
    background-color: #273444; /* Azul oscuro */
    padding: 20px;
    height: calc(100vh - 100px); /* Ajustar altura menos la barra de búsqueda y padding */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px; /* Bordes redondeados */
    color: white;
`;

const TopBar = styled.div`
    grid-area: topbar;
    background-color: #273444; /* Azul oscuro */
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
    border-radius: 10px; /* Bordes redondeados */
    color: white;
`;

const MainContent = styled.div`
    grid-area: main;
    padding: 20px;
    background-color: #334155; /* Azul oscuro */
    color: white;
    height: calc(100vh - 100px); /* Ajustar altura menos la barra de búsqueda y padding */
    overflow-y: auto;
    border-radius: 10px; /* Bordes redondeados */
`;

const Grid = ({ children }) => {
    return <GridContainer>{children}</GridContainer>;
};

Grid.Sidebar = Sidebar;
Grid.TopBar = TopBar;
Grid.MainContent = MainContent;

export default Grid;