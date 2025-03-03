import React from "react";
import styled from "styled-components";

const MainContentWrapper = styled.div`
    grid-area: main;
    padding: 20px;
    background-color: #333;
    color: white;
    height: calc(100vh - 80px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

// Estilos para las secciones
const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const SectionTitle = styled.h2`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #fff;
`;

// Estilos de la lista de tarjetas
const CardList = styled.div`
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding-bottom: 10px;
`;

// Estilo para cada tarjeta de canción o playlist
const Card = styled.div`
    background: #444;
    padding: 15px;
    border-radius: 8px;
    min-width: 150px;
    text-align: center;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background: #555;
    }
`;

const MainContent = () => {
    const recommendedPlaylists = ["Top Hits", "Relax Vibes", "Workout Mix", "Chill Beats"];
    const recommendedSongs = ["Song 1", "Song 2", "Song 3", "Song 4"];

    return (
        <MainContentWrapper>
            {/* Sección de Playlists Recomendadas */}
            <Section>
                <SectionTitle>Playlists Recomendadas</SectionTitle>
                <CardList>
                    {recommendedPlaylists.map((playlist, index) => (
                        <Card key={index}>{playlist}</Card>
                    ))}
                </CardList>
            </Section>

            {/* Sección de Canciones Recomendadas */}
            <Section>
                <SectionTitle>Canciones Recomendadas</SectionTitle>
                <CardList>
                    {recommendedSongs.map((song, index) => (
                        <Card key={index}>{song}</Card>
                    ))}
                </CardList>
            </Section>
        </MainContentWrapper>
    );
};

export default MainContent;