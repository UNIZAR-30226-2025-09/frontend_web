// Reproductor.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Reproductor.css';

const BACKEND_URL = 'http://localhost:5000'; // O usa la URL deseada

const Reproductor = ({ songId, songTitle, songArtist, songCover }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songUrl, setSongUrl] = useState(''); // Dejamos vacío para pruebas sin audio
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Si no deseas usar fetch para obtener el audio, puedes comentar esta parte
    // useEffect(() => {
    //   const fetchSong = async () => {
    //     try {
    //       const response = await fetch(`${BACKEND_URL}/api/player/${songId}`);
    //       const data = await response.json();
    //       if (data.url_mp3) {
    //         setSongUrl(data.url_mp3);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching song:", error);
    //     }
    //   };
    //   fetchSong();
    // }, [songId]);

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
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = (e) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = e.target.value;
        setCurrentTime(e.target.value);
    };

    return (
        <div className="reproductor">
            <div className="reproductor__cover">
                <img src={songCover} alt="Portada de la canción" />
            </div>
            <div className="reproductor__info">
                <h4 className="reproductor__title">{songTitle}</h4>
                <p className="reproductor__artist">{songArtist}</p>
            </div>
            <div className="reproductor__controls">
                <button onClick={togglePlayPause} className="reproductor__btn">
                    {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
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
            {/* Sólo renderiza el audio si songUrl no es vacío */}
            {songUrl && <audio ref={audioRef} src={songUrl} />}
        </div>
    );
};

Reproductor.propTypes = {
    songId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    songTitle: PropTypes.string.isRequired,
    songArtist: PropTypes.string.isRequired,
    songCover: PropTypes.string.isRequired,
};

export default Reproductor;
