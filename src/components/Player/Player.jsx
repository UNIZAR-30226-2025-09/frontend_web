
import React, { useEffect, useState, useRef } from "react";
import { Howl } from "howler";
import { usePlayer } from "./PlayerContext.jsx";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { IconContext } from "react-icons";

/* Importa las clases desde tu archivo CSS Module */
import styles from "./PlayerStyles.module.css";

function Player() {
    const {
        songs,
        currentSong,
        setCurrentSong,
        currentIndex,
        setCurrentIndex
    } = usePlayer();

    const [isPlaying, setIsPlaying] = useState(false);
    const [currTime, setCurrTime] = useState({ min: 0, sec: 0 });
    const [totalTime, setTotalTime] = useState({ min: 0, sec: 0 });
    const [seconds, setSeconds] = useState(0);
    const [duration, setDuration] = useState(0);

    const soundRef = useRef(null);
    const intervalRef = useRef(null);

    // Para saber si hay o no canción seleccionada:
    const noSongSelected = !currentSong;

    // Obtenemos la URL de la canción
    const songUrl = currentSong?.url_mp3
        ? currentSong.url_mp3.startsWith("http")
            ? currentSong.url_mp3
            : `http://localhost:5001/${currentSong.url_mp3.replace(/^\/?/, "")}`
        : null;

    // Crea o recarga el Howl cuando la songUrl cambia
    useEffect(() => {
        if (!songUrl) return;

        // Limpia cualquier instancia previa de Howl y su intervalo
        if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.unload();
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        const sound = new Howl({
            src: [songUrl],
            html5: true,
            volume: 1.0,
            format: ["mp3"],
            onload: () => {
                const sec = sound.duration();
                setDuration(sec * 1000);
                setTotalTime({
                    min: Math.floor(sec / 60),
                    sec: Math.floor(sec % 60),
                });
                // Opcional: reproducir automáticamente al cargar
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
            onpause: () => {
                setIsPlaying(false);
                clearInterval(intervalRef.current);
            },
            onstop: () => {
                setIsPlaying(false);
                clearInterval(intervalRef.current);
            },
            onend: () => {
                setIsPlaying(false);
                clearInterval(intervalRef.current);
            },
            onloaderror: (id, error) => {
                console.error("Error cargando el sonido:", error);
            },
            onplayerror: (id, error) => {
                console.error("Error reproduciendo el sonido:", error);
                sound.once("unlock", () => {
                    sound.play();
                });
            },
        });

        soundRef.current = sound;
    }, [songUrl]);

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.stop();
                soundRef.current.unload();
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

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

    return (
        <div className={styles.playerContainer}>
            {/* Siempre mostramos la portada, aunque no haya canción. */}
            <img
                className={styles.musicCover}
                src={
                    noSongSelected
                        ? "https://via.placeholder.com/300x300.png?text=Sin+Canci%C3%B3n"
                        : currentSong.cover
                }
                alt={noSongSelected ? "Sin canción seleccionada" : "Portada de la canción"}
            />

            {/* Siempre mostramos info, aunque esté vacía o con un placeholder */}
            <div className={styles.info}>
                <h3 className={styles.title}>
                    {noSongSelected ? "Ninguna canción seleccionada" : currentSong.name}
                </h3>
                <p className={styles.artist}>
                    {noSongSelected
                        ? "Selecciona una canción de la lista"
                        : (currentSong?.artists?.map((a) => a.name).join(", ") || "Desconocido")}
                </p>
            </div>

            <div className={styles.controls}>
                <button
                    className={styles.controlButton}
                    onClick={handlePrevious}
                    disabled={noSongSelected}
                >
                    <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
                        <BiSkipPrevious />
                    </IconContext.Provider>
                </button>

                {/* Botón de Play/Pause con estilo circular */}
                <button
                    className={styles.playerControlPlay}
                    onClick={playingButton}
                    disabled={noSongSelected}
                >
                    <IconContext.Provider value={{ size: "3em", color: "#ffffff" }}>
                        {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
                    </IconContext.Provider>
                </button>

                <button
                    className={styles.controlButton}
                    onClick={handleNext}
                    disabled={noSongSelected}
                >
                    <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
                        <BiSkipNext />
                    </IconContext.Provider>
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
