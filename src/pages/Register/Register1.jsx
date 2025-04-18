import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register1() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [validations, setValidations] = useState({
        hasLetter: false,
        hasSpecialCharOrNumber: false,
        hasMinLength: false,
    });
    const [isSubmitted, setIsSubmitted] = useState(false); // Estado para saber si se ha presionado "Siguiente"
    const navigate = useNavigate();

    // Validación de la contraseña
    const validatePassword = (password) => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasSpecialCharOrNumber = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~\d]/.test(password); // Un número o carácter especial
        const hasMinLength = password.length >= 10;

        setValidations({
            hasLetter,
            hasSpecialCharOrNumber,
            hasMinLength,
        });

        return { hasLetter, hasSpecialCharOrNumber, hasMinLength };
    };

    // Actualizar contraseña y validaciones en tiempo real
    const handleChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true); // Cuando se presiona "Siguiente", se marca como enviado

        const { hasLetter, hasSpecialCharOrNumber, hasMinLength } = validations;

        // Validar si se cumplen todas las condiciones
        if (hasLetter && hasSpecialCharOrNumber && hasMinLength) {
            const email = localStorage.getItem("email");
            localStorage.setItem("userData", JSON.stringify({ email, password }));
            navigate("/register2"); // Redirige al siguiente paso
        }
    };

    return (
        <div className="login-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div className="login-box" style={{backgroundColor: "#1e1e1e"}}>
                <img
                    src="../vibrablanco.png"
                    alt="Vibra Logo"
                    className="logo"
                    onClick={() => window.location.reload()}
                />
                <div className="progress-bar" style={{
                    width: "100%",
                    height: "5px",
                    backgroundColor: "#333",
                    borderRadius: "2px",
                    marginBottom: "15px"
                }}>
                    <div style={{width: "25%", height: "100%", backgroundColor: "#79e2ff", borderRadius: "2px"}}></div>
                </div>

                <h2 style={{textAlign: "center", width: "100%", marginBottom: "10px", marginLeft: "50px"}}>Paso 1 de 4</h2>


                <h1 className="login-txt" style={{fontSize: "22px"}}>Crea una contraseña</h1>
                <hr className="line"/>
                <form onSubmit={handleSubmit}>
                    <div className="input-label"
                         style={{position: "relative", display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <label htmlFor="password">Contraseña</label>
                        <div style={{position: "relative", width: "80%", display: "flex", alignItems: "center"}}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="globalInput"
                                placeholder="********"
                                value={password}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    paddingRight: "40px",
                                    height: "40px",
                                    borderRadius: "5px",
                                    boxSizing: "border-box",
                                    textAlign: "left",
                                    borderColor: isSubmitted && (!validations.hasLetter || !validations.hasSpecialCharOrNumber || !validations.hasMinLength) ? "red" : "transparent"
                                }}
                            />
                            <span
                                className="password-toggle"
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "30%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    fontSize: "20px"
                                }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </span>
                        </div>
                    </div>

                    <p style={{fontSize: "14px", color: "#fff", textAlign: "left", marginLeft: "20%"}}>
                        La contraseña debe cumplir las siguientes condiciones:
                    </p>

                    <div style={{paddingLeft: 0, marginLeft: 0}}>
                        <div style={{display: "flex", alignItems: "center", margin: "8px 0", paddingLeft: "20%"}}>
                            <input type="checkbox" checked={validations.hasLetter} readOnly/>
                            <span style={{marginLeft: "10px"}}> Contiene al menos una letra</span>
                        </div>
                        <div style={{display: "flex", alignItems: "center", margin: "8px 0", paddingLeft: "20%"}}>
                            <input type="checkbox" checked={validations.hasSpecialCharOrNumber} readOnly/>
                            <span style={{marginLeft: "10px"}}> Contiene un número o carácter especial</span>
                        </div>
                        <div style={{display: "flex", alignItems: "center", margin: "8px 0", paddingLeft: "20%"}}>
                            <input type="checkbox" checked={validations.hasMinLength} readOnly/>
                            <span style={{marginLeft: "10px"}}> Tiene al menos 10 caracteres</span>
                        </div>
                    </div>

                    <button type="submit" className="btn-blue">
                        Siguiente
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register1;