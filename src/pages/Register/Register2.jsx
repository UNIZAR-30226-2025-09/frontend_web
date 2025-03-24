import { useState } from "react";
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

    const navigate = useNavigate();

    function esFechaValida(dia, mes, anio) {
        const diaNum = parseInt(dia, 10);
        const mesNum = parseInt(mes, 10);
        const anioNum = parseInt(anio, 10);
        const diaInput = document.querySelector('input[placeholder="dd"]');
        if (isNaN(diaNum) || diaNum < 1 || diaNum > 31) {
            diaInput.setCustomValidity("Día inválido");
            diaInput.reportValidity();
            return;
        } else {
            diaInput.setCustomValidity("");
        }


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

        const diaInput = document.querySelector('input[placeholder="dd"]');
        const anioInput = document.querySelector('input[placeholder="aaaa"]');

        // Limpiar validaciones anteriores
        diaInput.setCustomValidity("");
        anioInput.setCustomValidity("");

        const diaNum = parseInt(day, 10);
        const mesNum = parseInt(month, 10);
        const anioNum = parseInt(year, 10);

        // Validar campos vacíos
        if (!nickname || !day || !month || !year || !gender) {
            if (!day) {
                diaInput.setCustomValidity("Por favor, introduce un día.");
                diaInput.reportValidity();
            } else if (!year) {
                anioInput.setCustomValidity("Por favor, introduce un año.");
                anioInput.reportValidity();
            }
            return;
        }

        // Validar día
        if (isNaN(diaNum) || diaNum < 1 || diaNum > 31) {
            diaInput.setCustomValidity("Día inválido");
            diaInput.reportValidity();
            return;
        }


        // Validar año
        if (isNaN(anioNum) || anioNum < 1900 || anioNum > new Date().getFullYear()) {
            anioInput.setCustomValidity("Año inválido");
            anioInput.reportValidity();
            return;
        }

        // Validar fecha real (ej: no 31 de febrero)
        const fecha = new Date(anioNum, mesNum - 1, diaNum);
        if (
            fecha.getFullYear() !== anioNum ||
            fecha.getMonth() !== mesNum - 1 ||
            fecha.getDate() !== diaNum
        ) {
            diaInput.setCustomValidity("La fecha no es válida");
            diaInput.reportValidity();
            return;
        }

        // Guardar datos
        const userData = JSON.parse(localStorage.getItem("userData"));
        userData.nickname = nickname;
        userData.dob = { day, month, year };
        userData.gender = gender;
        localStorage.setItem("userData", JSON.stringify(userData));
        navigate("/register3");
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
                <div className="register2-progress-bar">
                    <div className="register2-progress" style={{width: "66%"}}></div>
                </div>

                <h2 style={{textAlign: "center", width: "100%", marginBottom: "10px", marginLeft: "50px"}}>Paso 2 de 3</h2>
                <h1 className="register2-main-title">Háblanos de ti</h1>
                <hr className="register2-line"/>

                <form onSubmit={handleSubmit}>
                    <div className="register2-input-label">
                        <label htmlFor="nickname">Nickname</label>
                        <input
                            type="text"
                            id="nickname"
                            className="register2-globalInput"
                            placeholder="Este nombre aparecerá en tu perfil"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                    </div>

                    <div className="register2-input-label">
                        <label>Fecha de nacimiento</label>
                        <div className="register2-dob-container">
                            <input
                                type="text"
                                placeholder="dd"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={2}
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                required
                            />
                            <select value={month} onChange={(e) => setMonth(e.target.value)} required>
                                <option value="" disabled selected hidden>Mes</option>
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
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                            />
                        </div>

                    </div>

                    <div className="register2-input-label">
                        <label>Género</label>
                        <div className="register2-gender-options">
                            <label><input type="radio" name="gender" value="hombre"/> Hombre</label>
                            <label><input type="radio" name="gender" value="mujer"/> Mujer</label>
                            <label><input type="radio" name="gender" value="no-binario"/> No binario</label>
                            <label><input type="radio" name="gender" value="prefiero-no-decirlo"/> Prefiero no
                                decirlo</label>
                            <label><input type="radio" name="gender" value="otro"/> Otro</label>

                        </div>
                    </div>

                    <button type="submit" className="btn-blue">Siguiente</button>
                    {fieldError && <p style={{color: "#ff6b6b", marginTop: "10px"}}>{fieldError}</p>}
                    {dateError && <p style={{color: "#ff6b6b", marginTop: "5px"}}>{dateError}</p>}

                </form>
            </div>
        </div>
    );
}

export default Register2;