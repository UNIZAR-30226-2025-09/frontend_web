import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register2.css"; // Estilos específicos

function Register2() {
    const [name, setName] = useState("");
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [gender, setGender] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !day || !month || !year || !gender) {
            alert("Por favor, completa todos los campos.");
            return;
        }
        navigate("/register3"); // Redirige al siguiente paso
    };

    return (
        <div className="register2-container">
            <div className="register2-box">
                <img
                    src="../vibrablanco.png"
                    alt="Vibra Logo"
                    className="register2-logo"
                    onClick={() => window.location.reload()}
                />

                {/* Barra de progreso */}
                <div className="register2-progress-bar">
                    <div className="register2-progress" style={{ width: "66%" }}></div>
                </div>

                <h2 className="register2-step-title">Paso 2 de 3</h2>
                <h1 className="register2-main-title">Háblanos de ti</h1>
                <hr className="register2-line" />

                <form onSubmit={handleSubmit}>
                    {/* Campo de nombre */}
                    <div className="register2-input-label">
                        <label htmlFor="name">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            className="register2-globalInput"
                            placeholder="Este nombre aparecerá en tu perfil"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Fecha de nacimiento */}
                    <div className="register2-input-label">
                        <label>Fecha de nacimiento</label>
                        <div className="register2-dob-container">
                            <input
                                type="number"
                                placeholder="dd"
                                min="1"
                                max="31"
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                required
                            />
                            <select value={month} onChange={(e) => setMonth(e.target.value)} required>
                                <option value="">Mes</option>
                                <option value="1">Enero</option>
                                <option value="2">Febrero</option>
                                <option value="3">Marzo</option>
                                <option value="4">Abril</option>
                                <option value="5">Mayo</option>
                                <option value="6">Junio</option>
                                <option value="7">Julio</option>
                                <option value="8">Agosto</option>
                                <option value="9">Septiembre</option>
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                            </select>
                            <input
                                type="number"
                                placeholder="aaaa"
                                min="1900"
                                max="2024"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Género (Solo Hombre y Mujer) */}
                    <div className="register2-input-label">
                        <label>Género</label>
                        <div className="register2-gender-options">
                            <label><input type="radio" name="gender" value="Hombre" onChange={() => setGender("Hombre")} required /> Hombre</label>
                            <label><input type="radio" name="gender" value="Mujer" onChange={() => setGender("Mujer")} required /> Mujer</label>
                        </div>
                    </div>

                    <button type="submit" className="register2-btn-next">Siguiente</button>
                </form>
            </div>
        </div>
    );
}

export default Register2;
