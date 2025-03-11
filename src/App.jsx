// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Subs from "./Subs/Subs";
import Menu from "./Menu/Menu";
import HelloBye from "./HelloBye/HelloBye";
import Playlist from "./Playlist/Playlist";
import AccountInfo from "./AccountInfo/AccountInfo";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/subs" element={<Subs />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/hellobye" element={<HelloBye />} />
                    <Route path="/playlist/:playlistId" element={<Playlist />} />
                    <Route path="/account" element={<AccountInfo />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
