import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { apiFetch } from '#utils/apiFetch';
import './Rating.css';

const Rating = ({ playlistId, userId, onRatingUpdate }) => {
    const [rating, setRating] = useState(0); // Valoración del usuario
    const [averageRating, setAverageRating] = useState(0); // Valoración promedio
    const [hover, setHover] = useState(0);
    const [hasRated, setHasRated] = useState(false); // Indica si el usuario ya ha votado
    const [loading, setLoading] = useState(true); // Estado de carga

    // Cargar la valoración inicial al montar el componente
    useEffect(() => {
        const fetchRatings = async () => {
            setLoading(true);
            try {
                // Obtener la valoración promedio
                const avgData = await apiFetch(`/ratingPlaylist/${playlistId}/rating`);
                setAverageRating(parseFloat(avgData.averageRating || 0));

                // Obtener la valoración del usuario
                if (userId) {
                    const userData = await apiFetch(`/ratingPlaylist/${playlistId}/user-rating?userId=${userId}`);
                    if (userData.userRating) {
                        setRating(userData.userRating);
                        setHasRated(true); // El usuario ya ha votado
                    }
                }
            } catch (error) {
                console.error("Error al cargar las valoraciones:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, [playlistId, userId]);

    const handleRating = async (value) => {
        if (!userId || !playlistId) {
            console.error("userId o playlistId inválidos", { userId, playlistId });
            return;
        }

        setRating(value);
        setHasRated(true); // El usuario ha votado
        try {
            // Enviar la valoración al backend
            const data = await apiFetch(`/ratingPlaylist/${playlistId}/rate`, {
                method: 'POST',
                body: { user_id: userId, rating: value }
            });

            // Actualizar la valoración promedio
            setAverageRating(parseFloat(data.averageRating || 0));

            // Notificar al componente padre si es necesario
            if (onRatingUpdate) {
                onRatingUpdate(data.averageRating);
            }
        } catch (error) {
            console.error("Error al enviar la valoración:", error);
        }
    };

    return (
        <div className="rating-container">
            {/* Ya no necesitamos mostrar aquí el mensaje con la valoración media,
                pues se está mostrando en el componente padre (Playlist.jsx) */}
            
            <div className="user-rating-section">
                <p className="rating-label">
                    {loading ? "Cargando..." : hasRated ? "Tu valoración:" : "¡Valora esta playlist!"}
                </p>
                <div className="stars-container">
                    {[...Array(5)].map((_, index) => {
                        const value = index + 1;
                        return (
                            <FaStar
                                key={value}
                                className={`star ${value <= (hover || rating) ? 'filled' : ''}`}
                                onClick={() => handleRating(value)}
                                onMouseEnter={() => setHover(value)}
                                onMouseLeave={() => setHover(0)}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Rating;