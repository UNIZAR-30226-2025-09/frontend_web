import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./components/Player/PlayerContext.jsx";

// Layout principal
import MainLayout from "./layout/MainLayout/MainLayout";

// Páginas principales
import Home from "./pages/Home/Home";
import Artist from "./pages/Artist/Artist";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Register1 from "./pages/Register/Register1";
import Register2 from "./pages/Register/Register2";
import Register3 from "./pages/Register/Register3";
import TerminosYCondiciones from "./pages/Register/TerminosYCondiciones";
import PoliticaPrivacidad from "./pages/Register/PoliticaPrivacidad";
import QuienesSomos from "./pages/Register/QuienesSomos";
import Playlist from "./pages/Playlist/Playlist";
import Library from "./pages/Library/Library";
import AccountInfo from "./pages/AccountInfo/AccountInfo";
import EditAccountInfo from "./pages/EditAccountInfo/EditAccountInfo";
import Plans from "./pages/Plans/Plans";
import Song from "./pages/Song/Song.jsx";

function App() {

    return (
        <PlayerProvider>
            <Router>
                <Routes>
                    {/* Rutas sin layout */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/register1" element={<Register1 />} />
                    <Route path="/register2" element={<Register2 />} />
                    <Route path="/register3" element={<Register3 />} />
                    <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
                    <Route path="/terminos-condiciones" element={<TerminosYCondiciones />} />
                    <Route path="/quienes-somos" element={<QuienesSomos />} />

                    <Route path="/account" element={<AccountInfo />} />
                    <Route path="/EditAccount" element={<EditAccountInfo />} />
                    <Route path="/subs" element={<Plans />} />


                    {/* Páginas con layout principal */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="home" element={<Home />} />
                        <Route path="playlist/:playlistId" element={<Playlist />} />
                        <Route path="/songs/:songId" element={<Song />} />
                        <Route path="library" element={<Library />} />
                        <Route path="artist" element={<Artist />} />
                        <Route path="artist/:artistId" element={<Artist />} />

                    </Route>
                </Routes>

            </Router>
        </PlayerProvider>
    );
}

export default App;