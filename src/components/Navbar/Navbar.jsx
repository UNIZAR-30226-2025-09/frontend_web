import React from "react";
import { Link, useLocation } from "react-router-dom"; // Añadido useLocation para detectar la ruta activa
import "./Navbar.css";

function Navbar({ handleAccessWithoutLogin }) {
    const location = useLocation();
    
    // Función para determinar si un enlace está activo
    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };
    
    return (
        <nav className="menu">
            {/* Usar Link con la clase active cuando corresponda */}
            <Link to="/home" className={isActive('/home')} onClick={(e) => handleAccessWithoutLogin(e)}>Dashboard</Link>
            <Link to="/friends" className={isActive('/friends')} onClick={(e) => handleAccessWithoutLogin(e)}>Friends</Link>
            <Link to="/search" className={isActive('/search')} onClick={(e) => handleAccessWithoutLogin(e)}>Search</Link>
            <Link to="/library" className={isActive('/library')} onClick={(e) => handleAccessWithoutLogin(e)}>Library</Link>
        </nav>
    );
}

export default Navbar;