import { useState, useEffect } from "react";
import { apiFetch } from "#utils/apiFetch";
import "./EditAccountInfo.css";
import Compressor from 'compressorjs';
import {getImageUrl} from "#utils/getImageUrl";

function EditAccountInfo() {
    const userId = JSON.parse(localStorage.getItem('user')).id;

    const [nickname, setNickname] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageShow, setProfileImageShow] = useState(null);
    const [userInfo, setUserInfo] = useState({});

    // Cargar información del usuario
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await apiFetch(`/user/${userId}`, {
                    method: "GET",
                });
                setUserInfo(data);
                setNickname(data.nickname);
                console.log("path: ", data.user_picture);
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
        const reader = new FileReader();

        console.log(profileImage);

        if(profileImage){
            reader.onloadend = async () => {
                const base64Image = reader.result;
                console.log("base 64", base64Image);

                const body = {
                    nickname: nickname,
                    profileImage: base64Image,
                };

                console.log("Cuerpo", body);

                try {
                    const response = await apiFetch(`/user/users/${userId}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: { nickname: body.nickname, profileImage: body.profileImage },
                    });

                    console.log("Perfil actualizado:", response);
                    alert("Los cambios se han guardado correctamente.");
                } catch (error) {
                    console.error("Error al actualizar el perfil:", error);
                    alert("Hubo un error al guardar los cambios.");
                }
            };

            reader.readAsDataURL(profileImage);
        }
        else{
            const response = await apiFetch(`/user/users/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: { nickname: nickname },
            });

            console.log("Perfil actualizado:", response);
            alert("Los cambios se han guardado correctamente.");
            window.location.reload();
        }
    };
    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        new Compressor(file, {
            quality: 0.6,
            success(result) {

                setProfileImage(result);
                console.log("Imagen comprimida:", result);
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
                        onClick={() => window.location.reload()}
                    />
                    <span className="logo-text">Vibra</span>
                </div>
                <div className="profile-container">
                    <div className="profile-picture">
                        {/* Muestra la imagen del usuario */}
                        <img
                            src={getImageUrl(profileImageShow)}
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
                        <input
                            type="text"
                            id="nickname"
                            value={nickname}
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

                    <button onClick={handleSaveChanges} className="save-btn">Guardar cambios</button>
                </div>
            </div>
        </div>
    );
}

export default EditAccountInfo;
