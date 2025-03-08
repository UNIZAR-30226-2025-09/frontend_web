// src/Reproductor/Player.jsx
import React, { useEffect, useState, useRef } from "react";
import { Howl } from 'howler';
import { usePlayer } from "./PlayerContext";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { IconContext } from "react-icons";
import "./Player.css";

function Player() {
    const { currentSong } = usePlayer();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currTime, setCurrTime] = useState({ min: 0, sec: 0 });
    const [totalTime, setTotalTime] = useState({ min: 0, sec: 0 });
    const [seconds, setSeconds] = useState(0);
    const [duration, setDuration] = useState(0);

    const soundRef = useRef(null);
    const intervalRef = useRef(null);

    const songUrl = currentSong?.url_mp3
        ? currentSong.url_mp3.startsWith("http")
            ? currentSong.url_mp3
            : `http://localhost:5000/${currentSong.url_mp3.replace(/^\/?/, "")}`
        : null;

    console.log("URL de la canción en el frontend:", songUrl);

    useEffect(() => {
        if (!songUrl) return;

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
            format: ['mp3'],
            onload: () => {
                console.log("Sonido cargado correctamente:", songUrl);
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
                console.log("Sonido en reproducción");
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
                console.log("Sonido en pausa");
                setIsPlaying(false);
                clearInterval(intervalRef.current);
            },
            onstop: () => {
                console.log("Sonido detenido");
                setIsPlaying(false);
                clearInterval(intervalRef.current);
            },
            onend: () => {
                console.log("Sonido finalizado");
                setIsPlaying(false);
                clearInterval(intervalRef.current);
            },
            onloaderror: (id, error) => {
                console.error("Error cargando el sonido:", error);
            },
            onplayerror: (id, error) => {
                console.error("Error reproduciendo el sonido:", error);
                sound.once('unlock', () => {
                    sound.play();
                });
            }
        });

        soundRef.current = sound;

    }, [songUrl]);

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

    const playingButton = () => {
        if (!soundRef.current) return;

        if (isPlaying) {
            console.log("Pausando canción");
            soundRef.current.pause();
        } else {
            console.log("Reproduciendo canción");
            soundRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimelineChange = (e) => {
        if (!soundRef.current) return;

        const newPosition = parseFloat(e.target.value);
        soundRef.current.seek(newPosition);
        setSeconds(newPosition);
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
                        <p className="artist">{currentSong?.artists?.map(a => a.name).join(', ') || "Desconocido"}</p>
                    </div>
                    <div className="controls">
                        <button className="controlButton">
                            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
                                <BiSkipPrevious />
                            </IconContext.Provider>
                        </button>
                        <button className="controlButton" onClick={playingButton}>
                            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
                                {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
                            </IconContext.Provider>
                        </button>
                        <button className="controlButton">
                            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
                                <BiSkipNext />
                            </IconContext.Provider>
                        </button>
                    </div>
                    <div className="timelineContainer">
                        <div className="time">
                            <p>
                                {currTime.min}:{currTime.sec < 10 ? `0${currTime.sec}` : currTime.sec}
                            </p>
                            <p>
                                {totalTime.min}:{totalTime.sec < 10 ? `0${totalTime.sec}` : totalTime.sec}
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
