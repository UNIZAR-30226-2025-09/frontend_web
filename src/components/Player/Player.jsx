import { useEffect, useState, useRef } from "react";
import { Howl } from "howler";
import { usePlayer } from "./PlayerContext.jsx";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";  // Iconos de corazón
import { IconContext } from "react-icons";
import { getImageUrl } from "#utils/getImageUrl";
import styles from "./PlayerStyles.module.css";
import {apiFetch, MEDIA_URL} from "#utils/apiFetch";
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
    const [artistDetails, setArtistDetails] = useState(null);
    const [songArtists, setSongArtists] = useState([]); // Estado para almacenar los artistas de la canción
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null; // Evitar errores si el usuario no está logueado

    const isDraggingRef = useRef(false);
    const userSetTimeRef = useRef(null);
    const updateIntervalId = useRef(null);

    // Para saber si hay o no canción seleccionada:
    const noSongSelected = !currentSong;

    // Obtenemos la URL de la canción
    const songUrl = currentSong?.url_mp3
        ? currentSong.url_mp3.startsWith("http")
            ? currentSong.url_mp3
            : `${MEDIA_URL}/${currentSong.url_mp3.replace(/^\/?/, "")}`
        : null;


    // Utilizamos la API específica para obtener los artistas de una canción
    const fetchArtistsForSong = async (songId) => {
        if (!songId) {
            console.log("No song ID provided to fetch artists");
            return;
        }

        try {
            const response = await apiFetch(`/songs/${songId}/artists`);
            console.log("Artists for song fetched:", response);

            if (response && response.artists && Array.isArray(response.artists) && response.artists.length > 0) {
                // Guardar todos los artistas de la canción en el estado
                setSongArtists(response.artists);

                // También podemos establecer el artista principal (el primero) para detalles
                if (response.artists[0]) {
                    setArtistDetails(response.artists[0]);
                }

                return response.artists;
            } else {
                console.warn("No artists found for this song or unexpected response format");
                setSongArtists([]);
                setArtistDetails(null);
                return [];
            }
        } catch (error) {
            console.error("Error fetching artists for song:", error);
            setSongArtists([]);
            setArtistDetails(null);
            return [];
        }
    };

// Efecto para cargar los artistas cuando cambia la canción
    useEffect(() => {
        if (!currentSong || !currentSong.id) {
            console.log("No valid song selected to fetch artists");
            setSongArtists([]);
            setArtistDetails(null);
            return;
        }

        console.log("Current song changed, fetching artists:", currentSong);
        fetchArtistsForSong(currentSong.id);
    }, [currentSong]);

// Función para obtener el nombre de los artistas
    const getArtistName = () => {
        if (noSongSelected) {
            return "Selecciona una canción de la lista";
        }

        if (!currentSong) {
            return "No hay canción seleccionada";
        }

        // Si tenemos la lista de artistas cargada
        if (songArtists && Array.isArray(songArtists) && songArtists.length > 0) {
            // Unir todos los nombres de artistas separados por coma
            return songArtists.map(artist => artist.name).join(", ");
        }

        // Si tenemos el artista principal en artistDetails
        if (artistDetails && artistDetails.name) {
            return artistDetails.name;
        }

        // Si los artistas están cargando, mostramos mensaje de carga
        if (currentSong.id) {
            return "Cargando artistas...";
        }

        return "Artista desconocido";
    };
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
    }, [userId]);

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
                console.log("Canción cargada:", currentSong.name);
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

                // Modifica la función onend dentro del useEffect que crea el objeto Howl
                onend: () => {
                    console.log("🔚 onend: canción finalizada");
                    // Comprobar si la canción actual es un anuncio
                    if (currentSong && currentSong.type === "anuncio") {
                        console.log("Anuncio finalizado, reproduciendo siguiente canción");
                        handleNext(true); // Pasar true para indicar que viene de un anuncio
                    } else {
                        console.log("Canción normal finalizada, pasando a la siguiente");
                        handleNext(); 
                    }
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
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

                    const response = await fetch(`${MEDIA_URL}/lyrics/${encodedFilename}`);
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
                // Usar apiFetch en lugar de fetch directo
                const data = await apiFetch(`/song_like/${currentSong.id}/like?userId=${userId}`, {
                    method: 'GET'
                });

                console.log("useEffect - Respuesta del endpoint checkIfLiked:", data);
                setIsLiked(data.isLiked);


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

        // Limpia el intervalo anterior si existe
        if (updateIntervalId.current) {
            clearInterval(updateIntervalId.current);
            updateIntervalId.current = null;
        }

        // Revisa si la canción está reproduciéndose
        const isSoundPlaying = soundRef.current.playing();

        // Si isPlaying es true y no está sonando, reproducir
        if (isPlaying && !isSoundPlaying) {
            console.log("Reproduciendo canción");
            soundRef.current.play();
            
            // Configura un nuevo intervalo para actualizar el tiempo
            updateIntervalId.current = setInterval(() => {
                // Solo actualiza si no se está arrastrando la barra
                if (!isDraggingRef.current) {
                    const sec = soundRef.current.seek();
                    // Solo actualiza si ha cambiado
                    if (Math.abs(sec - prevTime.current) > 0.1) {
                        setSeconds(sec);
                        setCurrTime({
                            min: Math.floor(sec / 60),
                            sec: Math.floor(sec % 60),
                        });
                        prevTime.current = sec;
                    }
                }
            }, 500); // Reducir la frecuencia de actualización
        }
        // Si isPlaying es false y está sonando, pausar
        else if (!isPlaying && isSoundPlaying) {
            console.log("Pausando canción");
            soundRef.current.pause();
            // Limpia el intervalo cuando se pausa
            if (updateIntervalId.current) {
                clearInterval(updateIntervalId.current);
                updateIntervalId.current = null;
            }
        }

        // Limpia el intervalo cuando se desmonte el componente
        return () => {
            if (updateIntervalId.current) {
                clearInterval(updateIntervalId.current);
                updateIntervalId.current = null;
            }
        };

    }, [isPlaying, currentSong]);

    // Mover la barra de progreso
    const handleTimelineChange = (e) => {
        if (!soundRef.current) return;
        
        const newPosition = parseFloat(e.target.value);
        userSetTimeRef.current = newPosition;
        
        // Actualiza la interfaz inmediatamente para mejor respuesta
        setSeconds(newPosition);
        setCurrTime({
            min: Math.floor(newPosition / 60),
            sec: Math.floor(newPosition % 60),
        });
        
        // Actualiza la posición del audio
        soundRef.current.seek(newPosition);
        prevTime.current = newPosition;
    };

    // Añade estos controladores para el arrastre
    const handleTimelineDragStart = () => {
        isDraggingRef.current = true;
    };

    const handleTimelineDragEnd = () => {
        isDraggingRef.current = false;
        // Asegurarse de que la posición final se aplique
        if (userSetTimeRef.current !== null && soundRef.current) {
            soundRef.current.seek(userSetTimeRef.current);
            userSetTimeRef.current = null;
        }
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

    // Ir a la canción siguiente
    const handleNext = (fromAd = false) => {
        if (!songs.length) return;
        const nextIndex = (currentIndex + 1) % songs.length;
        const nextSong = songs[nextIndex];

        // Si viene de un anuncio o el usuario es premium, no verificar los skips
        if (fromAd || premium) {
            setCurrentIndex(nextIndex);
            setCurrentSong(nextSong);
            setIsPlaying(true);
            setSeconds(0);
            
            // Pass the new song ID directly
            updateLastPlaybackState(true, nextSong.id);
            console.log("Reproduciendo desde anuncio finalizado o usuario premium");
            return;
        }

        // Lógica normal para usuarios no premium
        if (dailySkips !== 0) {
            setCurrentIndex(nextIndex);
            setCurrentSong(nextSong);
            setIsPlaying(true);
            setSeconds(0);
            console.log("Cambiando dailySKips antes: ", dailySkips);
            setDailySkips(dailySkips - 1);
            updateDailySkips();
            console.log("Cambiando daily SKIPS boton handle next:", dailySkips);
        } else {
            console.log("No quedan skips disponibles");
        }

        // Pass the new song ID directly
        updateLastPlaybackState(true, nextSong.id);
        console.log("Reproduciendo desde flecha siguiente");
    };


    const toggleLike = async () => {
        try {
            // Obtener o crear la playlist "Me Gusta"
            const likedPlaylistRes = await apiFetch('/playlists/songliked', {
                method: 'POST',
                body: {
                    user_id: userId,
                },
            });

            console.log("Playlist de Me Gusta obtenida/creada:", likedPlaylistRes.playlist);
            const playlistId = likedPlaylistRes.playlist.id;

            // Agregar la canción a esa playlist
            const songId = currentSong.id;
            const likeResponse = await apiFetch(`/song_like/${songId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    user_id: userId,
                    playlist_id: playlistId,
                },
            });

            console.log("Respuesta del servidor:", likeResponse);
            setIsLiked(likeResponse.liked);

            // Actualizar estilo favorito
            updateUserFavoriteStyle();
        } catch (error) {
            console.error("Error al agregar/eliminar el like", error);
        }
    };
    // Función para depurar y verificar la estructura de datos de la canción actual
    const debugSongData = () => {
        console.group("Información de depuración de canción actual");
        console.log("ID de la canción:", currentSong?.id);
        console.log("Título de la canción:", currentSong?.title || currentSong?.name);
        console.log("Estado de artistas cargados:", songArtists);
        console.log("Detalles del artista principal:", artistDetails);
        console.groupEnd();
    };
    useEffect(() => {
        if (currentSong) {
            debugSongData();
        }
    }, [currentSong]);
    return (
        <div className={styles.playerContainer}>
            {/* Portada de la canción */}
            {noSongSelected ? (
                <div className={styles.noSongPlaceholder}>
                    <div className={styles.emojiIcon}>🎵</div>
                    <div className={styles.placeholderText}>
                        Sin canción seleccionada
                    </div>
                </div>
            ) : (
                <img
                    className={styles.musicCover}
                    src={getImageUrl(currentSong.photo_video)}
                    alt="Portada de la canción"
                    onError={(e) => (e.target.src = "/default-song.jpg")}
                />
            )}

            {/* Información de la canción */}
            <div className={styles.info}>
                <h3 className={styles.songTitle}>
                    {noSongSelected ? "Ninguna canción seleccionada" : currentSong.name}
                </h3>
                <p className={styles.songArtist}>
                    {getArtistName()}
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
                        className={`${styles.playerControlPlay} ${isPlaying ? styles.playing : ''}`}
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
                        disabled={!lyrics || lyrics.length === 0} // Disable if no lyrics found
                    >
                        {lyrics && lyrics.length > 0 ?
                            (showLyrics ? "Ocultar letra" : "Mostrar letra") :
                            "No hay letra disponible"}
                    </button>
                </div>
            )}

            {/* Letras sincronizadas */}
            {showLyrics && lyrics && lyrics.length > 0 && (
                <SynchronizedLyrics
                    lyrics={lyrics}
                    currentTime={seconds}
                />

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
                    onMouseDown={handleTimelineDragStart}
                    onMouseUp={handleTimelineDragEnd}
                    onTouchStart={handleTimelineDragStart}
                    onTouchEnd={handleTimelineDragEnd}
                    disabled={noSongSelected}
                />
            </div>

        </div>
    );
}

export default Player;