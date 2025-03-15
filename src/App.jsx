import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./components/Player/PlayerContext.jsx";

// Layout principal
import MainLayout from "./layout/MainLayout/MainLayout";

// Páginas principales
import Home from "./pages/Home/Home";  // <-- 🏠 Nueva página principal
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Register1 from "./pages/Register/Register1";
import Register2 from "./pages/Register/Register2";
import Playlist from "./pages/Playlist/Playlist";
import Library from "./pages/Library/Library";
import AccountInfo from "./pages/AccountInfo/AccountInfo";

function App() {
    const [user, setUser] = useState(null);
    return (
        <PlayerProvider>
            <Router>
                <Routes>
                    {/* Páginas de autenticación sin sidebar ni reproductor */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/register1" element={<Register1 />} />
                    <Route path="/register2" element={<Register2 />} />

                    {/* Páginas dentro del MainLayout */}
                    <Route path="/" element={<MainLayout user={user} />}>
                        <Route index element={<Home />} /> {/* <-- Página principal */}
                        <Route path="playlist" element={<Playlist />} />
                        <Route path="library" element={<Library />} />
                        <Route path="account" element={<AccountInfo />} />
                    </Route>
                </Routes>
            </Router>
        </PlayerProvider>
    );
}

export default App;
