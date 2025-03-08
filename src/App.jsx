// App.jsx
import React from "react";
import { PlayerProvider } from "./Reproductor/PlayerContext";
import SongList from "./Reproductor/SongList";
import Player from "./Reproductor/Player";
import "./App.css";

function App() {
    return (
        <PlayerProvider>
            <div className="app-container">
                <header className="app-header">
                    <h1>React Music Player</h1>
                </header>

                <main className="app-main">
                    <aside className="sidebar">
                        <SongList />
                    </aside>
                    <section className="main-content">
                        <h2>Seleccione una canción de la lista...</h2>
                    </section>
                </main>

                {/* Reproductor al final, ancho completo */}
                <Player />
            </div>
        </PlayerProvider>
    );
}

export default App;
