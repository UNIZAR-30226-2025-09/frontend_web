import { useState, useEffect } from "react";
import { apiFetch } from "#utils/apiFetch";
import { getImageUrl } from "../../utils/getImageUrl";
import PropTypes from "prop-types";
import "./Collaborators.css";

const Collaborators = ({ playlistId, onClose, isOwner = false }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [friendsList, setFriendsList] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [pendingInvitations, setPendingInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [actualIsOwner, setActualIsOwner] = useState(isOwner);
    const [selectedCollaborators, setSelectedCollaborators] = useState([]);
    const [activeTab, setActiveTab] = useState("view"); // "view", "invite", "remove"
    const [playlistOwnerId, setPlaylistOwnerId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            console.log("[Collaborators.jsx][fetchData] Starting data fetch for playlist:", playlistId);

            const token = localStorage.getItem('token');
            if (!token) {
                const authError = "No estás autenticado. Por favor, inicia sesión.";
                console.error("[Collaborators.jsx][fetchData] Error:", authError);
                setError(authError);
                setLoading(false);
                return;
            }

            const parsedToken = token.split('.')[1];
            if (!parsedToken) {
                console.error("[Collaborators.jsx][fetchData] No valid token payload found.");
                setError("Token inválido. Por favor, inicia sesión nuevamente.");
                setLoading(false);
                return;
            }

            const tokenPayload = JSON.parse(atob(parsedToken));
            const currentUserId = tokenPayload.id;
            console.log("[Collaborators.jsx][fetchData] Current User ID:", currentUserId);

            // 1. Verificar propietario
            const playlistResponse = await apiFetch(`/playlists/${playlistId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });

            const userIsOwner = playlistResponse.user_id === currentUserId;
            setPlaylistOwnerId(playlistResponse.user_id);
            console.log("[Collaborators.jsx][fetchData] Is user owner?",
                { userId: currentUserId, playlistOwnerId: playlistResponse.user_id, isOwner: userIsOwner });
            setActualIsOwner(userIsOwner);

            // 2. Obtener colaboradores
            const collabResponse = await apiFetch(`/collaborators/${playlistId}/collaborators`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });

            const currentCollaborators = collabResponse.collaborators || [];
            console.log("[Collaborators.jsx][fetchData] Current collaborators:",
                { count: currentCollaborators.length, collaborators: currentCollaborators });
            setCollaborators(currentCollaborators);

            if (userIsOwner) {
                // 3. Obtener invitaciones pendientes
                const pendingInvitesResponse = await apiFetch(`/collaborators/${playlistId}/pending-invitations`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                });

                const pendingInvitationsData = pendingInvitesResponse?.pendingInvitations || [];
                console.log("[Collaborators.jsx][fetchData] Pending invitations:",
                    { count: pendingInvitationsData.length, invitations: pendingInvitationsData });
                setPendingInvitations(pendingInvitationsData);

                // 4. Obtener y filtrar amigos
                const friendsResponse = await apiFetch('/social/getFriendsList', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (friendsResponse?.friends) {
                    // Importante: Asegurar que se filtren correctamente los colaboradores existentes
                    const existingCollaboratorIds = new Set(
                        currentCollaborators.map(c => Number(c.userId || (c.User && c.User.id)))
                    );

                    const pendingInvitationIds = new Set(
                        pendingInvitationsData
                            .map(invite => Number(invite.userId || invite.user_id))
                            .filter(Boolean)
                    );

                    console.log("[Collaborators.jsx][fetchData] Filtering friends...", {
                        totalFriends: friendsResponse.friends.length,
                        existingCollaborators: Array.from(existingCollaboratorIds),
                        pendingInvites: Array.from(pendingInvitationIds)
                    });

                    const availableFriends = friendsResponse.friends.filter(friend => {
                        if (!friend?.friendId) {
                            console.warn("[Collaborators.jsx][fetchData] Friend without ID:", friend);
                            return false;
                        }

                        const friendId = Number(friend.friendId);
                        const isCurrentUser = friendId === Number(currentUserId);
                        const isCollaborator = existingCollaboratorIds.has(friendId);
                        const hasPendingInvite = pendingInvitationIds.has(friendId);

                        if (isCurrentUser || isCollaborator || hasPendingInvite) {
                            console.log("[Collaborators.jsx][fetchData] Friend filtered out:", {
                                friendId,
                                nickname: friend.nickname,
                                isCurrentUser,
                                isCollaborator,
                                hasPendingInvite
                            });
                        }

                        return !isCurrentUser && !isCollaborator && !hasPendingInvite;
                    });

                    console.log("[Collaborators.jsx][fetchData] Available friends after filtering:",
                        { count: availableFriends.length, friends: availableFriends });
                    setFriendsList(availableFriends);
                }
            }

            setLoading(false);
        };

        fetchData().catch(error => {
            console.error("[Collaborators.jsx][fetchData] Error general:", error);
            setError("No se pudieron cargar los colaboradores o amigos. Intenta más tarde.");
            setLoading(false);
        });
    }, [playlistId]);

    const refreshData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            // Actualizar colaboradores
            const collabResponse = await apiFetch(`/collaborators/${playlistId}/collaborators`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });
            setCollaborators(collabResponse.collaborators || []);

            // Actualizar invitaciones pendientes
            const pendingInvitesResponse = await apiFetch(`/collaborators/${playlistId}/pending-invitations`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingInvitations(pendingInvitesResponse?.pendingInvitations || []);

            // Refrescar lista de amigos disponibles
            const friendsResponse = await apiFetch('/social/getFriendsList', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (friendsResponse?.friends) {
                const existingCollaboratorIds = new Set(
                    collabResponse.collaborators.map(c => Number(c.userId || (c.User && c.User.id)))
                );

                const pendingInvitationIds = new Set(
                    pendingInvitesResponse?.pendingInvitations
                        .map(invite => Number(invite.userId || invite.user_id))
                        .filter(Boolean)
                );

                const parsedToken = token.split('.')[1];
                const tokenPayload = JSON.parse(atob(parsedToken));
                const currentUserId = tokenPayload.id;

                const availableFriends = friendsResponse.friends.filter(friend => {
                    if (!friend?.friendId) return false;

                    const friendId = Number(friend.friendId);
                    const isCurrentUser = friendId === Number(currentUserId);
                    const isCollaborator = existingCollaboratorIds.has(friendId);
                    const hasPendingInvite = pendingInvitationIds.has(friendId);

                    return !isCurrentUser && !isCollaborator && !hasPendingInvite;
                });

                setFriendsList(availableFriends);
            }
        } catch (error) {
            console.error("[Collaborators.jsx][refreshData] Error refreshing data:", error);
            setError("Error al actualizar los datos");
        }

        setLoading(false);
    };

    const handleInviteCollaborators = async () => {
        if (selectedFriends.length === 0) return;

        const token = localStorage.getItem('token');
        console.log("[Collaborators.jsx][handleInvite] Starting invitation process for friends:", selectedFriends);

        // Verificar una vez más que los amigos seleccionados no sean ya colaboradores
        const currentCollaboratorIds = new Set(
            collaborators.map(c => Number(c.userId || (c.User && c.User.id)))
        );

        // Y tampoco tengan invitaciones pendientes
        const currentPendingIds = new Set(
            pendingInvitations.map(invite => Number(invite.userId || invite.user_id))
        );

        const validFriendsToInvite = selectedFriends.filter(friendId => {
            const alreadyCollaborator = currentCollaboratorIds.has(Number(friendId));
            const isAlreadyPending = currentPendingIds.has(Number(friendId));

            if (alreadyCollaborator) {
                console.warn("[Collaborators.jsx][handleInvite] Friend is already a collaborator:", friendId);
                return false;
            }

            if (isAlreadyPending) {
                console.warn("[Collaborators.jsx][handleInvite] Friend already has pending invite:", friendId);
                return false;
            }

            return true;
        });

        if (validFriendsToInvite.length === 0) {
            console.warn("[Collaborators.jsx][handleInvite] No valid friends to invite");
            alert("Los amigos seleccionados ya son colaboradores o tienen invitaciones pendientes.");
            return;
        }

        console.log("[Collaborators.jsx][handleInvite] Sending invites for friends:", validFriendsToInvite);

        const promises = validFriendsToInvite.map(friendId => {
            const requestData = {
                userId: friendId,
                playlistId: playlistId
            };

            return apiFetch(`/collaborators/invite`, {
                method: "POST",
                body: requestData,
                headers: { Authorization: `Bearer ${token}` }
            });
        });

        const results = await Promise.all(promises);
        console.log("[Collaborators.jsx][handleInvite] Invitation results:", results);

        alert("¡Invitaciones enviadas con éxito! Los amigos recibirán las invitaciones en sus chats.");

        // Refrescar los datos completos
        await refreshData();

        // Resetear la selección y volver a la vista principal
        setSelectedFriends([]);
        setActiveTab("view");
    };

    const handleRemoveCollaborators = async () => {
        if (selectedCollaborators.length === 0) return;

        const token = localStorage.getItem('token');
        console.log("[Collaborators.jsx][handleRemove] Attempting to remove collaborators:", {
            selectedCollaborators,
            playlistId
        });


        if (!actualIsOwner) {
            console.warn("[Collaborators.jsx][handleRemove] Non-owner attempted to remove collaborators");
            return;
        }

        if (!token) {
            console.error("[Collaborators.jsx][handleRemove] No token found");
            setError("No estás autenticado. Por favor, inicia sesión.");
            return;
        }

        try {
            const promises = selectedCollaborators.map(collaboratorId => {
                // Estructura similar a /collaborators/invite
                return apiFetch(`/collaborators/remove`, {  // <-- Misma estructura que la invitación
                    method: "DELETE",
                    body: {
                        userId: collaboratorId,
                        playlistId: playlistId  // <-- Mismo formato de datos que la invitación
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            });

            await Promise.all(promises);

            console.log("[Collaborators.jsx][handleRemove] Successfully removed collaborators");

            // Actualizar la lista de colaboradores
            setCollaborators(prevCollaborators =>
                prevCollaborators.filter(collab => !selectedCollaborators.includes(collab.userId))
            );

            // Mostrar mensaje de éxito
            alert(`${selectedCollaborators.length} colaborador(es) han sido eliminados.`);

            // Refrescar datos completos (igual que en invitar)
            await refreshData();

            // Resetear la selección y volver a la vista principal
            setSelectedCollaborators([]);
            setActiveTab("view");

        } catch (error) {
            console.error("[Collaborators.jsx][handleRemove] Error removing collaborators:", error);
            alert("No se pudieron eliminar los colaboradores. Intenta de nuevo.");
        }
    };

    const getInitialsAndColor = (nickname, id) => {
        if (!nickname) return null;

        const initial = nickname.charAt(0).toUpperCase();
        const hue = (parseInt(id, 16) % 360) || Math.floor(Math.random() * 360);
        const bgColor = `hsl(${hue}, 70%, 45%)`;

        return { initial, bgColor };
    };

    const filteredFriends = friendsList.filter(f =>
        f.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderCollaboratorsList = (forSelection = false) => {
        console.log("[renderCollaboratorsList] Debug info:", {
            collaboratorsTotal: collaborators.length,
            playlistOwnerId: playlistOwnerId,
            forSelection: forSelection
        });

        const filteredCollaborators = forSelection
            ? collaborators.filter(collab => {
                const userId = collab.userId || (collab.User && collab.User.id);
                const ownerId = playlistOwnerId;

                // Añadimos log para depurar
                console.log("[renderCollaboratorsList] Filtering collaborator:", {
                    userId,
                    ownerId,
                    isOwner: Number(userId) === Number(ownerId),
                    shouldShow: userId && Number(userId) !== Number(ownerId)
                });

                return userId && Number(userId) !== Number(ownerId);
            })
            : collaborators;

        console.log("[renderCollaboratorsList] After filtering:", {
            filteredCount: filteredCollaborators.length,
            filteredIds: filteredCollaborators.map(c => c.userId || (c.User && c.User.id))
        });

        return (
            <div className="collaborators-friends-list">
                {loading ? (
                    <div className="collaborators-friends-empty">
                        Cargando colaboradores...
                    </div>
                ) : error ? (
                    <div className="collaborators-friends-empty">
                        {error}
                    </div>
                    // Usar filteredCollaborators en vez de collaborators
                ) : filteredCollaborators.length > 0 ? (
                    filteredCollaborators.map(collab => {
                        const user = collab.User;
                        if (!user) {
                            console.warn("[Collaborators.jsx] Colaborador sin datos de usuario:", collab);
                            return null;
                        }

                        const avatarInfo = getInitialsAndColor(user.nickname, user.id);

                        return forSelection ? (
                            <label key={user.id} className="collaborators-friend-item">
                                {user.user_picture ? (
                                    <img src={getImageUrl(user.user_picture)} alt={user.nickname} className="collaborators-friend-avatar" />
                                ) : avatarInfo && (
                                    <div className="collaborators-friend-initials" style={{ backgroundColor: avatarInfo.bgColor }}>
                                        {avatarInfo.initial}
                                    </div>
                                )}
                                <span className="collaborators-friend-name">{user.nickname}</span>
                                <input
                                    type="checkbox"
                                    id={`collab-${user.id}`}
                                    checked={selectedCollaborators.includes(user.id)}
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setSelectedCollaborators(prev => [...prev, user.id]);
                                        } else {
                                            setSelectedCollaborators(prev => prev.filter(id => id !== user.id));
                                        }
                                    }}
                                    style={{ display: 'none' }}
                                />
                                {selectedCollaborators.includes(user.id) ? (
                                    <span className="collaborators-selected-badge">✓</span>
                                ) : null}
                            </label>
                        ) : (
                            <div key={user.id} className="collaborators-friend-item">
                                {user.user_picture ? (
                                    <img src={getImageUrl(user.user_picture)} alt={user.nickname} className="collaborators-friend-avatar" />
                                ) : avatarInfo && (
                                    <div className="collaborators-friend-initials" style={{ backgroundColor: avatarInfo.bgColor }}>
                                        {avatarInfo.initial}
                                    </div>
                                )}
                                <span className="collaborators-friend-name">{user.nickname}</span>
                            </div>
                        );
                    })
                ) : (
                    <div className="collaborators-friends-empty">
                        No hay colaboradores en esta playlist
                    </div>
                )}
            </div>
        );
    };

    const renderFriendsList = () => (
        <>
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
                                    <div className="collaborators-friend-initials" style={{ backgroundColor: avatarInfo.bgColor }}>
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
                                    style={{ display: 'none' }}
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
        </>
    );

    const getTabContent = () => {
        switch (activeTab) {
            case "invite":
                return (
                    <>
                        <h4>Selecciona amigos para invitar</h4>
                        {renderFriendsList()}
                    </>
                );
            case "remove":
                return (
                    <>
                        <h4>Selecciona colaboradores para eliminar</h4>
                        {renderCollaboratorsList(true)}
                    </>
                );
            default: // "view"
                return (
                    <>
                        <h4>Colaboradores actuales</h4>
                        {renderCollaboratorsList(false)}
                    </>
                );
        }
    };

    const getActionButtons = () => {
        // Si no es propietario, solo muestra el botón de cerrar
        if (!actualIsOwner) {
            return (
                <button className="collaborators-cancel-btn" onClick={onClose}>
                    Cerrar
                </button>
            );
        }

        // Botones para propietarios según el tab activo
        switch (activeTab) {
            case "invite":
                return (
                    <>
                        <button
                            className="collaborators-cancel-btn"
                            onClick={() => {
                                setSelectedFriends([]);
                                setActiveTab("view");
                            }}
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
                    </>
                );
            case "remove":
                return (
                    <>
                        <button
                            className="collaborators-cancel-btn"
                            onClick={() => {
                                setSelectedCollaborators([]);
                                setActiveTab("view");
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            className="save-btn"
                            onClick={handleRemoveCollaborators}
                            disabled={selectedCollaborators.length === 0}
                        >
                            Eliminar {selectedCollaborators.length > 0 ? `(${selectedCollaborators.length})` : ''}
                        </button>
                    </>
                );
            default: // "view"
                return (
                    <>
                        <button className="collaborators-cancel-btn" onClick={onClose}>
                            Cerrar
                        </button>

                        {actualIsOwner && (
                            <div className="collaborators-action-group">
                                {friendsList.length > 0 && (
                                    <button
                                        className="save-btn"
                                        onClick={() => setActiveTab("invite")}
                                    >
                                        <svg className="collaborators-icon-sm" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
                                        </svg>
                                        Invitar
                                    </button>
                                )}

                                {collaborators.length > 0 && (
                                    <button
                                        className="save-btn"
                                        onClick={() => setActiveTab("remove")}
                                    >
                                        <svg className="collaborators-icon-sm" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                                        </svg>
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                );
        }
    };

    const getTabTitle = () => {
        if (!actualIsOwner) return "Colaboradores de la playlist";

        switch (activeTab) {
            case "invite":
                return "Invitar colaboradores";
            case "remove":
                return "Eliminar colaboradores";
            default:
                return "Colaboradores de la playlist";
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="collaborators-popup" onClick={e => e.stopPropagation()}>
                <div className="collaborators-popup-header">
                    <h3>
                        <svg className="collaborators-icon-md" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
                        </svg>
                        {getTabTitle()}
                    </h3>
                </div>

                <div className="collaborators-content">
                    {getTabContent()}
                </div>

                <div className="collaborators-popup-actions">
                    {getActionButtons()}
                </div>
            </div>
        </div>
    );
};

Collaborators.propTypes = {
    playlistId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    isOwner: PropTypes.bool
};

export default Collaborators;