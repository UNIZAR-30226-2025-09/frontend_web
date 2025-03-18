import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register3.css";

const Register3 = () => {
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const navigate = useNavigate();

    const handleRegister = () => {
        alert("¡Registro completado!");
        navigate("/home"); // Redirigir después del registro
    };

    return (
        <div className="register3-container">
            <div className="register3-box">
                <img src="../vibrablanco.png" alt="Vibra Logo" className="logo" />

                {/* Barra de progreso */}
                <div className="progress-bar">
                    <div className="progress" style={{ width: "100%" }}></div>
                </div>

                <h2>Paso 3 de 3</h2>
                <h1 className="title">Términos y Condiciones</h1>

                <div className="terms-container">
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="check1"
                            checked={checked1}
                            onChange={() => setChecked1(!checked1)}
                        />
                        <label htmlFor="check1">
                            Quiero que me enviéis novedades y ofertas de Vibra
                        </label>
                    </div>

                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="check2"
                            checked={checked2}
                            onChange={() => setChecked2(!checked2)}
                        />
                        <label htmlFor="check2">
                            Compartir mis datos de registro con los proveedores de contenido de Vibra para fines de marketing.
                            Ten en cuenta que tus datos pueden ser transferidos a un país fuera del EEE, tal y como se recoge
                            en nuestra <a href="#" onClick={() => navigate("/politica-privacidad")}>Política de Privacidad</a>.
                        </label>
                    </div>
                </div>

                <p className="terms-text">
                    Al hacer clic en Registrarte, aceptas los{" "}
                    <a href="#" onClick={() => navigate("/terminos-condiciones")}>Términos y condiciones de uso</a> de Vibra.
                </p>
                <p className="terms-text">
                    Para obtener más información sobre cómo Vibra recopila,
                    utiliza y protege tus datos personales, consulta nuestra{" "}
                    <a href="#" onClick={() => navigate("/politica-privacidad")}>Política de privacidad</a>.
                </p>

                <button className="register-btn" onClick={handleRegister}>
                    Registrarte
                </button>
            </div>
        </div>
    );
};

export default Register3;
