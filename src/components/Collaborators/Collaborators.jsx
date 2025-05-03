import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/apiFetch";
import { getImageUrl } from "../../utils/getImageUrl";
import PropTypes from "prop-types";
import "./Collaborators.css";

const Collaborators = ({ playlistId, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [friendsList, setFriendsList] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFriends, setSelectedFriends] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Intentar obtener colaboradores actuales
                const collabResponse = await apiFetch(`/collaborators/${playlistId}/collaborators`, {
                    method: "GET",
                }).catch(() => {
                    console.log("No se pudieron cargar los colaboradores actuales, puede ser una nueva función");
                    return { collaborators: [] };
                });

                // Obtener la lista de amigos para invitar
                const friendsResponse = await apiFetch('/social/getFriendsList', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Filtrar amigos que ya son colaboradores
                const existingCollaboratorIds = collabResponse.collaborators
                    ? collabResponse.collaborators.map(c => c.userId)
                    : [];

                const availableFriends = friendsResponse.friends.filter(
                    friend => !existingCollaboratorIds.includes(friend.friendId)
                );

                setFriendsList(availableFriends || []);
                setCollaborators(collabResponse.collaborators || []);
            } catch (error) {
                console.error("Error al cargar datos:", error);
                setError("No se pudieron cargar los colaboradores o amigos. Intenta más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [playlistId]);

    const handleInviteCollaborators = async () => {
        if (selectedFriends.length === 0) return;

        try {
            console.log("Sending invitations for playlistId:", playlistId);

            const promises = selectedFriends.map(friendId => {
                const requestData = {
                    userId: friendId,
                    playlistId: playlistId
                };

                console.log("Request data for user:", friendId, requestData);

                return apiFetch(`/collaborators/invite`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json"
                    },
                    body: requestData
                });
            });

            await Promise.all(promises);

            alert("¡Invitaciones enviadas con éxito! Los amigos recibirán las invitaciones en sus chats.");
            onClose();
        } catch (error) {
            console.error("Error al invitar colaboradores:", error);
            alert("Hubo un problema al invitar colaboradores. Intenta de nuevo.");
        }
    };

    const getInitialsAndColor = (nickname, id) => {
        if (!nickname) return null;

        const initial = nickname.charAt(0).toUpperCase();

        // Generar un color basado en el ID
        const hue = (parseInt(id, 16) % 360) || Math.floor(Math.random() * 360);
        const bgColor = `hsl(${hue}, 70%, 45%)`;

        return { initial, bgColor };
    };

    const filteredFriends = friendsList.filter(f =>
        f.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="collaborators-popup" onClick={e => e.stopPropagation()}>
                <div className="collaborators-popup-header">
                    <h3>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '10px'}}>
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
                        </svg>
                        Invitar colaboradores
                    </h3>
                </div>

                <div className="collaborators-search-container">
                    <span className="collaborators-search-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar amigo..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="collaborators-edit-input"
                    />
                    {searchTerm && (
                        <button
                            className="collaborators-clear-search"
                            onClick={() => setSearchTerm('')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>

                <div className="collaborators-friends-list">
                    {loading ? (
                        <div className="collaborators-friends-empty">
                            Cargando amigos...
                        </div>
                    ) : error ? (
                        <div className="collaborators-friends-empty">
                            {error}
                        </div>
                    ) : filteredFriends.length > 0 ? (
                        filteredFriends.map(friend => {
                            const avatarInfo = getInitialsAndColor(friend.nickname, friend.friendId);

                            return (
                                <label key={friend.friendId} className="collaborators-friend-item">
                                    {friend.user_picture ? (
                                        <img src={getImageUrl(friend.user_picture)} alt={friend.nickname} className="collaborators-friend-avatar" />
                                    ) : avatarInfo && (
                                        <div className="collaborators-friend-initials" style={{backgroundColor: avatarInfo.bgColor}}>
                                            {avatarInfo.initial}
                                        </div>
                                    )}
                                    <span className="collaborators-friend-name">{friend.nickname}</span>
                                    <input
                                        type="checkbox"
                                        id={`friend-${friend.friendId}`}
                                        checked={selectedFriends.includes(friend.friendId)}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setSelectedFriends(prev => [...prev, friend.friendId]);
                                            } else {
                                                setSelectedFriends(prev => prev.filter(id => id !== friend.friendId));
                                            }
                                        }}
                                        style={{display: 'none'}}
                                    />
                                    {selectedFriends.includes(friend.friendId) ? (
                                        <span className="collaborators-selected-badge">✓</span>
                                    ) : null}
                                </label>
                            );
                        })
                    ) : (
                        <div className="collaborators-friends-empty">
                            {searchTerm ? "No se encontraron amigos con ese nombre" : "No tienes amigos disponibles para invitar"}
                        </div>
                    )}
                </div>

                <div className="collaborators-popup-actions">
                    <button
                        className="collaborators-cancel-btn"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="save-btn"
                        onClick={handleInviteCollaborators}
                        disabled={selectedFriends.length === 0}
                    >
                        Invitar {selectedFriends.length > 0 ? `(${selectedFriends.length})` : ''}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Agregar validación de PropTypes
Collaborators.propTypes = {
    playlistId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export default Collaborators;