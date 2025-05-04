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
                    const existingCollaboratorIds = new Set(
                        currentCollaborators.map(c => Number(c.userId))
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

    const handleInviteCollaborators = async () => {
        if (selectedFriends.length === 0) return;

        const token = localStorage.getItem('token');
        console.log("[Collaborators.jsx][handleInvite] Starting invitation process for friends:", selectedFriends);

        // Verificar que los amigos seleccionados no estén ya invitados
        const currentPendingIds = new Set(
            pendingInvitations.map(invite => Number(invite.userId || invite.user_id))
        );

        const validFriendsToInvite = selectedFriends.filter(friendId => {
            const isAlreadyPending = currentPendingIds.has(Number(friendId));
            if (isAlreadyPending) {
                console.warn("[Collaborators.jsx][handleInvite] Friend already has pending invite:", friendId);
            }
            return !isAlreadyPending;
        });

        if (validFriendsToInvite.length === 0) {
            console.warn("[Collaborators.jsx][handleInvite] No valid friends to invite - all are pending");
            alert("Los amigos seleccionados ya tienen invitaciones pendientes.");
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

        // Actualizar estados
        const newPendingInvitations = [...pendingInvitations];
        validFriendsToInvite.forEach(friendId => {
            const invitedFriend = friendsList.find(f => f.friendId === friendId);
            if (invitedFriend) {
                const newInvitation = {
                    userId: friendId,
                    nickname: invitedFriend.nickname,
                    userPicture: invitedFriend.user_picture
                };
                newPendingInvitations.push(newInvitation);
            }
        });

        console.log("[Collaborators.jsx][handleInvite] Updating states with new pending invitations:",
            { count: newPendingInvitations.length, invitations: newPendingInvitations });

        setPendingInvitations(newPendingInvitations);
        setFriendsList(friendsList.filter(friend =>
            !validFriendsToInvite.includes(friend.friendId)));
        setSelectedFriends([]);

        alert("¡Invitaciones enviadas con éxito! Los amigos recibirán las invitaciones en sus chats.");

        // Refrescar los datos
        const refreshPendingInvites = await apiFetch(`/collaborators/${playlistId}/pending-invitations`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (refreshPendingInvites?.pendingInvitations) {
            console.log("[Collaborators.jsx][handleInvite] Refreshed pending invitations:",
                refreshPendingInvites.pendingInvitations);
            setPendingInvitations(refreshPendingInvites.pendingInvitations);
        }

        onClose();
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



    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="collaborators-popup" onClick={e => e.stopPropagation()}>
                <div className="collaborators-popup-header">
                    <h3>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '10px'}}>
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
                        </svg>
                        {actualIsOwner ? "Invitar colaboradores" : "Colaboradores de la playlist"}
                    </h3>
                </div>

                {actualIsOwner && (
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
                )}

                {!actualIsOwner && (
                    <div className="collaborators-current-list">
                        <h4>Colaboradores actuales</h4>
                        {loading ? (
                            <div className="collaborators-friends-empty">
                                Cargando colaboradores...
                            </div>
                        ) : error ? (
                            <div className="collaborators-friends-empty">
                                {error}
                            </div>
                        ) : collaborators.length > 0 ? (
                            collaborators.map(collab => {
                                const user = collab.User;
                                if (!user) {
                                    console.warn("[Collaborators.jsx] Colaborador sin datos de usuario:", collab);
                                    return null;
                                }

                                const avatarInfo = getInitialsAndColor(user.nickname, user.id);

                                return (
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
                )}

                <div className="collaborators-popup-actions">
                    <button
                        className="collaborators-cancel-btn"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                    {actualIsOwner && (
                        <button
                            className="save-btn"
                            onClick={handleInviteCollaborators}
                            disabled={selectedFriends.length === 0}
                        >
                            Invitar {selectedFriends.length > 0 ? `(${selectedFriends.length})` : ''}
                        </button>
                    )}
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