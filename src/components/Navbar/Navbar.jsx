import React from "react";
import { Link } from "react-router-dom"; // Importar Link de react-router-dom
import "./Navbar.css";

function Navbar({ handleAccessWithoutLogin }) {
    return (
        <nav className="menu">
            {/* Usar Link de react-router-dom para la navegación interna */}
            <Link to="/home" onClick={(e) => handleAccessWithoutLogin(e)}>Dashboard</Link>
            <Link to="/browse" onClick={(e) => handleAccessWithoutLogin(e)}>Browse</Link>
            <Link to="/search" onClick={(e) => handleAccessWithoutLogin(e)}>Search</Link>
            <Link to="/library" onClick={(e) => handleAccessWithoutLogin(e)}>Library</Link>
        </nav>
    );
}

export default Navbar;
