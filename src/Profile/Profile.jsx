import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "./Profile.css";

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Función para cerrar el menú si se hace clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const goToSettings = () => {
        navigate("/account"); // Redirige a AccountInfo
    };

    return (
        <div className="profile-container" ref={dropdownRef}>
            <div className="profile-border" onClick={() => setIsOpen(!isOpen)}>
                <svg className="profile-icon" width="50" height="50" viewBox="0 0 24 24">
                    <circle cx="12" cy="7" r="5" fill="#E0E0E0" />
                    <path d="M4 21C4 17.134 7.134 14 11 14H13C16.866 14 20 17.134 20 21" 
                        fill="none" stroke="#C4C4C4" strokeWidth="2" />
                </svg>
            </div>
            {isOpen && (
                <div className="dropdown-menu">
                    <ul>
                        <li>Amigos</li>
                        <li onClick={goToSettings} style={{ cursor: "pointer" }}>Ajustes</li> 
                        <li className="logout">Cerrar sesión</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Profile;
