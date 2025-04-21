import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register2.css";

function Register2() {
    const [nickname, setNickname] = useState("");
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [gender, setGender] = useState("");
    const [dateError, setDateError] = useState("");
    const [fieldError, setFieldError] = useState("");
    const [genderError, setGenderError] = useState("");
    const [formCompleted, setFormCompleted] = useState(false);

    const navigate = useNavigate();
    
    // Verificar si el formulario está completo
    useEffect(() => {
        if (nickname && day && month && year && gender) {
            setFormCompleted(true);
        } else {
            setFormCompleted(false);
        }
    }, [nickname, day, month, year, gender]);
    
    function esFechaValida(dia, mes, anio) {
        const diaNum = parseInt(dia, 10);
        const mesNum = parseInt(mes, 10);
        const anioNum = parseInt(anio, 10);
        
        if (isNaN(diaNum) || isNaN(mesNum) || isNaN(anioNum)) return false;
        if (mesNum < 1 || mesNum > 12) return false;
        if (anioNum < 1900 || anioNum > new Date().getFullYear()) return false;

        const fecha = new Date(anioNum, mesNum - 1, diaNum);
        return (
            fecha.getFullYear() === anioNum &&
            fecha.getMonth() === mesNum - 1 &&
            fecha.getDate() === diaNum
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setDateError("");
        setFieldError("");
        setGenderError("");

        if (!nickname || !day || !month || !year || !gender) {
            if (!gender) setGenderError("Por favor, selecciona un género.");
            if (!nickname || !day || !month || !year) {
                setFieldError("Por favor, completa todos los campos requeridos.");
            }
            return;
        }

        const diaNum = parseInt(day, 10);
        const mesNum = parseInt(month, 10);
        const anioNum = parseInt(year, 10);

        if (anioNum < 1900 || anioNum > new Date().getFullYear()) {
            setDateError(`Por favor, introduce un año entre 1900 y ${new Date().getFullYear()}.`);
            return;
        }

        if (isNaN(diaNum) || diaNum < 1 || diaNum > 31) {
            setDateError("Por favor, introduce un día válido (1-31).");
            return;
        }

        if (!esFechaValida(day, month, year)) {
            setDateError("La fecha introducida no es válida.");
            return;
        }

        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        userData.nickname = nickname;
        userData.dob = { day, month, year };
        userData.gender = gender;
        localStorage.setItem("userData", JSON.stringify(userData));
        
        navigate("/register3");
    };

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="auth-bg-shape shape1"></div>
                <div className="auth-bg-shape shape2"></div>
                <div className="auth-bg-shape shape3"></div>
            </div>
            
            <div className="auth-card">
                <div className="auth-header">
                    <div className="logo-container">
                        <img
                            src="../vibrablanco.png"
                            alt="Vibra Logo"
                            className="logo-image"
                            onClick={() => window.location.reload()}
                        />
                    </div>
                </div>
                
                <div className="auth-progress">
                    <div className="progress-track">
                        <div className="progress-step completed">
                            <div className="step-number">1</div>
                            <div className="step-label">Seguridad</div>
                        </div>
                        <div className="progress-connector active"></div>
                        <div className="progress-step active">
                            <div className="step-number">2</div>
                            <div className="step-label">Perfil</div>
                        </div>
                        <div className="progress-connector"></div>
                        <div className="progress-step">
                            <div className="step-number">3</div>
                            <div className="step-label">Preferencias</div>
                        </div>
                        <div className="progress-connector"></div>
                        <div className="progress-step">
                            <div className="step-number">4</div>
                            <div className="step-label">Final</div>
                        </div>
                    </div>
                </div>
                
                <div className="auth-content">
                    <div>
                        <h1 className="auth-title">Háblanos de ti</h1>
                        <p className="auth-subtitle">Esta información nos ayudará a personalizar tu experiencia</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-field">
                            <label htmlFor="nickname" className="field-label">Nickname</label>
                            <input
                                type="text"
                                id="nickname"
                                className="field-input"
                                placeholder="Este nombre aparecerá en tu perfil"
                                value={nickname}
                                onChange={(e) => {
                                    setNickname(e.target.value);
                                    setFieldError("");
                                }}
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-field">
                            <label className="field-label">Fecha de nacimiento</label>
                            <div className="dob-container">
                                <input
                                    type="text"
                                    placeholder="dd"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={2}
                                    className="field-input"
                                    value={day}
                                    onChange={(e) => {
                                        setDay(e.target.value);
                                        setFieldError("");
                                        setDateError("");
                                    }}
                                />
                                <select 
                                    className="field-input"
                                    value={month} 
                                    onChange={(e) => {
                                        setMonth(e.target.value);
                                        setFieldError("");
                                        setDateError("");
                                    }}
                                >
                                    <option value="" disabled>Mes</option>
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
                                    type="text"
                                    placeholder="aaaa"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={4}
                                    className="field-input"
                                    value={year}
                                    onChange={(e) => {
                                        setYear(e.target.value);
                                        setFieldError("");
                                        setDateError("");
                                    }}
                                />
                            </div>
                            
                            {dateError && (
                                <div className="error-message">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                    <span>{dateError}</span>
                                </div>
                            )}
                        </div>

                        <div className="form-field">
                            <label className="field-label">Género</label>
                            <div className="gender-row">
                                <label>
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        value="hombre" 
                                        onChange={(e) => {
                                            setGender(e.target.value);
                                            setGenderError("");
                                            setFieldError("");
                                        }}
                                    /> 
                                    Hombre
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        value="mujer" 
                                        onChange={(e) => {
                                            setGender(e.target.value);
                                            setGenderError("");
                                            setFieldError("");
                                        }}
                                    /> 
                                    Mujer
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        value="no-binario" 
                                        onChange={(e) => {
                                            setGender(e.target.value);
                                            setGenderError("");
                                            setFieldError("");
                                        }}
                                    /> 
                                    No binario
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        value="prefiero-no-decirlo" 
                                        onChange={(e) => {
                                            setGender(e.target.value);
                                            setGenderError("");
                                            setFieldError("");
                                        }}
                                    /> 
                                    Prefiero no decirlo
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        value="otro" 
                                        onChange={(e) => {
                                            setGender(e.target.value);
                                            setGenderError("");
                                            setFieldError("");
                                        }}
                                    /> 
                                    Otro
                                </label>
                            </div>
                            
                            {genderError && (
                                <div className="error-message">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                    <span>{genderError}</span>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="submit-button" 
                            disabled={!formCompleted}
                        >
                            <span className="button-text">Continuar</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="button-icon">
                                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                            </svg>
                        </button>
                        
                        {fieldError && (
                            <div className="error-message" style={{justifyContent: "center", marginTop: "16px"}}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                                <span>{fieldError}</span>
                            </div>
                        )}
                    </form>
                    
                    <div className="security-info">
                        <div className="security-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h5.24c.25.31.48.65.68 1H13V7zm0 3h6.74c.08.33.15.66.19 1H13v-1zm0 9.93V19h2.87c-.87.48-1.84.8-2.87.93zM18.24 17H13v-1h5.92c-.2.35-.43.69-.68 1zm1.5-3H13v-1h6.93c-.04.34-.11.67-.19 1z"/>
                            </svg>
                        </div>
                        <div className="security-message">
                            Tu perfil está protegido y tus datos están seguros con nosotros.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register2;