import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AccountInfo.css";
import {useNavigate} from "react-router-dom";
import {getImageUrl} from "#utils/getImageUrl";
import {apiFetch} from "#utils/apiFetch";
import {usePlayer} from "../../components/Player/PlayerContext.jsx";

function AccountInfo() {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const navigate = useNavigate();
    const [profileImageShow, setProfileImageShow] = useState(null);
    const {setCurrentSong, setCurrentIndex, setSongs, setIsPlaying} = usePlayer();

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

    function handleEditUser() {
        navigate(`/EditAccount`);
    }

    const location = useLocation();
    const [mensaje, setMensaje] = useState("");
    const [user, setUser] = useState(null);

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

    if (!user) {
        return <p style={{ color: "white", textAlign: "center" }}>Cargando tu cuenta...</p>;
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

    return (
        <>
            {mensaje && <div className="mensaje-plan">{mensaje}</div>}

            <div className="header">
                <div className="logo-container">
                    <img
                        src="../vibrablanco.png"
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
                                : '../default-profile.png'}
                            alt="Foto de perfil"
                            className="profile-img"
                        />
                    </div>
                </div>
            </div>

            <div className="account-info-container">
                <div className="account-info-column">
                    <div className="account-plan-box">
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

                    <div className="account-actions">
                        <button className="account-button" onClick={handleEditUser}>Editar perfil</button>
                        <button className="account-button">Administrar suscripción</button>
                        {user?.is_premium && (
                            <button className="account-button">Cancelar suscripción</button>
                        )}
                        <button className="account-button logout" onClick={onLogout}>Cerrar sesión</button>
                    </div>
                </div>

                {!user?.is_premium && (
                    <div className="premium-promo-box">
                        <div className="premium-icon">
                            <svg viewBox="0 0 24 24" width="32" height="32">
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
                                <span>Reproducción sin conexión</span>
                            </div>
                            <div className="benefit">
                                <span className="check">✓</span>
                                <span>Sonido de alta calidad</span>
                            </div>
                        </div>

                        <button className="premium-button" onClick={handleUpgradeToPremium}>
                            Descubre Premium
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}


export default AccountInfo;
