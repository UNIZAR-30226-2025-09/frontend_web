import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PantallaInicial from "./PantallaInicial/PantallaInicial"; // Importa la pantalla inicial
import Login from "./Login/Login";
import Subs from "./Subs/Subs";
import Menu from "./Menu/Menu"; // Importa el componente Menu
import HelloBye from "./HelloBye/HelloBye.jsx";
import Playlist from "./Playlist/Playlist.jsx";
import Register from "./Register/Register";
import ProfileDropdown from "./Profile/Profile"; // Importa el menú desplegable
import AccountInfo from "./AccountInfo/AccountInfo"; // Importa AccountInfo

function App() {
    return (
        <Router> {/* Router debe envolver todo */}
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<PantallaInicial />} /> {/* Ahora va a la pantalla inicial */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/subs" element={<Subs />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/hellobye" element={<HelloBye />} />
                    <Route path="/playlist/:playlistId" element={<Playlist />} />
                    <Route path="/account" element={<AccountInfo />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
