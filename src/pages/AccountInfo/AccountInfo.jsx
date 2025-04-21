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
    const [notificationInfo, setNotificationInfo] = useState({
        show: false,
        title: "",
        message: "",
        icon: "" // Para mostrar diferentes iconos según el tipo de notificación
    });    
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
                const freePlan = params.get("plan") === "gratis";

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

                    setNotificationInfo({
                        show: true,
                        title: "¡Enhorabuena!",
                        message: "¡Ahora eres Premium! Disfruta de todas las ventajas sin límites.",
                        icon: "premium"
                    });

                    // Limpiar la URL para que no queden los parámetros
                    navigate("/account", { replace: true });
                    
                    // Forzar recarga de datos del usuario después de actualizar
                    const updatedUserData = await apiFetch("/user/profile", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser(updatedUserData);
                    return; // Salir para evitar sobreescritura
                }

                // Si venimos de elegir el plan gratuito
                if (freePlan) {
                    // Actualizar en el servidor
                    await apiFetch("/user/premium", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: { is_premium: false }
                    });
                    
                    // Actualizar en localStorage
                    const storedUser = JSON.parse(localStorage.getItem("user"));
                    storedUser.is_premium = false;
                    localStorage.setItem("user", JSON.stringify(storedUser));
                    
                    setNotificationInfo({
                        show: true,
                        title: "Plan seleccionado",
                        message: "Has elegido el plan gratuito. Disfruta de Vibra con las funciones básicas.",
                        icon: "free"
                    });
                    
                    // Limpiar la URL para que no queden los parámetros
                    navigate("/account", { replace: true });
                    
                    // Forzar recarga de datos del usuario después de actualizar
                    const updatedUserData = await apiFetch("/user/profile", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    
                    // Asegurarse que is_premium es false antes de actualizar el estado
                    updatedUserData.is_premium = false;
                    setUser(updatedUserData);
                    return; // Salir para evitar sobreescritura
                }

                // Si no hay parámetros especiales, simplemente obtenemos el perfil actual
                if (!paymentSuccess && !freePlan) {
                    const userData = await apiFetch("/user/profile", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    
                    // Asegurarnos de que el estado del usuario refleja lo que hay en localStorage
                    const storedUser = JSON.parse(localStorage.getItem("user"));
                    userData.is_premium = storedUser.is_premium;
                    
                    setUser(userData);
                }
                
            } catch (error) {
                console.error("Error al obtener el perfil:", error);
            }
        };

        fetchUserProfile();
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
        navigate("/checkout");
    };

    // Función para mostrar el modal de confirmación
    const showCancelConfirmation = () => {
        setShowModal(true);
    };

    // Función para procesar la cancelación después de confirmación
    const processCancelSubscription = async () => {
        setShowModal(false);
        setIsLoading(true);
        
        try {
            const token = localStorage.getItem("token");
            
            await apiFetch("/user/premium", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: { is_premium: false }
            });
            
            // Actualizar el estado local
            setUser({
                ...user,
                is_premium: false
            });

            // También actualizar en localStorage
            const storedUser = JSON.parse(localStorage.getItem("user"));
            storedUser.is_premium = false;
            localStorage.setItem("user", JSON.stringify(storedUser));
            
            // Mostrar notificación con un popup
            setNotificationInfo({
                show: true,
                title: "Suscripción cancelada",
                message: "Tu suscripción premium ha sido cancelada. Esperamos verte pronto de nuevo.",
                icon: "cancel"
            });
            
        } catch (error) {
            console.error("Error al cancelar la suscripción:", error);
            setNotificationInfo({
                show: true,
                title: "Error",
                message: "Hubo un problema al cancelar tu suscripción. Inténtalo de nuevo más tarde.",
                icon: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Modal de confirmación personalizado
    const ConfirmationModal = () => {
        if (!showModal) return null;
        
        return (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
                <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                    <h3 className="modal-title">Cancelar suscripción Premium</h3>
                    <p className="modal-message">
                        ¿Estás seguro de que deseas cancelar tu suscripción premium? 
                        Perderás el acceso a todas las funciones premium como reproducción 
                        sin anuncios y selección de canciones específicas.
                    </p>
                    <div className="modal-buttons">
                        <button 
                            className="modal-button modal-button-cancel"
                            onClick={() => setShowModal(false)}
                        >
                            Volver
                        </button>
                        <button 
                            className="modal-button modal-button-confirm"
                            onClick={processCancelSubscription}
                        >
                            Sí, cancelar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const NotificationModal = () => {
        if (!notificationInfo.show) return null;
        
        // Definimos los iconos según el tipo de notificación
        let iconContent;
        let iconColor = "notification-icon-default"; // Valor por defecto

        switch(notificationInfo.icon) {
            case 'premium':
                iconContent = (
                    <svg viewBox="0 0 24 24" width="42" height="42">
                        <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
                        <circle cx="12" cy="12" r="9" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
                    </svg>
                );
                iconColor = "notification-icon-premium";
                break;
            case 'free':
                iconContent = (
                    <svg viewBox="0 0 24 24" width="42" height="42">
                        <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                        <path fill="rgba(255,255,255,0.3)" d="M12 4C7.6 4 4 7.6 4 12S7.6 20 12 20 20 16.4 20 12 16.4 4 12 4M12 5C15.9 5 19 8.1 19 12S15.9 19 12 19 5 15.9 5 12 8.1 5 12 5Z" />
                    </svg>
                );
                iconColor = "notification-icon-free";
                break;
            case 'cancel':
                iconContent = (
                    <svg viewBox="0 0 24 24" width="42" height="42">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path fill="currentColor" d="M17,7L7,17 M7,7L17,17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                );
                iconColor = "notification-icon-cancel";
                break;
            case 'error':
                iconContent = (
                    <svg viewBox="0 0 24 24" width="42" height="42">
                        <circle cx="12" cy="12" r="10" fill="currentColor" />
                        <path fill="white" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    </svg>
                );
                iconColor = "notification-icon-error";
                break;
            default:
                iconContent = (
                    <svg viewBox="0 0 24 24" width="42" height="42">
                        <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                    </svg>
                );
                iconColor = "notification-icon-default";
        }

        return (
            <div className="notification-overlay" onClick={() => setNotificationInfo({...notificationInfo, show: false})}>
                <div className="notification-container" onClick={(e) => e.stopPropagation()}>
                    <div className={`notification-icon ${iconColor}`}>
                        {iconContent}
                    </div>
                    <h3 className="notification-title">{notificationInfo.title}</h3>
                    <p className="notification-message">{notificationInfo.message}</p>
                    <button 
                        className="notification-button"
                        onClick={() => setNotificationInfo({...notificationInfo, show: false})}
                    >
                        Entendido
                    </button>
                </div>
            </div>
        );
    };

    if (!user) {
        return <p style={{ color: "white", textAlign: "center" }}>Cargando tu cuenta...</p>;
    }

    return (
        <>
            {notificationInfo.show && <NotificationModal />}
            {showModal && <ConfirmationModal />}

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

                        <button className="account-option" onClick={() => navigate(`/plans`)}>
                            <div className="option-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z" />
                                </svg>
                            </div>
                            <span>Administrar suscripción</span>
                        </button>

                        {user?.is_premium && (
                            <button 
                                className="account-option" 
                                onClick={showCancelConfirmation} 
                                disabled={isLoading}
                            >
                                <div className="option-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                    </svg>
                                </div>
                                <span>{isLoading ? "Cancelando..." : "Cancelar suscripción"}</span>
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
        </>
    );
}

export default AccountInfo;