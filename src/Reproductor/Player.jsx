// src/Reproductor/Player.jsx
import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import { usePlayer } from "./PlayerContext";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { IconContext } from "react-icons";
import "./Player.css";

function Player() {
    const { currentSong } = usePlayer();
    const [isPlaying, setIsPlaying] = useState(false);
    // Asegúrate de que currentSong tenga una propiedad url_mp3 para reproducir
    const [play, { pause, duration, sound }] = useSound(
        currentSong ? currentSong.url_mp3 : null,
        { interrupt: true }
    );
    const [currTime, setCurrTime] = useState({ min: 0, sec: 0 });
    const [totalTime, setTotalTime] = useState({ min: 0, sec: 0 });
    const [seconds, setSeconds] = useState(0);

    console.log("Player renderizado. currentSong:", currentSong);

    // Actualiza la duración cuando se carga la metadata
    useEffect(() => {
        if (duration) {
            const sec = duration / 1000;
            setTotalTime({
                min: Math.floor(sec / 60),
                sec: Math.floor(sec % 60),
            });
            console.log("Duración obtenida:", duration);
        }
    }, [duration]);

    // Actualiza el tiempo actual cada segundo
    useEffect(() => {
        const interval = setInterval(() => {
            if (sound) {
                const sec = sound.seek([]);
                setSeconds(sec);
                setCurrTime({
                    min: Math.floor(sec / 60),
                    sec: Math.floor(sec % 60),
                });
                console.log("Tiempo actual:", sec);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [sound]);

    const playingButton = () => {
        if (isPlaying) {
            console.log("Pausando canción");
            pause();
            setIsPlaying(false);
        } else {
            console.log("Reproduciendo canción");
            play();
            setIsPlaying(true);
        }
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
                        <h3 className="title">{currentSong.title}</h3>
                        <p className="artist">{currentSong.artist}</p>
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
                            onChange={(e) => {
                                if (sound) {
                                    sound.seek([e.target.value]);
                                    console.log("Slider cambiado a:", e.target.value);
                                }
                            }}
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
