import React, { useEffect, useState } from "react";
import { apiFetch } from "#utils/apiFetch";
import "./AccountInfo.css";
import { useNavigate } from "react-router-dom";

const logo = "/vibrablanco.png";

function AccountInfo() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const userData = await apiFetch("/user/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(userData);
            } catch (error) {
                console.error("Error al cargar el perfil del usuario:", error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const goToSubs = () => navigate("/subs");

    return (
        <>
            <div className="header">
                <div className="logo-container">
                    <img
                        src={logo}
                        alt="Vibra Logo"
                        className="logo"
                        onClick={() => window.location.reload()}
                    />
                    <span className="logo-text">Vibra</span>
                </div>
                <div className="profile-container">
                    <div className="profile-picture">
                        <img
                            src={user?.user_picture || "/profile-placeholder.png"}
                            alt="Foto de perfil"
                            className="profile-img"
                        />
                    </div>
                </div>
            </div>

            <div className="account-info-page">
                {/* Sección: Plan */}
                <div className="plan-box">
                    <div className="plan-header">
                        <span className="plan-label">Tu plan</span>
                        <h2 className="plan-title">
                            {user?.is_premium ? "Premium Individual" : "Gratuito"}
                        </h2>
                        {user?.is_premium ? (
                            <>
                                <p className="plan-details">
                                    Tu próxima factura es de $6.99 y se emite el 8/3/25.
                                </p>
                                <p className="plan-details">Visa terminada en 2258</p>
                            </>
                        ) : (
                            <p className="plan-details">
                                Disfruta de tu música con anuncios y sin descarga offline.
                            </p>
                        )}
                    </div>

                    {/* Si no es premium, mostrar botón "Ver planes" */}
                    {!user?.is_premium && (
                        <div className="plan-actions">
                            <button className="view-plans-btn" onClick={goToSubs}>
                                Ver planes
                            </button>
                        </div>
                    )}
                </div>

                {/* Tarjeta fuera del contenedor si no es premium */}
                {!user?.is_premium && (
                    <div className="upgrade-card" onClick={goToSubs}>
                        <img src="/diamond-icon.svg" alt="Premium Icon" className="premium-icon" />
                        <p className="upgrade-text">Unirte a Premium</p>
                    </div>
                )}

                <div className="account-actions">
                    <button className="action-button">Editar perfil</button>
                    {user?.is_premium && (
                        <>
                            <button className="action-button">Administrar suscripción</button>
                            <button className="action-button">Cancelar suscripción</button>
                        </>
                    )}
                    <button className="action-button logout" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </>
    );
}

export default AccountInfo;
