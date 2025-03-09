
// App.jsx
import React from "react";
import { PlayerProvider } from "./Reproductor/PlayerContext";
import SongList from "./Reproductor/SongList";
import Player from "./Reproductor/Player";
import "./App.css";

function App() {
    return (
        <PlayerProvider>
          <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/subs" element={<Subs />} />
										<Route path="/login" element={<Login />} /> {/* Asegura que esta ruta exista */}
          					<Route path="/register" element={<Register />} />
                    <Route path="/menu" element={<Menu />} /> {/* Nueva ruta */}
                    <Route path="/hellobye" element={<HelloBye />} />
                    <Route path="/playlist/:playlistId" element={<Playlist/>} />
									  <Route path="/account" element={<AccountInfo />} /> {/* Nueva ruta */}
                </Routes>
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
           </Router>
        </PlayerProvider>
    );
}

export default App;
