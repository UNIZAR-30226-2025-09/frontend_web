import React from "react";
import "./PlaylistGrid.css";

const playlists = [
    { title: "Éxitos España", img: "https://i.scdn.co/image/ab67706f00000002b27c80d9e9d77a3e57d1d5c8" },
    { title: "Viva Latino", img: "https://i.scdn.co/image/ab67706f00000002c3e5f4b6ecb8b885b7e6e564" },
    { title: "PEGAO", img: "https://i.scdn.co/image/ab67706f000000023b4d79f3e2f7a30ee9021f69" },
    { title: "Viral España 2025", img: "https://i.scdn.co/image/ab67706f00000002b27c80d9e9d77a3e57d1d5c8" },
];

const PlaylistGrid = () => {
    return (
        <div className="playlist-grid">
            {playlists.map((playlist, index) => (
                <div key={index} className="playlist-card">
                    <img src={playlist.img} alt={playlist.title} />
                    <p>{playlist.title}</p>
                </div>
            ))}
        </div>
    );
};

export default PlaylistGrid;
