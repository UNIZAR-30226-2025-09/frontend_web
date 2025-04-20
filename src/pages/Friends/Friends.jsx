import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../utils/apiFetch';
import './Friends.css';

function Friends() {
    // Estados para gestionar los diferentes tipos de usuarios
    const [friends, setFriends] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados para gestionar el chat
    const [conversations, setConversations] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    
    // Estado para controlar la vista activa
    const [activeView, setActiveView] = useState('chats'); // 'chats', 'requests', 'search'
    
    // Token de autenticación
    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('userId') || '0'); 
    
    // Headers para las solicitudes API
    const headers = {
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        if (chatMessages.length > 0) {
            console.log("Primer mensaje:", {
                user1_id: chatMessages[0].user1_id,
                tipoUser1_id: typeof chatMessages[0].user1_id,
                userId: userId,
                tipoUserId: typeof userId,
                sonIguales: chatMessages[0].user1_id === userId
            });
        }
    }, [chatMessages, userId]);
    
    // Cargar datos iniciales
    useEffect(() => {
        if (token) {
            fetchFriends();
            fetchReceivedRequests();
            fetchSentRequests();
            fetchConversations();
        }
    }, [token]);
    
    // Efecto para hacer scroll hasta el último mensaje
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages]);
    
    // Intervalo para actualizar los mensajes y conversaciones regularmente
    useEffect(() => {
        if (selectedFriend) {
            const interval = setInterval(() => {
                fetchChatMessages(selectedFriend.friendId);
            }, 10000); // Actualizar cada 10 segundos
            
            return () => clearInterval(interval);
        }
    }, [selectedFriend]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            if (token) {
                fetchConversations();
                fetchReceivedRequests();
            }
        }, 15000); // Actualizar cada 15 segundos
        
        return () => clearInterval(interval);
    }, [token]);
    
    // Funciones para obtener datos
    const fetchFriends = async () => {
        try {
            const response = await apiFetch('/social/getFriendsList', {
                method: 'POST',
                headers
            });
            setFriends(response.friends || []);
        } catch (error) {
            console.error('Error al cargar amigos:', error);
        }
    };
    
    const fetchReceivedRequests = async () => {
        try {
            const response = await apiFetch('/social/getReceivedFriendRequests', {
                method: 'POST',
                headers
            });
            setReceivedRequests(response.receivedRequests || []);
        } catch (error) {
            console.error('Error al cargar solicitudes recibidas:', error);
        }
    };
    
    const fetchSentRequests = async () => {
        try {
            const response = await apiFetch('/social/getSentFriendRequests', {
                method: 'POST',
                headers
            });
            setSentRequests(response.sentRequests || []);
        } catch (error) {
            console.error('Error al cargar solicitudes enviadas:', error);
        }
    };
    
    const fetchConversations = async () => {
        try {
            const response = await apiFetch('/chat/conversations', {
                method: 'GET',
                headers
            });
            setConversations(response.conversations || []);
        } catch (error) {
            console.error('Error al cargar conversaciones:', error);
        }
    };
    
    // Cargar mensajes de una conversación
    const fetchChatMessages = async (friendId) => {
        try {
            const response = await apiFetch(`/chat/conversation/${friendId}`, {
                method: 'GET',
                headers
            });
            setChatMessages(response.messages || []);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        }
    };
    
    // Seleccionar un amigo para chatear
    const selectFriend = (friend) => {
        setSelectedFriend(friend);
        fetchChatMessages(friend.friendId);
    };
    
    // Enviar un nuevo mensaje
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedFriend) return;
        
        try {
            // Agregar mensaje optimista a la UI para feedback inmediato
            const optimisticMessage = {
                id: `temp-${Date.now()}`,
                user1_id: userId,
                user2_id: selectedFriend.friendId,
                txt_message: newMessage,
                sent_at: new Date().toISOString(),
                read: false,
                isOptimistic: true // Marca para identificar mensajes aún no confirmados
            };
            
            setChatMessages(prev => [...prev, optimisticMessage]);
            setNewMessage('');
            
            // Envía el mensaje real al servidor
            await apiFetch('/chat/send', {
                method: 'POST',
                headers,
                body: {
                    user2_id: selectedFriend.friendId,
                    message: newMessage
                }
            });
            
            // Refrescar la conversación para obtener el mensaje real
            fetchChatMessages(selectedFriend.friendId);
            
            // Refrescar la lista de conversaciones
            fetchConversations();
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            // Quitar el mensaje optimista si falló
            setChatMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
        }
    };
    
    // Buscar nuevos amigos
    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        
        try {
            const response = await apiFetch(`/social/searchNewFriends?search=${searchTerm}`, {
                method: 'POST',
                headers
            });
            setSearchResults(response.users || []);
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
        }
    };
    
    // Enviar solicitud de amistad
    const sendFriendRequest = async (userId) => {
        try {
            await apiFetch('/social/send', {
                method: 'POST',
                headers,
                body: { user2_id: userId }
            });
            // Actualizar lista de solicitudes enviadas
            fetchSentRequests();
            // Eliminar usuario de resultados de búsqueda
            setSearchResults(prev => prev.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
        }
    };
    
    // Aceptar solicitud de amistad
    const acceptFriendRequest = async (userId) => {
        try {
            await apiFetch('/social/accept', {
                method: 'POST',
                headers,
                body: { user1_id: userId }
            });
            // Actualizar listas
            fetchFriends();
            fetchReceivedRequests();
            fetchConversations();
        } catch (error) {
            console.error('Error al aceptar solicitud:', error);
        }
    };
    
    // Rechazar solicitud de amistad
    const rejectFriendRequest = async (userId) => {
        try {
            await apiFetch('/social/reject', {
                method: 'POST',
                headers,
                body: { friendId: userId }
            });
            // Actualizar listas
            fetchReceivedRequests();
        } catch (error) {
            console.error('Error al rechazar solicitud:', error);
        }
    };
    
    // Cancelar solicitud enviada
    const cancelFriendRequest = async (userId) => {
        try {
            await apiFetch('/social/reject', {
                method: 'POST',
                headers,
                body: { friendId: userId }
            });
            // Actualizar listas
            fetchSentRequests();
        } catch (error) {
            console.error('Error al cancelar solicitud:', error);
        }
    };
    
    // Dejar de seguir a un amigo
    const unfollowFriend = async (friendId) => {
        try {
            await apiFetch('/social/unfollow', {
                method: 'POST',
                headers,
                body: { friendId }
            });
            // Si estábamos chateando con este amigo, cerrar el chat
            if (selectedFriend && selectedFriend.friendId === friendId) {
                setSelectedFriend(null);
                setChatMessages([]);
            }
            // Actualizar listas
            fetchFriends();
            fetchConversations();
        } catch (error) {
            console.error('Error al dejar de seguir:', error);
        }
    };

    // Formatear fecha para mostrar en el chat
    const formatMessageTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Si es hoy, mostrar solo la hora
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        // Si es ayer, mostrar "Ayer" y la hora
        else if (date.toDateString() === yesterday.toDateString()) {
            return `Ayer ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        // Si es este año pero no hoy ni ayer, mostrar día y mes
        else if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleString([], { 
                day: '2-digit', 
                month: '2-digit',
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
        // Si es otro año, mostrar fecha completa
        else {
            return date.toLocaleString([], { 
                year: 'numeric',
                day: '2-digit', 
                month: '2-digit',
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
    };
    
    // Función para determinar si debemos mostrar un separador de fecha
    const shouldShowDateSeparator = (msg, index, messages) => {
        if (index === 0) return true;
        
        const prevDate = new Date(messages[index - 1].sent_at).toDateString();
        const currentDate = new Date(msg.sent_at).toDateString();
        
        return prevDate !== currentDate;
    };
    
    // Formatear fecha para separador
    const formatDateSeparator = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === now.toDateString()) {
            return "Hoy";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Ayer";
        } else {
            return date.toLocaleDateString([], {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    return (
        <div className="friends-container">
            <div className="friends-sidebar">
                <h3>Social</h3>
                <ul>
                    <li 
                        className={activeView === 'chats' ? 'active' : ''} 
                        onClick={() => setActiveView('chats')}>
                        Chats {conversations.filter(c => c.unreadCount > 0).length > 0 && 
                            <span className="unread-badge">{conversations.reduce((total, c) => total + c.unreadCount, 0)}</span>}
                    </li>
                    <li 
                        className={activeView === 'requests' ? 'active' : ''} 
                        onClick={() => setActiveView('requests')}>
                        Solicitudes {receivedRequests.length > 0 && <span className="request-badge">{receivedRequests.length}</span>}
                    </li>
                    <li 
                        className={activeView === 'search' ? 'active' : ''} 
                        onClick={() => setActiveView('search')}>
                        Buscar Amigos
                    </li>
                </ul>
            </div>
            
            <div className="friends-content">
                {activeView === 'chats' && (
                    <div className="chats-container">
                        {!selectedFriend ? (
                            <>
                                <h2>Mis Conversaciones</h2>
                                {conversations.length > 0 ? (
                                    <div className="conversations-list">
                                        {conversations.map(conv => (
                                            <div 
                                                key={conv.friend.id} 
                                                className={`conversation-card ${conv.unreadCount > 0 ? 'has-unread' : ''}`}
                                                onClick={() => {
                                                    const friend = friends.find(f => f.friendId === conv.friend.id);
                                                    if (friend) {
                                                        selectFriend(friend);
                                                    }
                                                }}
                                            >
                                                <div className="conversation-info">
                                                    <img 
                                                        src={conv.friend.user_picture || '/default-avatar.png'} 
                                                        alt={conv.friend.nickname} 
                                                        className="conversation-avatar"
                                                    />
                                                    <div className="conversation-details">
                                                        <span className="conversation-name">{conv.friend.nickname}</span>
                                                        {conv.lastMessage && (
                                                            <p className="conversation-preview">
                                                                {conv.lastMessage.user1_id === userId ? 'Tú: ' : ''}
                                                                {conv.lastMessage.txt_message.length > 30 
                                                                    ? conv.lastMessage.txt_message.substring(0, 30) + '...' 
                                                                    : conv.lastMessage.txt_message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {conv.unreadCount > 0 && (
                                                    <span className="unread-count">{conv.unreadCount}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="empty-state">No tienes conversaciones activas. Inicia una charla con tus amigos.</p>
                                )}
                                
                                {friends.length > 0 && conversations.length === 0 && (
                                    <div className="friends-list">
                                        <h3>Tus amigos</h3>
                                        {friends.map(friend => (
                                            <div key={friend.friendId} className="friend-card">
                                                <div className="friend-info">
                                                    <img 
                                                        src={friend.user_picture || '/default-avatar.png'} 
                                                        alt={friend.nickname} 
                                                        className="friend-avatar"
                                                    />
                                                    <span className="friend-name">{friend.nickname}</span>
                                                </div>
                                                <button 
                                                    className="chat-button"
                                                    onClick={() => selectFriend(friend)}>
                                                    Chatear
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="chat-window">
                                <div className="chat-header">
                                    <button 
                                        className="back-button"
                                        onClick={() => {
                                            setSelectedFriend(null);
                                            setChatMessages([]);
                                            fetchConversations(); // Actualizar lista de conversaciones
                                        }}
                                    >
                                        <i className="fas fa-arrow-left"></i>
                                    </button>
                                    <div className="chat-user-info">
                                        <img 
                                            src={selectedFriend.user_picture || '/default-avatar.png'} 
                                            alt={selectedFriend.nickname} 
                                            className="chat-avatar"
                                        />
                                        <span className="chat-username">{selectedFriend.nickname}</span>
                                    </div>
                                    <button 
                                        className="unfollow-button"
                                        onClick={() => unfollowFriend(selectedFriend.friendId)}
                                        title="Dejar de seguir"
                                    >
                                        <i className="fas fa-user-minus"></i>
                                    </button>
                                </div>
                                
                                <div className="chat-messages">
                                    {chatMessages.length > 0 ? (
                                        chatMessages.map((msg, index, messages) => {
                                            // Determinar si este mensaje es del mismo remitente que el mensaje anterior
                                            const isConsecutive = index > 0 && 
                                                messages[index - 1].user1_id === msg.user1_id &&
                                                !shouldShowDateSeparator(msg, index, messages);
                                            
                                            return (
                                                <React.Fragment key={msg.id}>
                                                    {/* Mostrar separador de fecha cuando cambia el día */}
                                                    {shouldShowDateSeparator(msg, index, messages) && (
                                                        <div className="date-separator">
                                                            {formatDateSeparator(msg.sent_at)}
                                                        </div>
                                                    )}
                                                    
                                                    <div 
                                                        className={`message ${msg.user1_id === selectedFriend.friendId ? 'received' : 'sent'} ${isConsecutive ? 'consecutive' : ''}`}
                                                    >
                                                        <div className="message-content">
                                                            <p>{msg.txt_message}</p>
                                                            <div className="message-footer">
                                                                <span className="message-time">{formatMessageTime(msg.sent_at)}</span>
                                                                {msg.user1_id === userId && (
                                                                    <span className="message-status">
                                                                        {msg.isOptimistic ? (
                                                                            <i className="fas fa-clock" title="Enviando..."></i>
                                                                        ) : msg.read ? (
                                                                            <i className="fas fa-check-double" title="Leído"></i>
                                                                        ) : (
                                                                            <i className="fas fa-check" title="Enviado"></i>
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })
                                    ) : (
                                        <p className="empty-chat">No hay mensajes aún. ¡Inicia la conversación con {selectedFriend.nickname}!</p>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                                
                                <form className="chat-input-form" onSubmit={sendMessage}>
                                    <input
                                        type="text"
                                        placeholder="Escribe un mensaje..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button type="submit" disabled={!newMessage.trim()}>
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
                
                {activeView === 'requests' && (
                    <div className="requests-container">
                        <div className="received-requests">
                            <h2>Solicitudes Recibidas</h2>
                            {receivedRequests.length > 0 ? (
                                <div className="requests-list">
                                    {receivedRequests.map(request => (
                                        <div key={request.friendId} className="request-card">
                                            <div className="request-info">
                                                <img 
                                                    src={request.user_picture || '/default-avatar.png'} 
                                                    alt={request.nickname} 
                                                    className="request-avatar"
                                                />
                                                <span className="request-name">{request.nickname}</span>
                                            </div>
                                            <div className="request-actions">
                                                <button 
                                                    className="accept-button"
                                                    onClick={() => acceptFriendRequest(request.friendId)}>
                                                    Aceptar
                                                </button>
                                                <button 
                                                    className="reject-button"
                                                    onClick={() => rejectFriendRequest(request.friendId)}>
                                                    Rechazar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-state">No tienes solicitudes pendientes</p>
                            )}
                        </div>
                        
                        <div className="sent-requests">
                            <h2>Solicitudes Enviadas</h2>
                            {sentRequests.length > 0 ? (
                                <div className="requests-list">
                                    {sentRequests.map(request => (
                                        <div key={request.friendId} className="request-card">
                                            <div className="request-info">
                                                <img 
                                                    src={request.user_picture || '/default-avatar.png'} 
                                                    alt={request.nickname} 
                                                    className="request-avatar"
                                                />
                                                <span className="request-name">{request.nickname}</span>
                                            </div>
                                            <button 
                                                className="cancel-button"
                                                onClick={() => cancelFriendRequest(request.friendId)}>
                                                Cancelar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-state">No has enviado solicitudes</p>
                            )}
                        </div>
                    </div>
                )}
                
                {activeView === 'search' && (
                    <div className="search-container">
                        <h2>Encontrar Amigos</h2>
                        <div className="search-bar">
                            <input 
                                type="text" 
                                placeholder="Buscar por nombre de usuario..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button onClick={handleSearch}>Buscar</button>
                        </div>
                        
                        {searchResults.length > 0 ? (
                            <div className="search-results">
                                {searchResults.map(user => (
                                    <div key={user.id} className="user-card">
                                        <div className="user-info">
                                            <img 
                                                src={user.user_picture || '/default-avatar.png'} 
                                                alt={user.nickname} 
                                                className="user-avatar"
                                            />
                                            <span className="user-name">{user.nickname}</span>
                                        </div>
                                        <button 
                                            className="add-button"
                                            onClick={() => sendFriendRequest(user.id)}>
                                            Añadir
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            searchTerm ? 
                            <p className="empty-state">No se encontraron usuarios</p> : 
                            <p className="empty-state">Busca usuarios para añadir como amigos</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Friends;