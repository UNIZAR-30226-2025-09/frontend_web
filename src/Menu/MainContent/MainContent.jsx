import React from "react";
import styled from "styled-components";

const MainContentWrapper = styled.div`
    grid-area: main;
    padding: 20px;
    background-color: transparent;
    color: white;
    height: calc(100vh - 80px);
    overflow-y: auto;
    display: grid;
    grid-template-rows: repeat(2, auto);
    gap: 10px; // Reducir el gap
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const CardList = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr); // 6 elementos por fila
    gap: 15px;
    padding-bottom: 10px;
`;

const SectionTitle = styled.h2`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #fff;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1;
    margin-left: 0px;
`;

const CircularCard = styled.div`
    width: 150px;
    height: calc(150px + 30px); // Ajustar el height
    border-radius: 50%;
    background-color: #444;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    padding: 15px; // Añadir padding vertical

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
`;

const PlaylistImage = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
`;

const PlaylistDetails = styled.span`
    font-size: 12px;
    margin-top: 10px;
    color: #b0c4de;
    text-align: center;
`;

const PlayIcon = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;

    ${CircularCard}:hover & {
        opacity: 1;
    }
`;

const MainContent = () => {
    const recommendedPlaylists = [
        { name: "Top Hits", artist: "Various Artists", image: "URL_IMAGEN_1" },
        { name: "Relax Vibes", artist: "Chill Collective", image: "URL_IMAGEN_2" },
        { name: "Workout Mix", artist: "Fitness Beats", image: "URL_IMAGEN_3" },
        { name: "Chill Beats", artist: "Lo-fi Sounds", image: "URL_IMAGEN_4" },
        { name: "Lo-fi", artist: "Lo-fi Sounds", image: "URL_IMAGEN_5" },
        { name: "Jazz", artist: "Jazz Collective", image: "URL_IMAGEN_6" },
    ];

    //const recommendedSongs = ["Song 1", "Song 2", "Song 3", "Song 4", "Song 5"];

    return (
        <MainContentWrapper>
            <Section>
                <SectionTitle>Playlists Recomendadas</SectionTitle>
                <CardList>
                    {recommendedPlaylists.map((playlist, index) => (
                        <div key={index}>
                            <CircularCard>
                                <PlaylistImage src={playlist.image} alt={playlist.name} />
                                <PlayIcon>▶</PlayIcon>
                            </CircularCard>
                            <PlaylistDetails>{playlist.artist}</PlaylistDetails>
                        </div>
                    ))}
                </CardList>
            </Section>

            <Section>
                <SectionTitle>Canciones Recomendadas</SectionTitle>
                <CardList>
                    {recommendedPlaylists.map((playlist, index) => (
                        <div key={index}>
                            <CircularCard>
                                <PlaylistImage src={playlist.image} alt={playlist.name} />
                                <PlayIcon>▶</PlayIcon>
                            </CircularCard>
                            <PlaylistDetails>{playlist.artist}</PlaylistDetails>
                        </div>
                    ))}
                </CardList>
            </Section>
        </MainContentWrapper>
    );
};

export default MainContent;