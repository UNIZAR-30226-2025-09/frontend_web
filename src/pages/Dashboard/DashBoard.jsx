import React from "react";
import MainLayout from "../../layout/MainLayout/MainLayout";
import PlaylistGrid from "../../components/PlaylistGrid/PlaylistGrid";
import SongList from "../../components/Player/SongList.jsx";
import "./Dashboard.css";

const Dashboard = () => {
    const user = {
        name: "MARIOgTRZN",
        email: "mariogtrzn@gmail.com",
        imageUrl: "https://via.placeholder.com/50",
    };

    return (
        <MainLayout user={user}>  {/* Ahora sí hay usuario */}
            <div className="top-section">
                <h2>Playlists Destacadas</h2>
                <input type="text" placeholder="Search..." className="search-bar" />
            </div>
            <PlaylistGrid />

            <div className="song-section">
                <h3>Most Popular</h3>
                <SongList />
            </div>
        </MainLayout>
    );
};

export default Dashboard;
