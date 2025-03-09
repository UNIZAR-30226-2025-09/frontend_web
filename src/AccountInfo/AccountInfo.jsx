import React from "react";
import { useNavigate } from "react-router-dom";
import "./AccountInfo.css";

function AccountInfo() {
    const navigate = useNavigate();

    return (
        <div className="account-container">
            {/* Sección del plan */}
            <div className="account-box">
                <h2>Tu Plan</h2>
                <p><strong>Premium Individual</strong></p>
                <p>Tu próxima factura es de $6.99 y se emite el 8/3/25.</p>
                <p>Visa terminada en 2258</p>
            </div>

            {/* Sección de cuenta */}
            <div className="account-box">
                <h2>Cuenta</h2>
                <div className="account-option">
                    <button className="account-button">Editar Perfil</button>
                </div>
                <div className="account-option">
                    <button className="account-button">Recuperar Listas</button>
                </div>
                <div className="account-option">
                    <button className="account-button">Dirección</button>
                </div>
            </div>

            {/* Sección de suscripción */}
            <div className="account-box">
                <h2>Suscripción</h2>
                <div className="account-option">
                    <button className="account-button">Suscripciones Disponibles</button>
                </div>
                <div className="account-option">
                    <button className="account-button">Administrar Suscripción</button>
                </div>
                <div className="account-option">
                    <button className="account-button">Cancelar Suscripción</button>
                </div>
            </div>

         {/* Sección de pago */}
<div className="account-box">
    <h2>Método de Pago</h2>
    <div className="account-option">
        <button className="account-button">Actualizar Tarjeta</button>
    </div>
</div>



            {/* Botón de volver */}
            <div className="account-footer">
                <button className="back-button" onClick={() => navigate(-1)}>
                    Volver
                </button>
            </div>
        </div>
    );
}

export default AccountInfo;
