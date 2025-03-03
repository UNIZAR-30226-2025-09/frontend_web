import React from 'react';
import styled from 'styled-components';

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 300px auto; // Sidebar fijo, contenido ocupa el resto
    grid-template-rows: 80px auto; // TopBar fijo, contenido ocupa el resto
    width: 100vw; // Ocupa todo el ancho de la pantalla
    height: 100vh; // Ocupa todo el alto de la pantalla
    grid-template-areas:
    "topbar topbar"
    "sidebar main";
    background-color: #222; // Color de fondo general
`;

const Sidebar = styled.div`
    grid-area: sidebar;
    background-color: #f0f0f0;
    padding: 20px;
    height: calc(100vh - 80px); // Ajustar altura menos la barra de búsqueda
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const TopBar = styled.div`
    grid-area: topbar;
    background-color: #e0e0e0;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
`;

const MainContent = styled.div`
    grid-area: main;
    padding: 20px;
    background-color: #333;
    color: white;
    height: calc(100vh - 80px); // Ajustar altura menos la barra de búsqueda
    overflow-y: auto; // Permitir desplazamiento si es necesario
`;

const Grid = ({ children }) => {
    return <GridContainer>{children}</GridContainer>;
};

Grid.Sidebar = Sidebar;
Grid.TopBar = TopBar;
Grid.MainContent = MainContent;

export default Grid;