import { useEffect, useState, useRef } from "react";
import { Howl } from "howler";
import { usePlayer } from "./PlayerContext.jsx";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";  // Iconos de corazón
import { IconContext } from "react-icons";
import { getImageUrl } from "#utils/getImageUrl";
import styles from "./PlayerStyles.module.css";
import axios from 'axios';
import {apiFetch} from "#utils/apiFetch";

function Player() {
    const { currentSong, setCurrentSong, currentIndex, setCurrentIndex, songs } = usePlayer();

    const [isPlaying, setIsPlaying] = useState(false);
    const [currTime, setCurrTime] = useState({ min: 0, sec: 0 });
    const [totalTime, setTotalTime] = useState({ min: 0, sec: 0 });
    const [seconds, setSeconds] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLiked, setIsLiked] = useState(false); // Estado para saber si la canción está en favoritos
    const soundRef = useRef(null);
    const intervalRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null; // Evitar errores si el usuario no está logueado

    // Para saber si hay o no canción seleccionada:
    const noSongSelected = !currentSong;

    // Obtenemos la URL de la canción
    const songUrl = currentSong?.url_mp3
        ? currentSong.url_mp3.startsWith("http")
            ? currentSong.url_mp3
            : `http://localhost:5001/${currentSong.url_mp3.replace(/^\/?/, "")}`
        : null;

    useEffect(() => {
        console.log("🎵 Player detecta cambio de canción:", currentSong);
    }, [currentSong]);

    // Crea o recarga el Howl cuando la songUrl cambia
    useEffect(() => {
        if (!currentSong || !songUrl) return;

        console.log("🎶 Cargando nueva canción en el reproductor:", currentSong.name);

        // Limpia la canción anterior si existe
        if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.unload();
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Crea una nueva instancia de Howl
        const sound = new Howl({
            src: [songUrl],
            html5: true,
            volume: 1.0,
            format: ["mp3"],
            onload: () => {
                console.log("✅ Canción cargada:", currentSong.name);
                const sec = sound.duration();
                setDuration(sec * 1000);
                setTotalTime({
                    min: Math.floor(sec / 60),
                    sec: Math.floor(sec % 60),
                });
                sound.play();
                setIsPlaying(true);
            },
            onplay: () => {
                setIsPlaying(true);
                intervalRef.current = setInterval(() => {
                    const sec = sound.seek();
                    setSeconds(sec);
                    setCurrTime({
                        min: Math.floor(sec / 60),
                        sec: Math.floor(sec % 60),
                    });
                }, 1000);
            },
        });

        soundRef.current = sound;

        return () => {
            if (soundRef.current) {
                soundRef.current.stop();
                soundRef.current.unload();
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [currentSong, songUrl]);

    // Verificar si la canción está en favoritos (solo si el usuario está logueado)
    useEffect(() => {
        if (!currentSong || !userId) return;

        console.log("useEffect - Verificando favoritos para la canción:", currentSong);
        console.log("useEffect - userId:", userId);

        const checkIfLiked = async () => {
            try {
                const url = `/song_like/${currentSong.id}/like?userId=${userId}`;
                console.log("useEffect - Llamando a URL:", url);

                const response = await apiFetch(url);
                console.log("useEffect - Respuesta del endpoint checkIfLiked:", response.data);

                setIsLiked(response.data.isLiked);
            } catch (error) {
                console.error("useEffect - Error al verificar los favoritos:", error);
            }
        };

        checkIfLiked();
    }, [currentSong, userId]);

    // Botón de play/pause
    const playingButton = () => {
        if (!soundRef.current) {
            console.log("No hay instancia de Howl. Verifica si se seleccionó una canción.");
            return;
        }
        if (isPlaying) {
            soundRef.current.pause();
        } else {
            soundRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Mover la barra de progreso
    const handleTimelineChange = (e) => {
        if (!soundRef.current) return;
        const newPosition = parseFloat(e.target.value);
        soundRef.current.seek(newPosition);
        setSeconds(newPosition);
    };

    // Ir a la canción anterior
    const handlePrevious = () => {
        if (!songs.length) return;
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        setCurrentIndex(prevIndex);
        setCurrentSong(songs[prevIndex]);
    };

    // Ir a la canción siguiente
    const handleNext = () => {
        if (!songs.length) return;
        const nextIndex = (currentIndex + 1) % songs.length;
        setCurrentIndex(nextIndex);
        setCurrentSong(songs[nextIndex]);
    };

    const toggleLike = async () => {
        try {
            // Primero obtener o crear la playlist de "Me Gusta"
            const likedPlaylistRes = await axios.post('http://localhost:5001/api/playlists/songliked', {
                user_id: userId
            });
            console.log("Playlist de Me Gusta obtenida/creada:", likedPlaylistRes.data.playlist);

            const playlistId = likedPlaylistRes.data.playlist.id; // Obtener el ID de la playlist

            // Luego agregar la canción a esa playlist
            const songId = currentSong.id;
            const response = await axios.post(`http://localhost:5001/api/song_like/${songId}/like`, {
                user_id: userId,
                playlist_id: playlistId // Pasar el ID de la playlist correcta
            });

            console.log("Respuesta del servidor:", response.data);
            setIsLiked(response.data.liked);
        } catch (error) {
            console.error("Error al agregar/eliminar el like", error);
        }
    };


    return (
        <div className={styles.playerContainer}>
            {/* Portada de la canción */}
            <img
                className={styles.musicCover}
                src={noSongSelected
                    ? "https://via.placeholder.com/300x300.png?text=Sin+Canci%C3%B3n"
                    : getImageUrl(currentSong.photo_video)}
                alt={noSongSelected ? "Sin canción seleccionada" : "Portada de la canción"}
            />

            {/* Información de la canción */}
            <div className={styles.info}>
                <h3 className={styles.title}>
                    {noSongSelected ? "Ninguna canción seleccionada" : currentSong.name}
                </h3>
                <p className={styles.artist}>
                    {noSongSelected
                        ? "Selecciona una canción de la lista"
                        : currentSong?.artists && Array.isArray(currentSong.artists) && currentSong.artists.length > 0
                            ? currentSong.artists.map(a => a.name).join(", ")
                            : "Artista desconocido"}
                </p>
            </div>

            {/* Controles de reproducción */}
            <div className={styles.controls}>
                <div className={styles.controlButtons}>
                    {/* Flecha anterior */}
                    <button
                        className={styles.controlButton}
                        onClick={handlePrevious}
                        disabled={noSongSelected}
                    >
                        <IconContext.Provider value={{size: "3em", color: "#21a1f1"}}>
                            <BiSkipPrevious/>
                        </IconContext.Provider>
                    </button>

                    {/* Botón de Play/Pause con estilo circular */}
                    <button
                        className={styles.playerControlPlay}
                        onClick={playingButton}
                        disabled={noSongSelected}
                    >
                        <IconContext.Provider value={{size: "3em", color: "#ffffff"}}>
                            {isPlaying ? <AiFillPauseCircle/> : <AiFillPlayCircle/>}
                        </IconContext.Provider>
                    </button>

                    {/* Flecha siguiente */}
                    <button
                        className={styles.controlButton}
                        onClick={handleNext}
                        disabled={noSongSelected}
                    >
                        <IconContext.Provider value={{size: "3em", color: "#21a1f1"}}>
                            <BiSkipNext/>
                        </IconContext.Provider>
                    </button>
                </div>
            </div>

            {/* Botón "Me Gusta" en un contenedor aparte */}
            <div className={styles.likeButtonContainer}>
                <button
                    className={styles.likeButton}
                    onClick={toggleLike}
                    disabled={noSongSelected}
                >
                    {isLiked ? <AiFillHeart color="#E74C3C"/> : <AiOutlineHeart color="#E74C3C"/>}
                </button>
            </div>

            {/* Barra de progreso siempre presente, pero deshabilitada si no hay canción */}
            <div className={styles.timelineContainer}>
                <div className={styles.time}>
                    <div className={styles.timeSection}>
                        <p className={styles.timeValue}>
                            {noSongSelected
                                ? "0:00"
                                : `${currTime.min}:${currTime.sec < 10 ? `0${currTime.sec}` : currTime.sec}`}
                        </p>
                    </div>
                    <div className={styles.timeSection}>
                        <p className={styles.timeValue}>
                            {noSongSelected
                                ? "0:00"
                                : `${totalTime.min}:${totalTime.sec < 10 ? `0${totalTime.sec}` : totalTime.sec}`}
                        </p>
                    </div>
                </div>

                <input
                    type="range"
                    min="0"
                    max={duration ? duration / 1000 : 0}
                    value={noSongSelected ? 0 : seconds}
                    className={styles.playerProgress}
                    onChange={handleTimelineChange}
                    disabled={noSongSelected}
                />
            </div>
        </div>
    );
}

export default Player;
