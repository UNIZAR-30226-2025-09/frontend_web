import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Subs from "./Subs/Subs";
import Menu from "./Menu/Menu"; // Importa el componente Menu
import HelloBye from "./HelloBye/HelloBye.jsx";
import Playlist from "./Playlist/Playlist.jsx";

function App() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/subs" element={<Subs />} />
                    <Route path="/menu" element={<Menu />} /> {/* Nueva ruta */}
                    <Route path="/hellobye" element={<HelloBye />} />
                    <Route path="/playlist/:playlistId" element={<Playlist/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;