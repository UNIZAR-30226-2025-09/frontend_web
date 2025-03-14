import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./components/Player/PlayerContext.jsx";

// Páginas principales
import MainLayout from "./layout/MainLayout/MainLayout";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Register1 from "./pages/Register/Register1";
import Playlist from "./pages/Playlist/Playlist";
import AccountInfo from "./pages/AccountInfo/AccountInfo";

function App() {
    const [user, setUser] = useState(null);
    return (
        <PlayerProvider>
            <Router>
                <Routes>

                    {/* Páginas de autenticación sin reproductor ni sidebar */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/register1" element={<Register1 />} />

                    {/* Página del dashboard (con sidebar y reproductor ya dentro de Dashboard.jsx) */}
                    <Route path="/" element={<MainLayout user={user} />} />

                    {/* Otras páginas dentro del dashboard */}
                    <Route path="/playlist/:playlistId" element={<Playlist />} />
                    <Route path="/account" element={<AccountInfo />} />
                </Routes>
            </Router>
        </PlayerProvider>
    );
}

export default App;
