import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Subs from "./Subs/Subs";
import Menu from "./Menu/Menu"; // Importa el componente Menu
import ProfileDropdown from "./Profile/Profile";

function App() {
    return (
        <Router> {/* Router debe envolver todo */}
            <div className="app-container">
                <ProfileDropdown /> {/* Menú desplegable */}

                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/subs" element={<Subs />} />
                    <Route path="/menu" element={<Menu />} /> {/* Nueva ruta */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;