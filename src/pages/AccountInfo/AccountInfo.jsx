import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AccountInfo.css";
import { getImageUrl } from "#utils/getImageUrl";
import { apiFetch } from "#utils/apiFetch";
import { usePlayer } from "../../components/Player/PlayerContext.jsx";

function AccountInfo() {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const navigate = useNavigate();
    const [profileImageShow, setProfileImageShow] = useState(null);
    const {setCurrentSong, setCurrentIndex, setSongs, setIsPlaying} = usePlayer();
    const location = useLocation();
    const [mensaje, setMensaje] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await apiFetch(`/user/${userId}`, {
                    method: "GET",
                });
                setProfileImageShow(data.user_picture || null);
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
            }
        };

        fetchUserInfo();
    }, [userId]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const params = new URLSearchParams(location.search);
                const paymentSuccess = params.get("redirect_status") === "succeeded";

                // Si el pago fue exitoso, actualiza is_premium
                if (paymentSuccess) {
                    await apiFetch("/user/premium", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: { is_premium: true }
                    });

                    // También actualizar en localStorage
                    const storedUser = JSON.parse(localStorage.getItem("user"));
                    storedUser.is_premium = true;
                    localStorage.setItem("user", JSON.stringify(storedUser));

                    setMensaje("¡Ahora eres Premium! 🥳");
                    setTimeout(() => setMensaje(""), 4000);

                    // Limpiar la URL para que no queden los parámetros
                    navigate("/account", { replace: true });
                }

                // Obtener perfil actualizado
                const userData = await apiFetch("/user/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(userData);
            } catch (error) {
                console.error("Error al obtener el perfil:", error);
            }
        };

        fetchUserProfile();

        const params = new URLSearchParams(location.search);
        if (params.get("plan") === "gratis") {
            setMensaje("Has elegido el plan gratuito 🎧");
            const timer = setTimeout(() => setMensaje(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [location, navigate]);

    function handleEditUser() {
        navigate(`/EditAccount`);
    }

    const onLogout = () => {
        // Eliminar los datos del usuario y token del localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        // Resetea el estado del reproductor
        setCurrentSong(null);
        setCurrentIndex(0);
        setSongs([]);
        setIsPlaying(false);

        navigate("/");
    };

    const handleUpgradeToPremium = () => {
        navigate("/premium");
    };

    if (!user) {
        return <p style={{ color: "white", textAlign: "center" }}>Cargando tu cuenta...</p>;
    }

    return (
        <>
            {mensaje && <div className="mensaje-plan">{mensaje}</div>}

            <div className="header">
                <div className="logo-container">
                    <img
                        src="/vibrablanco.png"
                        alt="Vibra Logo"
                        className="logo"
                        onClick={() => {
                            navigate(`/`)
                        }}
                    />
                    <span className="logo-text">Vibra</span>
                </div>
                <div className="profile-container">
                    <div className="profile-picture">
                        <img
                            src={profileImageShow ?
                                (profileImageShow.startsWith('data:') ? profileImageShow : getImageUrl(profileImageShow))
                                : '/default-profile.png'}
                            alt="Foto de perfil"
                            className="profile-img"
                        />
                    </div>
                </div>
            </div>

            <div className="page-container">
                {/* Contenedor de los planes (similar a Spotify) */}
                <div className="plans-container">
                    {/* Tu plan (izquierda) */}
                    <div className="plan-box">
                        <div className="plan-header">
                            <span className="plan-label">TU PLAN</span>
                            <h2 className="plan-title">
                                {user?.is_premium ? "Premium Individual" : "Plan Gratuito"}
                            </h2>
                            {user?.is_premium && (
                                <>
                                    <p className="plan-details">Tu próxima factura es de $6.99 y se emite el 8/3/25.</p>
                                    <p className="plan-details">Visa terminada en 2258</p>
                                </>
                            )}
                            {!user?.is_premium && (
                                <p className="plan-details">Disfruta de Vibra con anuncios y funciones limitadas.</p>
                            )}
                        </div>
                    </div>

                    {/* Promo Premium (derecha) - Solo visible para usuarios no premium */}
                    {!user?.is_premium && (
                        <div className="premium-promo-box">
                            <div className="premium-icon">
                                <svg viewBox="0 0 24 24" width="28" height="28">
                                    <circle cx="12" cy="12" r="11" fill="#FFFFFF"/>
                                    <path fill="#7B3FFB" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
                                </svg>
                            </div>
                            <h2 className="premium-title">Únete a Vibra Premium</h2>
                            <p className="premium-description">Disfruta de música sin anuncios, escucha la canción que quieras.</p>

                            <div className="premium-benefits">
                                <div className="benefit">
                                    <span className="check">✓</span>
                                    <span>Música sin anuncios</span>
                                </div>
                                <div className="benefit">
                                    <span className="check">✓</span>
                                    <span>Escucha la canción que quieras cuando quieras</span>
                                </div>
                            </div>

                            <button className="premium-button" onClick={handleUpgradeToPremium}>
                                Descubre Premium
                            </button>
                        </div>
                    )}
                </div>

                {/* Cuenta (debajo de ambos planes) */}
                <div className="account-section">
                    <h2 className="section-title">Cuenta</h2>
                    <div className="account-options">
                        <button className="account-option" onClick={handleEditUser}>
                            <div className="option-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                </svg>
                            </div>
                            <span>Editar perfil</span>
                        </button>

                        <button className="account-option">
                            <div className="option-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z" />
                                </svg>
                            </div>
                            <span>Administrar suscripción</span>
                        </button>

                        <div className="account-actions">
                            <button className="action-button" onClick={() => handleEditUser()}> Editar perfil </button>
                            <button className="action-button" onClick={() => navigate(`/plans`)}>Administrar suscripción</button>

                            {user?.is_premium && (
                                <button className="account-option">
                                    <div className="option-icon">
                                        <svg viewBox="0 0 24 24" width="24" height="24">
                                            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                        </svg>
                                    </div>
                                    <span>Cancelar suscripción</span>
                                </button>
                            )}

                            <button className="account-option logout" onClick={onLogout}>
                                <div className="option-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="currentColor" d="M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z" />
                                    </svg>
                                </div>
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    </div>
                </div>        
            </div>
        </>
    );
}

export default AccountInfo;