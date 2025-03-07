import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Subs from "./Subs/Subs";
import Menu from "./Menu/Menu"; // Importa el componente Menu
import ProfileDropdown from "./Profile/Profile";
import HelloBye from "./HelloBye/HelloBye.jsx";
import Playlist from "./Playlist/Playlist.jsx";
import Reproductor from "./Reproductor/Reproductor.jsx"; // Importa el reproductor

function App() {
    return (
        <Router>
            <div className="app-container">
                <ProfileDropdown /> {/* Menú desplegable */}
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/subs" element={<Subs />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/hellobye" element={<HelloBye />} />
                    <Route path="/playlist" element={<Playlist />} />
                </Routes>
                <Reproductor
                    songId={1}
                    songTitle="Canción de Prueba"
                    songArtist="Artista de Prueba"
                    songCover="https://via.placeholder.com/150"
                />
            </div>
        </Router>
    );
}

export default App;
