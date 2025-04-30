import React, { useState, useEffect } from "react";
import { apiFetch } from "#utils/apiFetch";

const Collaborators = ({ playlistId, onClose }) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingInvite, setLoadingInvite] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchFriendsAndCollaborators = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                // Get friends list
                const friendsResponse = await apiFetch("/social/getFriendsList", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                // Get current collaborators
                const collaboratorsResponse = await apiFetch(`/collaborators/${playlistId}/collaborators`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                console.log("Amigos obtenidos:", friendsResponse.friends || []);
                console.log("Colaboradores actuales:", collaboratorsResponse || []);

                const allFriends = friendsResponse.friends || [];
                const currentCollaborators = collaboratorsResponse || [];

                // Filter out friends who are already collaborators
                const availableFriends = allFriends.filter(friend =>
                    !currentCollaborators.some(collab => collab.user_id === friend.friendId)
                );

                setFriends(availableFriends);
            } catch (error) {
                console.error("Error al obtener la lista de amigos o colaboradores:", error);
                setErrorMessage("Error al cargar amigos. Inténtalo de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        fetchFriendsAndCollaborators();
    }, [playlistId]);

    const inviteFriend = async (friendId) => {
        try {
            setLoadingInvite(true);
            const token = localStorage.getItem("token");

            console.log("Enviando invitación con datos:", {
                playlistId,
                userId: friendId
            });

            const response = await apiFetch("/collaborators/invite", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: {
                    playlistId,
                    userId: friendId
                },
            });

            console.log("Respuesta invitación:", response);

            if (response && response.message) {
                // Mostrar mensaje de éxito
                setSuccessMessage(`Amigo invitado como colaborador.`);
                // Remover el amigo de la lista para no mostrar amigos ya invitados
                setFriends(prev => prev.filter(friend => friend.friendId !== friendId));
                // Limpia el mensaje después de 3 segundos
                setTimeout(() => setSuccessMessage(""), 3000);
            } else if (response && response.error) {
                console.error("Error al invitar colaborador:", response.error);
                setErrorMessage(`No se pudo invitar al amigo como colaborador: ${response.error}`);
                setTimeout(() => setErrorMessage(""), 3000);
            }
        } catch (error) {
            console.error("Error al invitar colaborador:", error);
            setErrorMessage("Error al invitar al amigo como colaborador.");
            setTimeout(() => setErrorMessage(""), 3000);
        } finally {
            setLoadingInvite(false);
        }
    };

    // Filter friends based on search term
    const filteredFriends = friends.filter(friend =>
        friend.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Invitar Amigos como Colaboradores</h2>

                {/* Mensajes de éxito o error */}
                {successMessage && (
                    <div className="success-message">{successMessage}</div>
                )}
                {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                )}

                {/* Buscador de amigos */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar amigos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <ul className="friends-list">
                        {filteredFriends.length > 0 ? (
                            filteredFriends.map((friend) => (
                                <li key={friend.friendId} className="friend-item">
                                    <img
                                        src={friend.user_picture || "/default-avatar.jpg"}
                                        alt={friend.nickname}
                                        className="friend-avatar"
                                        onError={(e) => {e.target.src = "/default-avatar.jpg"}}
                                    />
                                    <span>{friend.nickname}</span>
                                    <button
                                        className="invite-btn"
                                        onClick={() => inviteFriend(friend.friendId)}
                                        disabled={loadingInvite}
                                    >
                                        {loadingInvite ? "Enviando..." : "Invitar"}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p>
                                {searchTerm
                                    ? "No se encontraron amigos con ese nombre"
                                    : "No tienes amigos en tu lista o todos ya son colaboradores."}
                            </p>
                        )}
                    </ul>
                )}

                <button className="close-btn" onClick={onClose} disabled={loading}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default Collaborators;