// src/Reproductor/Player.jsx
import React, { useEffect, useState, useRef } from "react";
import { Howl } from "howler";
import { usePlayer } from "./PlayerContext";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { IconContext } from "react-icons";
import "./Player.css";

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

    // Obtenemos la URL de la canción
    const songUrl = currentSong?.url_mp3
        ? currentSong.url_mp3.startsWith("http")
            ? currentSong.url_mp3
            : `http://localhost:5000/${currentSong.url_mp3.replace(/^\/?/, "")}`
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
                //Opcional: reproducir automáticamente al cargar
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
        <div className="player-container">
            {currentSong ? (
                <>
                    <img
                        className="musicCover"
                        src={currentSong.cover}
                        alt="Portada de la canción"
                    />
                    <div className="info">
                        <h3 className="title">{currentSong?.name || "Sin título"}</h3>
                        <p className="artist">
                            {currentSong?.artists?.map((a) => a.name).join(", ") || "Desconocido"}
                        </p>
                    </div>
                    <div className="controls">
                        <button className="controlButton" onClick={handlePrevious}>
                            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
                                <BiSkipPrevious />
                            </IconContext.Provider>
                        </button>
                        <button className="controlButton" onClick={playingButton}>
                            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
                                {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
                            </IconContext.Provider>
                        </button>
                        <button className="controlButton" onClick={handleNext}>
                            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
                                <BiSkipNext />
                            </IconContext.Provider>
                        </button>
                    </div>
                    <div className="timelineContainer">
                        <div className="time">
                            <p>
                                {currTime.min}:
                                {currTime.sec < 10 ? `0${currTime.sec}` : currTime.sec}
                            </p>
                            <p>
                                {totalTime.min}:
                                {totalTime.sec < 10 ? `0${totalTime.sec}` : totalTime.sec}
                            </p>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={duration ? duration / 1000 : 0}
                            value={seconds}
                            className="timeline"
                            onChange={handleTimelineChange}
                        />
                    </div>
                </>
            ) : (
                <p>No se ha seleccionado ninguna canción</p>
            )}
        </div>
    );
}

export default Player;
