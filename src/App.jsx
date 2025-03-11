import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./components/Player/PlayerContext.jsx";

// Páginas principales
import Home from "./pages/Home/Home"; // ✅ Importación correcta
import Dashboard from "./pages/Dashboard/Dashboard";
import Playlist from "./pages/Playlist/Playlist";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AccountInfo from "./pages/AccountInfo/AccountInfo";

function App() {
    return (
        <PlayerProvider>
            <Router>
                <Routes>
                    {/* Página de inicio antes de iniciar sesión */}
                    <Route path="/" element={<Home />} />

                    {/* Páginas de autenticación sin reproductor ni sidebar */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/playlist/:playlistId" element={<Playlist />} />

                    {/* Página del dashboard (con sidebar y reproductor ya dentro de Dashboard.jsx) */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Otras páginas dentro del dashboard */}
                    <Route path="/playlist/:playlistId" element={<Playlist />} />
                    <Route path="/account" element={<AccountInfo />} />
                </Routes>
            </Router>
        </PlayerProvider>
    );
}

export default App;
