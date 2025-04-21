import React, { useEffect, useState, useRef } from 'react';
import "./SynchronizedLyrics.css";

const SynchronizedLyrics = ({ lyrics, currentTime }) => {
    const [activeLineIndex, setActiveLineIndex] = useState(0);
    const lyricsContainerRef = useRef(null);
    const activeLyricRef = useRef(null);

    // Reinicia el scroll cuando cambian las lyrics
    useEffect(() => {
        if (lyricsContainerRef.current) {
            lyricsContainerRef.current.scrollTop = 0;
        }
        setActiveLineIndex(0); // Reinicia también el índice activo
    }, [lyrics]);

    // Actualiza la línea activa según el tiempo actual
    useEffect(() => {
        const currentIndex = lyrics.findIndex((line, index) => {
            const nextLine = lyrics[index + 1];
            if (!nextLine) return true; // Última línea
            return currentTime >= line.time && currentTime < nextLine.time;
        });

        if (currentIndex !== -1 && currentIndex !== activeLineIndex) {
            setActiveLineIndex(currentIndex);
        }
    }, [currentTime, lyrics, activeLineIndex]);

    // Centra la línea activa en el contenedor
    useEffect(() => {
        if (activeLyricRef.current && lyricsContainerRef.current) {
            const container = lyricsContainerRef.current;
            const activeLine = activeLyricRef.current;

            const offsetTop = activeLine.offsetTop;
            const lineHeight = activeLine.offsetHeight;
            const containerHeight = container.clientHeight;

            const scrollPosition = offsetTop - containerHeight / 2 + lineHeight / 2;

            container.scrollTo({
                top: Math.max(0, scrollPosition),
                behavior: 'smooth'
            });
        }
    }, [activeLineIndex]);

    return (
        <div className="lyricsContainer" ref={lyricsContainerRef}>
            {lyrics.map((line, index) => (
                <div
                    key={`${line.time}-${index}`} // clave única incluso si hay texto repetido
                    ref={index === activeLineIndex ? activeLyricRef : null}
                    className={`lyricsLine ${index === activeLineIndex ? 'activeLine' : ''}`}
                >
                    {line.text}
                </div>
            ))}
        </div>
    );
};

export default SynchronizedLyrics;
