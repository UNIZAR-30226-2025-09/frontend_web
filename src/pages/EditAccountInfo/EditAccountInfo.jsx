// Importa el icono adicional para la cruz
import { useState, useEffect } from "react";
import { apiFetch } from "#utils/apiFetch";
import "./EditAccountInfo.css";
import Compressor from 'compressorjs';
import { getImageUrl } from "#utils/getImageUrl";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; // Importamos el icono de cruz

function EditAccountInfo() {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const [nickname, setNickname] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageShow, setProfileImageShow] = useState(null);
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [imageChanged, setImageChanged] = useState(false); // Para rastrear si la imagen fue cambiada
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
            } else if (imageChanged && !profileImage) {
                // Si la imagen fue eliminada
                body.profileImage = null;
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

            // Mostrar mensaje de éxito
            alert("¡Cambios guardados correctamente!");
            
            // Navegar a la página de cuenta
            navigate("/account");
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

    // Actualiza la función handleImageUpload para corregir la vista previa
    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        // Crear y mostrar la vista previa inmediatamente
        const tempPreviewUrl = URL.createObjectURL(file);
        setProfileImageShow(tempPreviewUrl);
        setImageChanged(true);

        // Comprimir la imagen para el envío
        new Compressor(file, {
            quality: 0.6,
            success(result) {
                setProfileImage(result);
            },
            error(err) {
                console.error("Error al comprimir la imagen", err);
            }
        });
    };

    // Nueva función para eliminar la imagen seleccionada
    const handleRemoveImage = () => {
        setProfileImage(null);
        setProfileImageShow(null);
        setImageChanged(true);
        
        // Resetear el input de archivo
        const fileInput = document.getElementById('profileImage');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    // Función para generar un avatar con iniciales cuando no hay imagen (copiada de AccountInfo)
    const generateAvatarColor = (name) => {
        if (!name) return { background: "#4f74ff", initial: "U" };
        
        // Generar un color basado en el nombre
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Lista de colores vibrantes para los avatares
        const colors = [
            "#FF5722", "#E91E63", "#9C27B0", "#673AB7", 
            "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", 
            "#009688", "#4CAF50", "#8BC34A", "#CDDC39", 
            "#FFC107", "#FF9800", "#795548", "#607D8B"
        ];
        
        const colorIndex = Math.abs(hash) % colors.length;
        const background = colors[colorIndex];
        
        // Obtener la inicial en mayúscula
        const initial = name.charAt(0).toUpperCase();
        
        return { background, initial };
    };

    // Renderizar el avatar basado en si hay imagen de perfil o no
    const renderAvatar = () => {
        if (profileImageShow) {
            return (
                <img
                    src={profileImageShow.startsWith('data:') ? profileImageShow : getImageUrl(profileImageShow)}
                    alt="Foto de perfil"
                    className="profile-img"
                />
            );
        } else {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const name = storedUser?.name || storedUser?.nickname || 'Usuario';
            const { background, initial } = generateAvatarColor(name);
            
            return (
                <div className="avatar-initial" style={{ background }}>
                    {initial}
                </div>
            );
        }
    };

    return (
        <>
            <div className="header">
                <div className="logo-account-container" onClick={() => { navigate(`/`) }}>
                    <img
                        src="/vibrablanco.png"
                        alt="Vibra Logo"
                        className="logo-account"
                        style={{ 
                            height: "48px",
                            width: "48px",
                            background: 'rgba(30, 40, 60, 0.9)',
                            borderRadius: '50%',
                            padding: '8px'
                        }}
                    />
                    <span className="logo-text">Vibra</span>
                </div>
                <div className="profile-container">
                    <div className="profile-picture">
                        {renderAvatar()}
                    </div>
                </div>
            </div>
            <div className="account-info-page">
                <div className="edit-profile-container">
                    <h2>Editar perfil</h2>

                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <div className="email-display">{userInfo.mail}</div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="nickname">Nombre de usuario actual</label>
                        <span className="current-username">{userInfo.nickname}</span>
                        <label htmlFor="new-nickname">Nuevo nombre de usuario</label>
                        <input
                            type="text"
                            id="new-nickname"
                            value={nickname}
                            onChange={handleNicknameChange}
                            className="form-input"
                            placeholder="Introduce un nuevo nombre de usuario"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="profileImage">Foto de perfil</label>
                        <input
                            type="file"
                            id="profileImage"
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="form-input"
                        />
                        
                        {/* Vista previa de la imagen con botón para eliminar */}
                        {profileImageShow && (
                            <div className="profile-preview">
                                <div className="profile-preview-container">
                                    <img
                                        src={profileImageShow.startsWith('data:') || profileImageShow.startsWith('blob:') 
                                            ? profileImageShow 
                                            : getImageUrl(profileImageShow)}
                                        alt="Vista previa"
                                        className="profile-preview-img"
                                        style={{ 
                                            width: '150px', 
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                            border: '2px solid #4f74ff'
                                        }}
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="remove-image-btn"
                                        title="Eliminar imagen"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                        )}
                        {!profileImageShow && (
                            <div className="profile-preview">
                                <div className="profile-preview-img" style={{ 
                                    display: 'flex',
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    background: generateAvatarColor(userInfo.nickname).background,
                                    fontSize: '48px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%'
                                }}>
                                    {userInfo.nickname ? userInfo.nickname.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                            className="back-button"
                            onClick={() => navigate("/account")}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                            </svg>
                            Volver
                        </button>
                        
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
        </>
    );
}

export default EditAccountInfo;