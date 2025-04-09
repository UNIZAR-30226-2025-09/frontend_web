import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterStyle.css";

const RegisterStyle = () => {
    const [selectedStyle, setSelectedStyle] = useState(null);
    const navigate = useNavigate();

    const styles = [
        "Pop",
        "Rock",
        "Reggaeton",
        "Flamenco",
        "Rap",
        "Trap",
    ];

    const handleStyleSelection = (style) => {
        setSelectedStyle(style);
    };

    const handleNext = () => {
        if (!selectedStyle) {
            alert("Por favor, selecciona un estilo favorito.");
            return;
        }

        const userData = JSON.parse(localStorage.getItem("userData")) || {};
        userData.style_fav = selectedStyle;
        localStorage.setItem("userData", JSON.stringify(userData));

        navigate("/register3");
    };

    return (
        <div className="register-style-container">
            <div className="register-style-box">
                <img
                    src="/vibrablanco.png"
                    alt="Logo Vibra"
                    className="register-style-logo"
                />
                <div className="progress-bar">
                    <div className="progress" style={{ width: "66%" }}></div>
                </div>
                <h2>Paso 3 de 4</h2>
                <h1 className="title">Selecciona tu estilo favorito</h1>
                <div className="styles-grid">
                    {styles.map((style) => (
                        <div
                            key={style}
                            className={`style-card ${
                                selectedStyle === style ? "selected" : ""
                            }`}
                            onClick={() => handleStyleSelection(style)}
                        >
                            {style}
                        </div>
                    ))}
                </div>
                <button className="btn-blue" onClick={handleNext}>
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default RegisterStyle;