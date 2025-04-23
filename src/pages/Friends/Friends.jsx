import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { apiFetch } from '../../utils/apiFetch';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
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
    const chatContainerRef = useRef(null);
    const searchInputRef = useRef(null);
    
    // Estado para UI/UX mejorada
    const [activeView, setActiveView] = useState('chats'); // 'chats', 'requests', 'search'
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true); // Nuevo estado para controlar el auto-scroll
    const [recentEmojis, setRecentEmojis] = useState(['❤️', '👍', '😊', '🎵', '🔥']);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    // Token de autenticación
    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('userId') || '1'); // Usamos 1 como fallback
    
    // Headers para las solicitudes API
    const headers = useMemo(() => ({
        Authorization: `Bearer ${token}`
    }), [token]);

    // Depuración de mensajes
    useEffect(() => {
        if (chatMessages.length > 0) {
            console.log("Mensajes:", chatMessages);
        }
    }, [chatMessages]);
    
    // Cargar datos iniciales
    useEffect(() => {
        if (token) {
            const fetchInitialData = async () => {
                setIsLoading(true);
                try {
                    await Promise.all([
                        fetchFriends(),
                        fetchReceivedRequests(),
                        fetchSentRequests(),
                        fetchConversations()
                    ]);
                } catch (err) {
                    setError('Error al cargar los datos iniciales');
                    console.error('Error al cargar datos:', err);
                } finally {
                    setIsLoading(false);
                }
            };
            
            fetchInitialData();
        }
    }, [token]);
    
    // Efecto para hacer scroll hasta el último mensaje
    useEffect(() => {
        if (messagesEndRef.current && shouldAutoScroll) {
            // Solo scrollea el contenedor de mensajes, no el documento
            chatContainerRef.current?.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [chatMessages, shouldAutoScroll]);
    
    // Monitorear el scroll del container de chat
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (!chatContainer) return;
    
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = chatContainer;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            setShowScrollButton(distanceFromBottom > 100);
            setShouldAutoScroll(distanceFromBottom < 50);
        };
    
        chatContainer.addEventListener('scroll', handleScroll);
    
        // Llama a handleScroll al montar y cuando cambian los mensajes
        handleScroll();
    
        return () => chatContainer.removeEventListener('scroll', handleScroll);
    }, [chatMessages, selectedFriend]);

    useEffect(() => {
        console.log("Estado de showScrollButton:", showScrollButton);
    }, [showScrollButton]);
    
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
    
    // Funciones para obtener datos optimizadas con useCallback
    const fetchFriends = useCallback(async () => {
        try {
            const response = await apiFetch('/social/getFriendsList', {
                method: 'POST',
                headers
            });
            setFriends(response.friends || []);
            return response.friends;
        } catch (error) {
            console.error('Error al cargar amigos:', error);
            return [];
        }
    }, [headers]);
    
    const fetchReceivedRequests = useCallback(async () => {
        try {
            const response = await apiFetch('/social/getReceivedFriendRequests', {
                method: 'POST',
                headers
            });
            setReceivedRequests(response.receivedRequests || []);
            return response.receivedRequests;
        } catch (error) {
            console.error('Error al cargar solicitudes recibidas:', error);
            return [];
        }
    }, [headers]);
    
    const fetchSentRequests = useCallback(async () => {
        try {
            const response = await apiFetch('/social/getSentFriendRequests', {
                method: 'POST',
                headers
            });
            setSentRequests(response.sentRequests || []);
            return response.sentRequests;
        } catch (error) {
            console.error('Error al cargar solicitudes enviadas:', error);
            return [];
        }
    }, [headers]);
    
    const fetchConversations = useCallback(async () => {
        try {
            const response = await apiFetch('/chat/conversations', {
                method: 'GET',
                headers
            });
            setConversations(response.conversations || []);
            return response.conversations;
        } catch (error) {
            console.error('Error al cargar conversaciones:', error);
            return [];
        }
    }, [headers]);
    
    // Cargar mensajes de una conversación
    const fetchChatMessages = useCallback(async (friendId) => {
        try {
            const response = await apiFetch(`/chat/conversation/${friendId}`, {
                method: 'GET',
                headers
            });
            
            // Verificar si hay mensajes nuevos para determinar si hacer auto-scroll
            const prevMessages = chatMessages;
            const newMessages = response.messages || [];
            
            // Si hay mensajes nuevos y son más que antes, scrollear automáticamente
            if (newMessages.length > prevMessages.length) {
                setShouldAutoScroll(true);
            }
            
            setChatMessages(newMessages);
            return newMessages;
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
            return [];
        }
    }, [headers, chatMessages]);
    
    // Seleccionar un amigo para chatear
    const selectFriend = useCallback((friend) => {
        setSelectedFriend(friend);
        // Establecer el auto-scroll a true cuando seleccionamos un chat
        setShouldAutoScroll(true);
        fetchChatMessages(friend.friendId);
        // Añadir clase al contenedor principal para desactivar su scroll
        document.querySelector('.friends-content').classList.add('chat-active');
    }, [fetchChatMessages]);

    const handleBackFromChat = () => {
        setSelectedFriend(null);
        setChatMessages([]);
        // Quitar clase del contenedor principal para restaurar su scroll
        document.querySelector('.friends-content').classList.remove('chat-active');
        fetchConversations(); // Actualizar lista de conversaciones
    };
    
    // Enviar un nuevo mensaje con manejo de emojis
    const sendMessage = useCallback(async (e) => {
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
            setShowEmojiPicker(false);
            setShouldAutoScroll(true); // Asegurar que se scrollee al enviar mensaje
            
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
    }, [newMessage, selectedFriend, userId, headers, fetchChatMessages, fetchConversations]);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setSearchResults([]);
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);
    
    // Buscar nuevos amigos
    const handleSearch = useCallback(async () => {
        if (!searchTerm.trim()) return;
        
        try {
            setIsLoading(true);
            
            // Primero, busca usuarios con el endpoint normal
            const response = await apiFetch(`/social/searchNewFriends?search=${searchTerm}`, {
                method: 'POST',
                headers
            });
            
            // Obtener la lista de users del resultado
            let users = response.users || [];
            console.log("Usuarios encontrados inicialmente:", users.length);
            
            // También buscar entre solicitudes enviadas para no perder esos usuarios
            const sentRequestsFiltered = sentRequests.filter(req => 
                req.nickname.toLowerCase().includes(searchTerm.toLowerCase())
            );
            console.log("Solicitudes enviadas coincidentes:", sentRequestsFiltered.length);
            
            // Combinar resultados, evitando duplicados
            const combinedUsers = [...users];
            
            // Añadir usuarios de solicitudes enviadas que no estén ya en los resultados
            sentRequestsFiltered.forEach(request => {
                const alreadyInResults = combinedUsers.some(user => 
                    parseInt(user.id) === parseInt(request.friendId)
                );
                
                if (!alreadyInResults) {
                    combinedUsers.push({
                        id: request.friendId,
                        nickname: request.nickname,
                        user_picture: request.user_picture
                    });
                }
            });
            
            // También buscar entre amigos actuales
            const friendsFiltered = friends.filter(friend => 
                friend.nickname.toLowerCase().includes(searchTerm.toLowerCase())
            );
            console.log("Amigos coincidentes:", friendsFiltered.length);
            
            // Añadir amigos que coinciden con la búsqueda y no están ya en los resultados
            friendsFiltered.forEach(friend => {
                const alreadyInResults = combinedUsers.some(user => 
                    parseInt(user.id) === parseInt(friend.friendId)
                );
                
                if (!alreadyInResults) {
                    combinedUsers.push({
                        id: friend.friendId,
                        nickname: friend.nickname,
                        user_picture: friend.user_picture
                    });
                }
            });
            
            console.log("Resultados combinados:", combinedUsers.length);
            
            // Procesar todos los resultados para añadir información de estado
            const processedResults = combinedUsers.map(user => {
                const userId = parseInt(user.id);
                
                // Verificar si el usuario ya es amigo
                const isFriend = friends.some(friend => 
                    parseInt(friend.friendId) === userId
                );
                
                // Verificar si ya hay solicitud pendiente
                const hasPendingRequest = sentRequests.some(request => 
                    parseInt(request.friendId) === userId
                );
                
                return {
                    ...user,
                    isFriend,
                    hasPendingRequest
                };
            });
            
            setSearchResults(processedResults);
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
            setError('Error al buscar usuarios');
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, headers, friends, sentRequests]);
    
    // Enviar solicitud de amistad
    const sendFriendRequest = useCallback(async (userId) => {
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
    }, [headers, fetchSentRequests]);
    
    // Aceptar solicitud de amistad
    const acceptFriendRequest = useCallback(async (userId) => {
        try {
            await apiFetch('/social/accept', {
                method: 'POST',
                headers,
                body: { user1_id: userId }
            });
            // Actualizar listas
            await Promise.all([
                fetchFriends(),
                fetchReceivedRequests(),
                fetchConversations()
            ]);
        } catch (error) {
            console.error('Error al aceptar solicitud:', error);
        }
    }, [headers, fetchFriends, fetchReceivedRequests, fetchConversations]);
    
    // Rechazar solicitud de amistad
    const rejectFriendRequest = useCallback(async (userId) => {
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
    }, [headers, fetchReceivedRequests]);
    
    // Cancelar solicitud enviada
    const cancelFriendRequest = useCallback(async (userId) => {
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
    }, [headers, fetchSentRequests]);
    
    // Dejar de seguir a un amigo
    const unfollowFriend = useCallback(async (friendId) => {
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
    }, [headers, selectedFriend, fetchFriends, fetchConversations]);

    // Manejo avanzado de emojis
    const addEmoji = useCallback((emoji) => {
        setNewMessage(prev => prev + emoji);
        // Actualizar emojis recientes
        setRecentEmojis(prev => {
            const newEmojis = [emoji, ...prev.filter(e => e !== emoji)].slice(0, 5);
            return newEmojis;
        });
        setShowEmojiPicker(false);
    }, []);
    
    // Función para desplazarse al final del chat
    const scrollToBottom = useCallback(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
            setShouldAutoScroll(true);
        }
    }, []);

    // Formatear fecha para mostrar en el chat
    const formatMessageTime = useCallback((dateString) => {
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
    }, []);
    
    // Formatear tiempo relativo para las previsualizaciones
    const formatRelativeTime = useCallback((dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), {
                addSuffix: true,
                locale: es
            });
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return dateString;
        }
    }, []);
    
    // Función para determinar si debemos mostrar un separador de fecha
    const shouldShowDateSeparator = useCallback((msg, index, messages) => {
        if (index === 0) return true;
        
        const prevDate = new Date(messages[index - 1].sent_at).toDateString();
        const currentDate = new Date(msg.sent_at).toDateString();
        
        return prevDate !== currentDate;
    }, []);
    
    // Formatear fecha para separador
    const formatDateSeparator = useCallback((dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === now.toDateString()) {
            return "Hoy";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Ayer";
        } else {
            return date.toLocaleDateString('es', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }, []);

    // Cambio de pestaña con efectos
    const changeView = useCallback((view) => {
        if (view === activeView) return;
        
        // Efecto de fade out/in
        const content = document.querySelector('.friends-content');
        content.classList.add('fade-out');
        
        setTimeout(() => {
            setActiveView(view);
            content.classList.remove('fade-out');
            content.classList.add('fade-in');
            
            setTimeout(() => {
                content.classList.remove('fade-in');
            }, 300);
        }, 300);
        
        // Resetear mensajes seleccionados si salimos de chats
        if (view !== 'chats' && selectedFriend) {
            setSelectedFriend(null);
            setChatMessages([]);
        }
        
        // Enfocar barra de búsqueda al ir a búsqueda
        if (view === 'search' && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 400);
        }
    }, [activeView, selectedFriend]);

    // Función para generar avatares con iniciales
    const getInitialsAvatar = useCallback((name, userId) => {
        if (!name) return null;
        
        // Tomar la primera letra del nombre
        const initial = name.charAt(0).toUpperCase();
        
        // Generar un color determinístico basado en el userId
        const colors = [
            '#1877f2', '#28a745', '#dc3545', '#fd7e14', '#6f42c1', 
            '#e83e8c', '#20c997', '#17a2b8', '#6610f2', '#007bff'
        ];
        const colorIndex = (userId || name.length) % colors.length;
        const bgColor = colors[colorIndex];
        
        return { initial, bgColor };
    }, []);

    return (
        <div className="friends-container">
            {/* Sidebar mejorada */}
            <div className="friends-sidebar">
                <h3>Social</h3>
                <ul>
                    <li 
                        className={activeView === 'chats' ? 'active' : ''} 
                        onClick={() => changeView('chats')}
                    >
                        <span className="menu-item-content">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar-icon">
                            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4.58 16.59L4 17.17V4H20V16Z" fill="currentColor"/>
                        </svg>                            
                        <span className="menu-text">Chats</span>
                        </span>
                        {conversations.filter(c => c.unreadCount > 0).length > 0 && 
                            <span className="unread-badge">{conversations.reduce((total, c) => total + c.unreadCount, 0)}</span>}
                    </li>
                    <li 
                        className={activeView === 'requests' ? 'active' : ''} 
                        onClick={() => changeView('requests')}
                    >
                        <span className="menu-item-content">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar-icon">
                            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                        </svg>
                        <span className="menu-text">Solicitudes</span>
                        </span>
                        {receivedRequests.length > 0 && 
                            <span className="request-badge">{receivedRequests.length}</span>}
                    </li>
                    <li 
                        className={activeView === 'search' ? 'active' : ''} 
                        onClick={() => changeView('search')}
                    >
                        <span className="menu-item-content">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar-icon">
                            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
                        </svg>
                        <span className="menu-text">Buscar Amigos</span>
                        </span>
                    </li>
                </ul>
                
                {/* Estadísticas de amigos */}
                <div className="friends-stats">
                    <div className="stat">
                        <span className="stat-value">{friends.length}</span>
                        <span className="stat-label">Amigos</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{conversations.filter(c => c.unreadCount > 0).length}</span>
                        <span className="stat-label">No leídos</span>
                    </div>
                </div>
            </div>
            
            {/* Contenido principal */}
            <div className="friends-content">
                {/* Pantalla de carga */}
                {isLoading && activeView !== 'chats' && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Cargando...</p>
                    </div>
                )}
                
                {/* Mensaje de error */}
                {error && (
                    <div className="error-container">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                    </svg>                        
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>Cerrar</button>
                    </div>
                )}
                
                {/* Vista de chats */}
                {activeView === 'chats' && (
                    <div className="chats-container">
                        {!selectedFriend ? (
                            <>
                                <h2>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM17 11h-4v4h-2v-4H7V9h4V5h2v4h4v2z" fill="currentColor"/>
                                    </svg>
                                    Mis Conversaciones
                                </h2>
                                
                                {conversations.length > 0 ? (
                                    <div className="conversations-list">
                                        {conversations.map(conv => {
                                            const avatarInfo = getInitialsAvatar(conv.friend.nickname, conv.friend.id);
                                            
                                            return (
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
                                                        <div className="avatar-container">
                                                            {conv.friend.user_picture ? (
                                                                <img 
                                                                    src={conv.friend.user_picture} 
                                                                    alt={conv.friend.nickname} 
                                                                    className="conversation-avatar"
                                                                />
                                                            ) : avatarInfo && (
                                                                <div 
                                                                    className="initials-avatar" 
                                                                    style={{backgroundColor: avatarInfo.bgColor}}
                                                                >
                                                                    {avatarInfo.initial}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="conversation-details">
                                                            <span className="conversation-name">{conv.friend.nickname}</span>
                                                            {conv.lastMessage && (
                                                                <p className="conversation-preview">
                                                                    {conv.lastMessage.user1_id === userId ? (
                                                                        <><span className="msg-prefix">Tú:</span> {conv.lastMessage.txt_message.length > 30 
                                                                            ? conv.lastMessage.txt_message.substring(0, 30) + '...' 
                                                                            : conv.lastMessage.txt_message}</>
                                                                    ) : (
                                                                        conv.lastMessage.txt_message.length > 35 
                                                                            ? conv.lastMessage.txt_message.substring(0, 35) + '...' 
                                                                            : conv.lastMessage.txt_message
                                                                    )}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="conversation-meta">
                                                        {conv.lastMessage && (
                                                            <span className="conversation-time">
                                                                {formatRelativeTime(conv.lastMessage.sent_at)}
                                                            </span>
                                                        )}
                                                        {conv.unreadCount > 0 && (
                                                            <span className="unread-count">{conv.unreadCount}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4.58 16.59L4 17.17V4H20V16ZM12.5 11H17V13H12.5V11ZM7 9H17V11H7V9ZM7 13H10.5V15H7V13Z" fill="currentColor"/>
                                        </svg>
                                        <p>No tienes conversaciones activas</p>
                                        <p>Inicia una charla con tus amigos o conoce gente nueva</p>
                                    </div>
                                )}
                                
                                {friends.length > 0 && !isLoading && (
                                    <div className="friends-list">
                                        <h3>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
                                            </svg>
                                            Tus amigos
                                        </h3>
                                        <div className="friends-grid">
                                            {friends.map(friend => {
                                                const avatarInfo = getInitialsAvatar(friend.nickname, friend.friendId);
                                                
                                                return (
                                                    <div key={friend.friendId} className="friend-card">
                                                        <div className="friend-info">
                                                            {friend.user_picture ? (
                                                                <img 
                                                                    src={friend.user_picture} 
                                                                    alt={friend.nickname} 
                                                                    className="friend-avatar"
                                                                />
                                                            ) : avatarInfo && (
                                                                <div 
                                                                    className="initials-avatar" 
                                                                    style={{backgroundColor: avatarInfo.bgColor}}
                                                                >
                                                                    {avatarInfo.initial}
                                                                </div>
                                                            )}
                                                            <span className="friend-name">{friend.nickname}</span>
                                                        </div>
                                                        <div className="friend-actions">
                                                            <button 
                                                                className="chat-button"
                                                                onClick={() => selectFriend(friend)}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
                                                                </svg> Chatear
                                                            </button>
                                                            <button 
                                                                className="unfollow-mini-button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    unfollowFriend(friend.friendId);
                                                                }}
                                                                title="Dejar de seguir"
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M14 8c0-2.21-1.79-4-4-4S6 5.79 6 8s1.79 4 4 4 4-1.79 4-4zm3 2v2h6v-2h-6zM2 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4z" fill="currentColor"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="chat-window">
                                {/* Header del chat */}
                                <div className="chat-header">
                                    <button 
                                        className="back-button"
                                        onClick={handleBackFromChat}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
                                        </svg>
                                    </button>
                                    <div className="chat-user-info">
                                        {selectedFriend.user_picture ? (
                                            <img 
                                                src={selectedFriend.user_picture} 
                                                alt={selectedFriend.nickname} 
                                                className="chat-avatar"
                                            />
                                        ) : (
                                            <div 
                                                className="initials-avatar chat-avatar"
                                                style={{backgroundColor: getInitialsAvatar(selectedFriend.nickname, selectedFriend.friendId)?.bgColor}}
                                            >
                                                {getInitialsAvatar(selectedFriend.nickname)?.initial}
                                            </div>
                                        )}
                                        <div className="chat-user-details">
                                            <span className="chat-username">{selectedFriend.nickname}</span>
                                        </div>
                                    </div>
                                    <div className="chat-actions">
                                        <button 
                                            className="unfollow-button"
                                            onClick={() => unfollowFriend(selectedFriend.friendId)}
                                            title="Dejar de seguir"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 8c0-2.21-1.79-4-4-4S6 5.79 6 8s1.79 4 4 4 4-1.79 4-4zm3 2v2h6v-2h-6zM2 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4z" fill="currentColor"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Mensajes del chat */}
                                <div className="chat-messages" ref={chatContainerRef}>
                                    {chatMessages.length > 0 ? (
                                        chatMessages.map((msg, index, messages) => {
                                            // Determinar si este mensaje es del mismo remitente que el mensaje anterior
                                            const isConsecutive = index > 0 && 
                                                messages[index - 1].user1_id === msg.user1_id &&
                                                !shouldShowDateSeparator(msg, index, messages);
                                            
                                            // Determinar si este mensaje es enviado o recibido
                                            const isSentByMe = msg.user1_id !== selectedFriend.friendId;
                                            
                                            return (
                                                <React.Fragment key={msg.id}>
                                                    {/* Separador de fecha */}
                                                    {shouldShowDateSeparator(msg, index, messages) && (
                                                        <div className="date-separator">
                                                            {formatDateSeparator(msg.sent_at)}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Mensaje */}
                                                    <div 
                                                        className={`message ${isSentByMe ? 'sent' : 'received'} ${isConsecutive ? 'consecutive' : ''} ${msg.isOptimistic ? 'optimistic' : ''}`}
                                                    >
                                                        <div className="message-content">
                                                            <p>{msg.txt_message}</p>
                                                            <div className="message-footer">
                                                                <span className="message-time">{formatMessageTime(msg.sent_at)}</span>
                                                                {isSentByMe && (
                                                                    <span className="message-status">
                                                                        {msg.isOptimistic ? (
                                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor"/>
                                                                                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
                                                                            </svg>
                                                                        ) : msg.read ? (
                                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" fill="currentColor"/>
                                                                            </svg>
                                                                        ) : (
                                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                                                                            </svg>
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
                                        <div className="empty-chat">
                                            <div className="empty-chat-icon">
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4.58 16.59L4 17.17V4H20V16Z" fill="currentColor"/>
                                                </svg>
                                            </div>
                                            <h3>Inicia una conversación</h3>
                                            <p>No hay mensajes con {selectedFriend.nickname} todavía</p>
                                            <p>¡Envía el primer mensaje para comenzar a chatear!</p>
                                        </div>
                                    )}
                                    
                                    {/* Referencia para scroll */}
                                    <div ref={messagesEndRef} />
                                </div>
                                
                                {/* Botón para ir al final del chat */}
                                {showScrollButton && (
                                    <button 
                                        className={`scroll-bottom-button ${showScrollButton ? 'visible' : ''}`}
                                        onClick={scrollToBottom}
                                        aria-label="Ir al final de la conversación"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/>
                                        </svg>
                                    </button>
                                )}
                                
                                {/* Formulario para enviar mensajes */}
                                <form className="chat-input-form" onSubmit={sendMessage}>
                                    <button
                                        type="button"
                                        className="emoji-button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor"/>
                                        </svg>
                                    </button>
                                    
                                    <input
                                        type="text"
                                        placeholder="Escribe un mensaje..."
                                        value={newMessage}
                                        onChange={(e) => {
                                            setNewMessage(e.target.value);
                                        }}
                                    />
                                    <button 
                                        type="submit" 
                                        className="send-button" 
                                        disabled={!newMessage.trim()}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                                        </svg>
                                    </button>
                                </form>
                                
                                {/* Selector de emojis modificado */}
                                {showEmojiPicker && (
                                    <div className="emoji-picker">
                                        <div className="recent-emojis">
                                            {recentEmojis.map((emoji, index) => (
                                                <button 
                                                    key={index} 
                                                    className="emoji" 
                                                    onClick={() => addEmoji(emoji)}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="emoji-grid">
                                            {['😀', '😂', '😍', '🤔', '😎', '😢', '😡', '👍', 
                                              '👎', '👏', '🙏', '❤️', '🔥', '🎵', '🎉', '👋',
                                              '💯', '🤝', '💪', '🍕', '🍺', '🎮', '⚽', '🌟'
                                            ].map((emoji, index) => (
                                                <button 
                                                    key={index} 
                                                    className="emoji" 
                                                    onClick={() => addEmoji(emoji)}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                
                {/* Vista de solicitudes */}
                {activeView === 'requests' && !isLoading && (
                    <div className="requests-container">
                        <div className="received-requests">
                            <h2>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 3H4.99c-1.11 0-1.98.9-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10zm-3-5h-2V7h-4v3H8l4 4 4-4z" fill="currentColor"/>
                                </svg>
                                Solicitudes Recibidas
                            </h2>
                            
                            {receivedRequests.length > 0 ? (
                                <div className="requests-list">
                                    {receivedRequests.map(request => {
                                        const avatarInfo = getInitialsAvatar(request.nickname, request.friendId);
                                        
                                        return (
                                            <div key={request.friendId} className="request-card">
                                                <div className="request-info">
                                                    {request.user_picture ? (
                                                        <img 
                                                            src={request.user_picture} 
                                                            alt={request.nickname} 
                                                            className="request-avatar"
                                                        />
                                                    ) : avatarInfo && (
                                                        <div 
                                                            className="initials-avatar" 
                                                            style={{backgroundColor: avatarInfo.bgColor}}
                                                        >
                                                            {avatarInfo.initial}
                                                        </div>
                                                    )}
                                                    <div className="request-user-info">
                                                        <span className="request-name">{request.nickname}</span>
                                                        <span className="request-time">Solicitado hace {formatRelativeTime(request.requestDate || new Date())}</span>
                                                    </div>
                                                </div>
                                                <div className="request-actions">
                                                    <button 
                                                        className="accept-button"
                                                        onClick={() => acceptFriendRequest(request.friendId)}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
                                                            <circle cx="19" cy="10" r="8" fill="var(--success-color)"/>
                                                            <path d="M15 10L18 13L23 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg> Aceptar
                                                    </button>
                                                    <button 
                                                        className="reject-button"
                                                        onClick={() => rejectFriendRequest(request.friendId)}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M15 6.5c0-2.21-1.79-4-4-4S7 4.29 7 6.5s1.79 4 4 4 4-1.79 4-4zm-4 5c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                                                            <circle cx="19" cy="6.5" r="6" fill="var(--danger-color)"/>
                                                            <path d="M16 3.5L22 9.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                                            <path d="M22 3.5L16 9.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                                        </svg> Rechazar
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 3H4.99c-1.11 0-1.98.9-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10zm-3-5h-2V7h-4v3H8l4 4 4-4z" fill="currentColor"/>
                                    </svg>
                                    <p>No tienes solicitudes pendientes</p>
                                    <p>Cuando alguien te envíe una solicitud, aparecerá aquí</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="sent-requests">
                            <h2>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                                </svg>
                                Solicitudes Enviadas
                            </h2>
                            
                            {sentRequests.length > 0 ? (
                                <div className="requests-list">
                                    {sentRequests.map(request => {
                                        const avatarInfo = getInitialsAvatar(request.nickname, request.friendId);
                                        
                                        return (
                                            <div key={request.friendId} className="request-card">
                                                <div className="request-info">
                                                    {request.user_picture ? (
                                                        <img 
                                                            src={request.user_picture} 
                                                            alt={request.nickname} 
                                                            className="request-avatar"
                                                        />
                                                    ) : avatarInfo && (
                                                        <div 
                                                            className="initials-avatar" 
                                                            style={{backgroundColor: avatarInfo.bgColor}}
                                                        >
                                                            {avatarInfo.initial}
                                                        </div>
                                                    )}
                                                    <div className="request-user-info">
                                                        <span className="request-name">{request.nickname}</span>
                                                        <span className="request-time">Enviado hace {formatRelativeTime(request.requestDate || new Date())}</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    className="cancel-button"
                                                    onClick={() => cancelFriendRequest(request.friendId)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                                                    </svg> Cancelar
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                                    </svg>
                                    <p>No has enviado solicitudes</p>
                                    <p>Busca amigos para empezar a conectar</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Vista de búsqueda */}
                {activeView === 'search' && (
                    <div className="search-container">
                        <h2>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
                            </svg>
                            Buscar Amigos
                        </h2>
                        
                        <div className="search-bar">
                            <i className="fas fa-search search-icon"></i>
                            <input 
                                ref={searchInputRef}
                                type="text" 
                                placeholder="Buscar por nombre de usuario..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            {searchTerm && (
                                <button 
                                    className="search-clear" 
                                    onClick={clearSearch}
                                    title="Limpiar búsqueda"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                                    </svg>
                                </button>
                            )}
                            <button 
                                className="search-button" 
                                onClick={handleSearch}
                                title="Buscar"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
                                </svg>
                            </button>
                        </div>

                        <div className="search-info">
                            <p>Encuentra amigos para compartir música y experiencias. Comienza buscando por su nombre de usuario.</p>
                        </div>
                        
                        {isLoading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Buscando usuarios...</p>
                            </div>
                        ) : (
                            <>
                                {searchResults.length > 0 ? (
                                    <div className="search-results">
                                        {searchResults.map(user => {
                                            const avatarInfo = getInitialsAvatar(user.nickname, user.id);
                                            
                                            return (
                                                <div key={user.id} className="user-card">
                                                    <div className="user-info">
                                                        {user.user_picture ? (
                                                            <img 
                                                                src={user.user_picture} 
                                                                alt={user.nickname} 
                                                                className="user-avatar"
                                                            />
                                                        ) : avatarInfo && (
                                                            <div 
                                                                className="initials-avatar" 
                                                                style={{backgroundColor: avatarInfo.bgColor}}
                                                            >
                                                                {avatarInfo.initial}
                                                            </div>
                                                        )}
                                                        <span className="user-name">{user.nickname}</span>
                                                    </div>
                                                    
                                                    {user.isFriend ? (
                                                        <div className="is-friend-indicator">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                                                            </svg> 
                                                            Ya es tu amigo
                                                        </div>
                                                    ) : user.hasPendingRequest ? (
                                                        <div className="is-friend-indicator" style={{backgroundColor: "rgba(24, 119, 242, 0.1)", color: "var(--primary-color)"}}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill="currentColor"/>
                                                            </svg>
                                                            Solicitud pendiente
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            className="add-button"
                                                            onClick={() => sendFriendRequest(user.id)}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                                                            </svg> 
                                                            Añadir
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    searchTerm ? (
                                        <div className="empty-state">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
                                                <circle cx="9.5" cy="9.5" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                                <line x1="9.5" y1="7" x2="9.5" y2="12" stroke="currentColor" strokeWidth="1.5"/>
                                                <line x1="7" y1="9.5" x2="12" y2="9.5" stroke="currentColor" strokeWidth="1.5"/>
                                            </svg>
                                            <p>No se encontraron usuarios</p>
                                            <p>Intenta con otro término de búsqueda</p>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
                                            </svg>
                                            <p>Busca usuarios para añadir como amigos</p>
                                            <p>Escribe un nombre o apodo en la barra de búsqueda</p>
                                        </div>
                                    )
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Friends;