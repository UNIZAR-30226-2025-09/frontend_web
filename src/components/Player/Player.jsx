import { useEffect, useState, useRef } from "react";
import { Howl } from "howler";
import { usePlayer } from "./PlayerContext.jsx";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";  // Iconos de corazón
import { IconContext } from "react-icons";
import { getImageUrl } from "#utils/getImageUrl";
import styles from "./PlayerStyles.module.css";
import {apiFetch} from "#utils/apiFetch";
import SynchronizedLyrics from "../SynchronizedLyrics/SynchronizedLyrics";
import { parseLRC } from "../../utils/parseLRC";
function Player() {
    const { currentSong, setCurrentSong, currentIndex, setCurrentIndex, songs,
            isPlaying, setIsPlaying, setSongs, playlistActive, setPlaylistActive, setSongActive,
            dailySkips, setDailySkips} = usePlayer();
    const [currTime, setCurrTime] = useState({ min: 0, sec: 0 });
    const [totalTime, setTotalTime] = useState({ min: 0, sec: 0 });
    const [seconds, setSeconds] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loadingFromSavedState, setLoadingFromSavedState] = useState(false); // New state to track if we're loading from saved state
    const [isLiked, setIsLiked] = useState(false); // Estado para saber si la canción está en favoritos
    const soundRef = useRef(null);
    const intervalRef = useRef(null);
    const [lyrics, setLyrics] = useState([]); // New state for lyrics
    const [showLyrics, setShowLyrics] = useState(false); // Toggle for showing/hiding lyrics
    const [premium, setPremium] = useState(false);

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

    // Funcion para obtener los daily_skips del usuario
    const obtenerDailySkips = async() => {
        const token = localStorage.getItem("token");  // Asumimos que el token JWT está en el localStorage

        if (!token) {
            console.error("Token no proporcionado");
            return;
        }

        const response = await apiFetch(`/user/${userId}`, {
            method: "GET",
        });

        // Verificar el tipo de respuesta
        console.log('Response:', response);

        const result = response;

        console.log("Cambio dailySkips", result, result.dailySkips);

        setDailySkips(result.dailySkips);
        setPremium(result.is_premium);

        console.log(dailySkips);
    };

    // Función para actualizar el estilo favorito del usuario
    const updateUserFavoriteStyle = async () => {
        try {
            const token = localStorage.getItem("token");  // Asumimos que el token JWT está en el localStorage

            if (!token) {
                console.error("Token no proporcionado");
                return;
            }

            const response = await apiFetch("/user/updateStyle", {
                method: "POST",  // Utilizamos POST para enviar los datos
                headers: {
                    "Authorization": `Bearer ${token}`,  // Enviamos el token en los encabezados
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Estilo favorito actualizado:", data.style_fav);
            } else {
                console.error("Error al actualizar el estilo favorito:", data.error);
            }
        } catch (error) {
            console.error("Error en la actualización del estilo favorito:", error);
        }
    };

    useEffect(() => {
        console.log("🎵 Player detecta cambio de canción:", currentSong);
    }, [currentSong]);

    useEffect(() => {
        console.log("🎵 Player detecta cambio de playing:", isPlaying);
    }, [isPlaying]);

    useEffect(() => {
        obtenerDailySkips();
        console.log("Obteiendo daily skips del usuario", dailySkips);
    }, [currentSong, userId]);

    const prevTime = useRef(0);

    const getLastPlaybackState = async () => {
        try {
            const response = await apiFetch(`/lastPlaybackState/${userId}`, {
                method: "GET",
            });

            // Verificar el tipo de respuesta
            console.log('Response:', response);

            const result = response;
            console.log("🎧 Última canción reproducida:", result);

            if (result && result.song) {
                const songs = result.playlist && result.playlist.songs ? result.playlist.songs : [];
                const songIndex = songs.findIndex(song => song.id === result.song.id);

                if(result.playlist_id === null){
                    setSongActive(result.songId);
                }
                else{
                    setPlaylistActive(result.playlistId);
                }

                // Aquí puedes guardar la playlist en tu contexto si lo necesitas
                setCurrentSong(result.song);
                setCurrentIndex(songIndex !== -1 ? songIndex : 0);
                setCurrTime({ min: result.positionMinutes, sec: result.positionSeconds });
                // Si usas contexto global para las canciones de la playlist:
                if(songs.length > 0)
                {
                    setSongs(songs);
                }
                else
                {
                    setSongs(result.song);
                }
                setLoadingFromSavedState(true);
                setIsPlaying(false);  // true si quieres autoplay
            } else {
                console.warn("No se obtuvo una canción válida o una playlist con canciones");
            }
        } catch (error) {
            console.error("❌ Error al recuperar la última posición de reproducción:", error);
        }
    };


    // Crea o recarga el Howl cuando la songUrl cambia
    useEffect(() => {
        // Verifica que currentSong y songUrl estén disponibles
        if (!currentSong || !songUrl) {
            getLastPlaybackState();
            return;
        }

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

                if (loadingFromSavedState) {
                    const startTime = currTime.min * 60 + currTime.sec;  // convertir a segundos
                    sound.seek(startTime);
                    console.log("Cargando canción desde posición guardada:", startTime, "segundos");
                    setLoadingFromSavedState(false); // Reset the flag after use
                } else {
                    // Start from beginning otherwise
                    sound.seek(0);
                    setCurrTime({ min: 0, sec: 0 });
                    setSeconds(0);
                    console.log("Cargando canción desde el principio");
                }

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
                    });  // Intervalo de actualización de tiempo
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
        const fetchLyrics = async () => {  // Define an async function inside useEffect
            if (currentSong) {  // Add a check if currentSong exists
                try {
                    // Get the exact song name
                    const songName = currentSong.name;

                    // Add .lrc extension if not already present
                    const lrcFilename = songName.endsWith('.lrc') ? songName : songName + '.lrc';

                    // Encode the filename for URL
                    const encodedFilename = encodeURIComponent(lrcFilename);

                    console.log("Fetching lyrics:", encodedFilename);

                    const response = await fetch(`http://localhost:5001/lyrics/${encodedFilename}`);
                    if (response.ok) {
                        const lrcText = await response.text();
                        const parsedLyrics = parseLRC(lrcText);
                        setLyrics(parsedLyrics);
                        setShowLyrics(true);
                        console.log("Lyrics loaded successfully");
                    } else {
                        console.log("Lyrics not found:", response.status);
                        setLyrics([]);
                        setShowLyrics(false);
                    }
                } catch (error) {
                    console.error("Error fetching lyrics:", error);
                    setLyrics([]);
                    setShowLyrics(false);
                }
            } else {
                // Handle case when currentSong is null or undefined
                setLyrics([]);
                setShowLyrics(false);
            }
        };

        fetchLyrics();  // Call the async function
    }, [currentSong]);

    // Add this right before your fetchLyrics useEffect
    useEffect(() => {
        console.log("Current song:", currentSong);
        if (currentSong) {
            console.log("Has lrcFilename?", !!currentSong.lrcFilename);
            console.log("lrcFilename value:", currentSong.lrcFilename);
        }
    }, [currentSong]);

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
        if(isPlaying) {
            // Si la canción se va a pausar, actualizar el tiempo
            const state = false;
            updateLastPlaybackState(state);
        }
        setIsPlaying(!isPlaying);
    };

    const updateLastPlaybackState = async (value, songId = null) => {
        if (!userId) return;

        const songToUse = songId || (currentSong ? currentSong.id : null);
        if (!songToUse) return;

        const timeInSeconds = soundRef.current ? soundRef.current.seek() : 0;
        const positionMinutes = Math.floor(timeInSeconds / 60);
        const positionSeconds = Math.floor(timeInSeconds % 60);

        let playlist = null;
        if(playlistActive !== 0) { playlist = playlistActive; }

        try {
            let response;
            if(value){
                response = await apiFetch(`/lastPlaybackState/${userId}`, {
                    method: "POST",
                    body: {
                        positionMinutes: 0,
                        positionSeconds: 0,
                        songId: songToUse,
                        playlistId: playlist,
                    },
                });
            }
            else{
                response = await apiFetch(`/lastPlaybackState/${userId}`, {
                    method: "POST",
                    body: {
                        positionMinutes: positionMinutes,
                        positionSeconds: positionSeconds,
                        songId: songToUse,
                        playlistId: playlist,
                    },
                });
            }

            const result = response;
            console.log("Última posición de reproducción actualizada:", result);
        } catch (error) {
            console.error("Error al actualizar la última posición de reproducción:", error);
        }
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
        const prevSong = songs[prevIndex];

        setCurrentIndex(prevIndex);
        setCurrentSong(prevSong);
        setIsPlaying(true);
        setSeconds(0);

        // Pass the new song ID directly
        updateLastPlaybackState(true, prevSong.id);
        console.log("Reproduciendo desde flecha anterior");
    };

    // FUncion para actualizar los dailyskips
    const updateDailySkips = async () => {
        try{
            const response = await apiFetch(`/user/use-daily-skip/${userId}`, {
                method: "POST",
            });

            console.log("Última posición de reproducción actualizada:", response);
        } catch (error) {
            console.error("Error al actualizar el daily skip:", error);
        }
    };

    useEffect(() => {
        updateDailySkips();
        console.log("Actualizacion de los skips diarrios");
    },[dailySkips]);

    // Ir a la canción siguiente
    const handleNext = () => {
        if (!songs.length) return;
        const nextIndex = (currentIndex + 1) % songs.length;
        const nextSong = songs[nextIndex];

        if(!premium){
            if(dailySkips !== 0){
                setCurrentIndex(nextIndex);
                setCurrentSong(nextSong);
                setIsPlaying(true);
                setSeconds(0);
                setDailySkips(dailySkips-1);
                console.log("Cambiando daily SKIPS boton handle next:", dailySkips);
            }
        }
        else{
            setCurrentIndex(nextIndex);
            setCurrentSong(nextSong);
            setIsPlaying(true);
            setSeconds(0);
        }

        // Pass the new song ID directly
        updateLastPlaybackState(true, nextSong.id);
        console.log("Reproduciendo desde flecha siguiente");
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

            // Actualizar estilo favorito después de dar like a la canción
            updateUserFavoriteStyle();
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
                        onClick={() => currentSong?.type !== "anuncio" && handlePrevious()}
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
                        onClick={() => currentSong?.type !== "anuncio" && handleNext()}
                        disabled={noSongSelected}
                    >
                        <IconContext.Provider value={{size: "3em", color: "#21a1f1"}}>
                            <BiSkipNext/>
                        </IconContext.Provider>
                    </button>
                </div>
            </div>

            {/* Botón "Me Gusta" en un contenedor aparte */}
            {currentSong?.type !== "anuncio" && (
                <div className={styles.likeButtonContainer}>
                    <button
                        className={styles.likeButton}
                        onClick={toggleLike}
                        disabled={noSongSelected}
                    >
                        {isLiked ? <AiFillHeart color="#E74C3C" /> : <AiOutlineHeart color="#E74C3C" />}
                    </button>
                </div>
            )}
            {!noSongSelected && (
                <div className={styles.lyricsButtonContainer}>
                    <button
                        className={styles.lyricsToggle}
                        onClick={() => {
                            console.log("Toggle lyrics button clicked. Current lyrics state:", showLyrics);
                            console.log("Lyrics array length:", lyrics.length);
                            setShowLyrics(!showLyrics);
                        }}
                        disabled={lyrics.length === 0} // Disable if no lyrics found
                    >
                        {lyrics.length > 0 ?
                            (showLyrics ? "Ocultar letra" : "Mostrar letra") :
                            "No hay letra disponible"}
                    </button>
                </div>
            )}

            {/* Letras sincronizadas */}
            {showLyrics && lyrics.length > 0 && (
                <div className={styles.lyricsContainer}>
                    <SynchronizedLyrics
                        lyrics={lyrics}
                        currentTime={seconds}
                    />
                </div>
            )}

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