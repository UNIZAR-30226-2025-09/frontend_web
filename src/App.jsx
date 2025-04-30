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
import Register4 from "./pages/Register/Register4.jsx";
import Register3 from "./pages/Register/Register3.jsx"
import TerminosYCondiciones from "./pages/Register/TerminosYCondiciones";
import PoliticaPrivacidad from "./pages/Register/PoliticaPrivacidad";
import QuienesSomos from "./pages/Register/QuienesSomos";
import Playlist from "./pages/Playlist/Playlist";
import Library from "./pages/Library/Library";
import AccountInfo from "./pages/AccountInfo/AccountInfo";
import EditAccountInfo from "./pages/EditAccountInfo/EditAccountInfo";
import Plans from "./pages/Plans/Plans";
import Checkout from "./pages/Checkout/Checkout";
import Song from "./pages/Song/Song.jsx";
import Friends from "./pages/Friends/Friends";

import Contacto from "./pages/Register/Contacto.jsx";
import ForgotPassword from "./pages/Password/ForgotPassword.jsx";
import ResetPassword from "./pages/Password/ResetPassword.jsx";
import SearchPage from './pages/SearchPage/SearchPage';
import Help from "./pages/Help/Help.jsx";

import ScrollToTop from "./components/Scroll/ScrollToTop.jsx";

function App() {

    return (
        <PlayerProvider>
            <Router>
                <ScrollToTop /> {/* Componente para resetear el scroll */}
                <Routes>
                    {/* Rutas sin layout */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/register1" element={<Register1 />} />
                    <Route path="/register2" element={<Register2 />} />
                    <Route path="/register3" element={<Register3 />} />
                    <Route path="/register4" element={<Register4 />} />
                    <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
                    <Route path="/terminos-condiciones" element={<TerminosYCondiciones />} />
                    <Route path="/quienes-somos" element={<QuienesSomos />} />

                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    <Route path="/plans" element={<Plans />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/account" element={<AccountInfo />} />
                    <Route path="/EditAccount" element={<EditAccountInfo />} />
                    <Route path="/help" element={<Help />} />

                    {/* Páginas con layout principal */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="home" element={<Home />} />
                        <Route path="playlist/:playlistId" element={<Playlist />} />
                        <Route path="/songs/:songId" element={<Song />} />
                        <Route path="friends" element={<Friends />} />
                        <Route path="library" element={<Library />} />
                        <Route path="artist" element={<Artist />} />
                        <Route path="artist/:artistId" element={<Artist />} />

                        <Route path="/search" element={<SearchPage />} />

                    </Route>
                </Routes>

            </Router>
        </PlayerProvider>
    );
}

export default App;
