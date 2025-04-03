import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileCard.css";
import {getImageUrl} from "#utils/getImageUrl";

// Función para generar un color aleatorio para el fondo
const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const ProfileCard = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false); // Estado para manejar la visibilidad de las opciones

    // Función que obtiene la inicial del nickname
    const getInitial = (nickname) => {
        if (!nickname) return "";
        return nickname[0].toUpperCase();
    };

    // Si no tiene imagen de perfil, se asigna un color aleatorio para el fondo
    const profileColor = user.user_picture ? null : generateRandomColor();
    const initials = getInitial(user.nickname);

    // Función para alternar la visibilidad del menú de opciones
    const toggleOptionsMenu = (e) => {
        e.stopPropagation(); // Evita que el clic cierre el menú accidentalmente
        setShowOptions(!showOptions);
    };

    return (
        <div className="profile-card">
            <div className="profile-pic-container">
                {user.user_picture ? (
                    <img
                        src={getImageUrl(user.user_picture)}
                        alt="Profile"
                        className="profile-pic"
                    />
                ) : (
                    <div
                        className="profile-pic-default"
                        style={{ backgroundColor: profileColor }} // Fondo aleatorio
                    >
                        {initials} {/* Muestra la inicial del nickname */}
                    </div>
                )}
            </div>
            <div className="profile-info">
                <p className="profile-name">{user.nickname}</p>
                <p className="profile-email">{user.mail}</p>
            </div>
            <div className="options-container">
                <button
                    className="options-button"
                    onClick={toggleOptionsMenu}
                >
                    ⋮ {/* Tres puntos */}
                </button>

                {showOptions && (
                    <div className="options-menu">
                        <button
                            className="options-item"
                            onClick={() => navigate("/account")}
                        >
                            Mi Cuenta
                        </button>
                        <button
                            className="options-item"
                            onClick={onLogout}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;
