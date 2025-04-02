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

function Player() {
    const { currentSong, setCurrentSong, currentIndex, setCurrentIndex, songs, isPlaying, setIsPlaying } = usePlayer();

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

    useEffect(() => {
        console.log("🎵 Player detecta cambio de playing:", isPlaying);
    }, [isPlaying]);
    const prevTime = useRef(0);
    // Crea o recarga el Howl cuando la songUrl cambia
    useEffect(() => {
        // Verifica que currentSong y songUrl estén disponibles
        if (!currentSong || !songUrl) return;

        console.log("🎶 Cargando nueva canción en el reproductor:", currentSong.name);

        // Si la canción ya está cargada y está sonando, no recargues
        if (soundRef.current && soundRef.current._src === songUrl && soundRef.current.playing()) {
            console.log("La canción ya está cargada y sonando, no la recargo.");
            return;
        }

        // Limpia la canción anterior si existe
        if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.unload();
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Crea una nueva instancia de Howl solo si la canción cambia
        console.log("Creando howl...", songUrl);
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
                console.log("Reproduciendo: ", currentSong.name);
            },
            onplay: () => {
                intervalRef.current = setInterval(() => {
                    const sec = sound.seek();
                    // Solo actualiza si el tiempo ha cambiado
                    if (sec !== prevTime.current) {
                        setSeconds(sec);
                        setCurrTime({
                            min: Math.floor(sec / 60),
                            sec: Math.floor(sec % 60),
                        });
                        prevTime.current = sec;  // Actualizamos prevTime con el nuevo tiempo
                    }
                }, 1000);  // Intervalo de actualización de tiempo
            },

            onend: () => {
                console.log("🔚 onend: pasando a la siguiente canción");
                handleNext(); // Llamamos a la función
                if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                }
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
    }, [currentSong, songUrl]);  // Solo se ejecuta cuando currentSong o songUrl cambian



    useEffect(() => {
        if (!currentSong || !userId) return;

        console.log("useEffect - Verificando favoritos para la canción:", currentSong);
        console.log("useEffect - userId:", userId);

        const checkIfLiked = async () => {
            try {
                const url = `http://localhost:5001/api/song_like/${currentSong.id}/like?userId=${userId}`;
                console.log("useEffect - Llamando a URL:", url);

                // Hacemos la solicitud con fetch
                const response = await fetch(url, {
                    method: 'GET',  // Método GET
                    headers: {
                        'Content-Type': 'application/json',  // Especificamos el tipo de contenido
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }

                const data = await response.json();  // Obtener los datos de la respuesta
                console.log("useEffect - Respuesta del endpoint checkIfLiked:", data);

                setIsLiked(data.isLiked);  // Actualizamos el estado con la respuesta
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
        console.log("Cambiando isplaying en el player");
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        // Asegúrate de que soundRef.current esté inicializado
        if (!soundRef.current) {
            return;
        }

        // Revisa si la canción está reproduciéndose
        const isSoundPlaying = soundRef.current.playing();

        console.log("¿Está sonando?: ", isSoundPlaying);


        // Si isPlaying es true y no está sonando, reproducir
        if (isPlaying && !isSoundPlaying) {
            console.log("Reproduciendo canción");
            soundRef.current.play();
        }
        // Si isPlaying es false y está sonando, pausar
        else if (!isPlaying && isSoundPlaying) {
            console.log("Pausando canción");
            soundRef.current.pause();
        }
    }, [isPlaying, currentSong]);

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
        setIsPlaying(true);
        console.log("Reproduciendo desde flcecha anterior");
    };

    // Ir a la canción siguiente
    const handleNext = () => {
        if (!songs.length) return;
        const nextIndex = (currentIndex + 1) % songs.length;
        setCurrentIndex(nextIndex);
        setCurrentSong(songs[nextIndex]);
        setIsPlaying(true);
        setSeconds(0);
        console.log("Reproduciendo desde flcecha siguiente");
    };

    const toggleLike = async () => {
        try {
            // Primero obtener o crear la playlist de "Me Gusta"
            const responsePlaylist = await fetch('http://localhost:5001/api/playlists/songliked', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                }),
            });

            if (!responsePlaylist.ok) {
                throw new Error(`Error al obtener o crear la playlist: ${responsePlaylist.status}`);
            }

            const likedPlaylistRes = await responsePlaylist.json();
            console.log("Playlist de Me Gusta obtenida/creada:", likedPlaylistRes.playlist);

            const playlistId = likedPlaylistRes.playlist.id;  // Obtener el ID de la playlist

            // Luego agregar la canción a esa playlist
            const songId = currentSong.id;
            const responseLike = await fetch(`http://localhost:5001/api/song_like/${songId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    playlist_id: playlistId,  // Pasar el ID de la playlist correcta
                }),
            });

            if (!responseLike.ok) {
                throw new Error(`Error al agregar el like: ${responseLike.status}`);
            }

            const likeResponse = await responseLike.json();
            console.log("Respuesta del servidor:", likeResponse);
            setIsLiked(likeResponse.liked);
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