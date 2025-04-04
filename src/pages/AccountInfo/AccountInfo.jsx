import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "#utils/apiFetch";
import "./AccountInfo.css";

function AccountInfo() {
    const location = useLocation();
    const navigate = useNavigate(); // 👈 para limpiar la URL
    const [mensaje, setMensaje] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const params = new URLSearchParams(location.search);
                const paymentSuccess = params.get("redirect_status") === "succeeded"; // ✅ Detectar correctamente

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

    return (
        <>
            {mensaje && <div className="mensaje-plan">{mensaje}</div>}

            <div className="header">
                <div className="logo-container">
                    <img
                        src="../vibrablanco.png"
                        alt="Vibra Logo"
                        className="logo"
                        onClick={() => window.location.reload()}
                    />
                    <span className="logo-text">Vibra</span>
                </div>
                <div className="profile-container">
                    <div className="profile-picture">
                        <img
                            src="../profile-placeholder.png"
                            alt="Foto de perfil"
                            className="profile-img"
                        />
                    </div>
                </div>
            </div>

            <div className="account-info-page">
                <div className="plan-box">
                    <div className="plan-header">
                        <span className="plan-label">Tu plan</span>
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
                    <button className="action-button">Editar perfil</button>
                    <button className="action-button">Administrar suscripción</button>
                    {user?.is_premium && (
                        <button className="action-button">Cancelar suscripción</button>
                    )}
                    <button className="action-button logout">Cerrar sesión</button>
                </div>
            </div>
        </>
    );
}

export default AccountInfo;
