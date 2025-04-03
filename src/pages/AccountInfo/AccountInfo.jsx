import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AccountInfo.css";
import {useNavigate} from "react-router-dom";



function AccountInfo() {

    const navigate = useNavigate();

    function handleEditUser() {
        navigate(`/EditAccount`);
    }

    const location = useLocation();
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("plan") === "gratis") {
            setMensaje("Has elegido el plan gratuito 🎧");
            const timer = setTimeout(() => setMensaje(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [location]);


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
                        {/* Aquí puedes poner la foto si el usuario tiene una */}
                        <img
                            src="../profile-placeholder.png"
                            alt="Foto de perfil"
                            className="profile-img"
                        />
                    </div>
                </div>

            </div>

            {mensaje && (
                <div className="mensaje-plan">{mensaje}</div>
            )}


            <div className="account-info-page">
                {/* Sección: Plan */}
                <div className="plan-box">
                    <div className="plan-header">
                        <span className="plan-label">Tu plan</span>
                        <h2 className="plan-title">Premium Individual</h2>
                        <p className="plan-details">Tu próxima factura es de $6.99 y se emite el 8/3/25.</p>
                        <p className="plan-details">Visa terminada en 2258</p>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="account-actions">
                    <button className="action-button">Editar perfil onClick={() => handleEditUser()}</button>
                    <button className="action-button">Administrar suscripción</button>
                    <button className="action-button">Cancelar suscripción</button>
                    <button className="action-button logout">Cerrar sesión</button>
                </div>
            </div>
        </>
    );
}

export default AccountInfo;
