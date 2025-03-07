// Reproductor.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Reproductor.css';

const BACKEND_URL = 'http://localhost:5000';

const Reproductor = ({ songId }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songUrl, setSongUrl] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(true);

    // 🛠️ Ahora almacenamos el título, artista y portada en `useState`
    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [songCover, setSongCover] = useState('');

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/player/details/${songId}`);
                const data = await response.json();
                console.log("🎵 Datos recibidos del backend:", data);

                if (data.name) {
                    setSongTitle(data.name);
                    setSongArtist(data.artists?.map(a => a.name).join(', ') || "Desconocido");
                    setSongUrl(data.url_mp3 || "");
                    setSongCover(data.photo_video || "https://via.placeholder.com/150");
                }
            } catch (error) {
                console.error("⚠️ Error al obtener los datos de la canción:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSong();
    }, [songId]);

    // Actualiza el tiempo de reproducción solo si el audio existe
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const updateTime = () => setCurrentTime(audio.currentTime);
        audio.addEventListener('timeupdate', updateTime);
        return () => audio.removeEventListener('timeupdate', updateTime);
    }, [songUrl]);

    // Configura la duración cuando se carga la metadata, si hay audio
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const setAudioData = () => {
            setDuration(audio.duration);
        };
        audio.addEventListener('loadedmetadata', setAudioData);
        return () => audio.removeEventListener('loadedmetadata', setAudioData);
    }, [songUrl]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) {
            console.warn("No hay audio cargado");
            return;
        }
        isPlaying ? audio.pause() : audio.play();
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = (e) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = e.target.value;
        setCurrentTime(e.target.value);
    };

    const playNext = async () => {
        const response = await fetch(`${BACKEND_URL}/api/player/next`, { method: "POST" });
        const data = await response.json();
        if (data.url) {
            setSongUrl(data.url);
            setIsPlaying(true);
        }
    };

    const playPrevious = async () => {
        const response = await fetch(`${BACKEND_URL}/api/player/previous`, { method: "POST" });
        const data = await response.json();
        if (data.url) {
            setSongUrl(data.url);
            setIsPlaying(true);
        }
    };

    return (
        <div className="reproductor">
            {loading ? <p>Cargando...</p> : (
                <>
                    <div className="reproductor__cover">
                        <img src={songCover} alt="Portada de la canción"/>
                    </div>
                    <div className="reproductor__info">
                        <h4 className="reproductor__title">{songTitle || "Sin título"}</h4>
                        <p className="reproductor__artist">{songArtist || "Desconocido"}</p>
                    </div>
                    <div className="reproductor__controls">
                        <button onClick={playPrevious} className="reproductor__btn">
                            <i className="fas fa-step-backward"></i>
                        </button>
                        <button onClick={togglePlayPause} className="reproductor__btn">
                            {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
                        </button>
                        <button onClick={playNext} className="reproductor__btn">
                            <i className="fas fa-step-forward"></i>
                        </button>
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={handleProgressChange}
                            className="reproductor__progress"
                        />
                        <span className="reproductor__time">
                            {Math.floor(currentTime)}/{Math.floor(duration)} seg
                        </span>
                    </div>
                    {songUrl && <audio ref={audioRef} src={songUrl}/> }
                </>
            )}
        </div>
    );
};

Reproductor.propTypes = {
    songId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Reproductor;
