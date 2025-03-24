import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./components/Player/PlayerContext.jsx";

// Layout principal
import MainLayout from "./layout/MainLayout/MainLayout";

// Páginas principales
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Register1 from "./pages/Register/Register1";
import Register2 from "./pages/Register/Register2";
import Register3 from "./pages/Register/Register3";
import TerminosYCondiciones from "./pages/Register/TerminosYCondiciones";
import PoliticaPrivacidad from "./pages/Register/PoliticaPrivacidad";
import Playlist from "./pages/Playlist/Playlist";
import Library from "./pages/Library/Library";
import AccountInfo from "./pages/AccountInfo/AccountInfo";

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
                    <Route path="/account" element={<AccountInfo />} /> {/* <-- MUEVE AQUÍ */}

                    {/* Páginas con layout principal */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="home" element={<Home />} />
                        <Route path="playlist/:playlistId" element={<Playlist />} />
                        <Route path="library" element={<Library />} />
                    </Route>
                </Routes>

            </Router>
        </PlayerProvider>
    );
}

export default App;
