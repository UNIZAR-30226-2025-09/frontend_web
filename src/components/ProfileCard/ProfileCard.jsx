import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileCard.css";
import { getImageUrl } from "#utils/getImageUrl";
import PropTypes from 'prop-types';

const stringToColor = (string) => {
    if (!string) return "#1b82c3"; // Color por defecto si no hay cadena
    
    const colors = [
        "#1b82c3", // Azul principal
        "#21a1f1", // Azul claro
        "#4f74ff", // Azul índigo
        "#7c5ce0", // Púrpura
        "#ff6b6b", // Rojo coral
        "#2cc990", // Verde esmeralda
        "#ffa94d", // Naranja
        "#e84393", // Rosa
    ];
    
    // Calcula una suma hash del string
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Usa el hash para elegir un color del array
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

const ProfileCard = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const buttonRef = useRef(null);
    
    // Función que obtiene la inicial del nickname
    const getInitial = (nickname) => {
        if (!nickname) return "";
        return nickname[0].toUpperCase();
    };

    // Si no tiene imagen de perfil, se asigna un color aleatorio para el fondo
    const profileColor = user.user_picture ? null : stringToColor(user.nickname || user.mail);
    const initials = getInitial(user.nickname);

    // Cerrar el menú al hacer clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && 
                !optionsRef.current.contains(event.target) && 
                !buttonRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Función para alternar la visibilidad del menú de opciones
    const toggleOptionsMenu = (e) => {
        e.stopPropagation();
        setShowOptions(!showOptions);
    };

    // Truncar texto largo
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Nombres de usuario y correos truncados si son muy largos
    const displayName = truncateText(user.nickname, 15);
    const displayEmail = truncateText(user.mail, 20);

    return (
        <div className="profile-card">
            <div className="profile-content">
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
                            style={{ backgroundColor: profileColor }}
                        >
                            {initials}
                        </div>
                    )}
                </div>
                <div className="profile-info">
                    <div className="profile-name" title={user.nickname}>
                        {displayName}
                    </div>
                    <div className="profile-email" title={user.mail}>
                        {displayEmail}
                    </div>
                </div>
            </div>

            <div className="profile-options">
                <button
                    className="options-button"
                    onClick={toggleOptionsMenu}
                    aria-label="Opciones de perfil"
                    ref={buttonRef}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="6" r="2" fill="currentColor" />
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                        <circle cx="12" cy="18" r="2" fill="currentColor" />
                    </svg>
                </button>

                
                {showOptions && (
                    <div className="options-menu" ref={optionsRef}>
                        <button
                            className="options-item"
                            onClick={() => {
                                setShowOptions(false);
                                navigate("/account");
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                            </svg>
                            <span>Mi Cuenta</span>
                        </button>
                        <button
                            className="options-item options-item-logout"
                            onClick={() => {
                                setShowOptions(false);
                                onLogout();
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                            </svg>
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

ProfileCard.propTypes = {
    user: PropTypes.object.isRequired,
    onLogout: PropTypes.func.isRequired,
};

export default ProfileCard;