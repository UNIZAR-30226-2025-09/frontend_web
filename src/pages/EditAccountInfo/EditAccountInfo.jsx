import { useState, useEffect } from "react";
import { apiFetch } from "#utils/apiFetch";
import "./EditAccountInfo.css";
import Compressor from 'compressorjs';
import {getImageUrl} from "#utils/getImageUrl";
import {useNavigate} from "react-router-dom";

function EditAccountInfo() {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const [nickname, setNickname] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageShow, setProfileImageShow] = useState(null);
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Cargar información del usuario
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await apiFetch(`/user/${userId}`, {
                    method: "GET",
                });
                setUserInfo(data);
                setNickname(data.nickname);
                setProfileImageShow(data.user_picture || null);
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
            }
        };

        fetchUserInfo();
    }, [userId]);

    // Función para manejar el cambio de nombre de usuario
    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    };

    // Función para manejar la actualización del perfil
    const handleSaveChanges = async () => {
        setIsLoading(true);

        try {
            let body = { nickname };

            // Si hay una nueva imagen de perfil, convertirla a base64
            if (profileImage) {
                const base64Image = await convertFileToBase64(profileImage);
                body.profileImage = base64Image;
            }

            // Enviar la solicitud de actualización
            const response = await apiFetch(`/user/users/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
            });

            console.log("Perfil actualizado:", response);

            // Si la respuesta contiene la nueva imagen, actualizarla en la UI
            if (response.user_picture) {
                setProfileImageShow(response.user_picture);
            }

            // Recargar la página para reflejar los cambios
            window.location.reload();
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            alert("Hubo un error al guardar los cambios.");
        } finally {
            setIsLoading(false);
        }
    };

    // Función para convertir el archivo a base64
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        new Compressor(file, {
            quality: 0.6,
            success(result) {
                setProfileImage(result);

                // Mostrar una vista previa de la imagen seleccionada
                const previewUrl = URL.createObjectURL(result);
                setProfileImageShow(previewUrl);
            },
            error(err) {
                console.error("Error al comprimir la imagen", err);
            }
        });
    };

    return (
        <div>
            <div className="header">
                <div className="logo-container">
                    <img
                        src="../vibrablanco.png"
                        alt="Vibra Logo"
                        className="logo"
                        onClick={() => {navigate(`/`)}}
                    />
                    <span className="logo-text">Vibra</span>
                </div>
                <div className="profile-container">
                    <div className="profile-picture">
                        {/* Muestra la imagen del usuario */}
                        <img
                            src={profileImageShow ?
                                (profileImageShow.startsWith('data:') ? profileImageShow : getImageUrl(profileImageShow))
                                : '../default-profile.png'}
                            alt="Foto de perfil"
                            className="profile-img"
                        />
                    </div>
                </div>
            </div>
            <div className="account-info-page">

                <div className="edit-profile-container">
                    <h2>Editar Información de la Cuenta</h2>

                    <div className="form-group">
                        <label htmlFor="nickname">Correo electrónico:</label>
                        {userInfo.mail}
                    </div>

                    <div className="form-group">
                        <label htmlFor="nickname">Nombre de usuario:</label>
                        <label htmlFor="nickname">{ nickname}</label>
                        <input
                            type="text"
                            id="nickname"
                            onChange={handleNicknameChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="profileImage">Foto de perfil:</label>
                        <input
                            type="file"
                            id="profileImage"
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="form-input"
                        />
                    </div>

                    <button
                        onClick={handleSaveChanges}
                        className="save-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditAccountInfo;