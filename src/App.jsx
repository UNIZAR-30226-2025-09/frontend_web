import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Subs from "./Subs/Subs"; // Importa el componente Subs
import ProfileDropdown from "./Profile/Profile"; // Importa el menú desplegable
import AccountInfo from "./AccountInfo/AccountInfo"; // Importa AccountInfo

function App() {
  return (
    <Router> {/* Mueve Router al nivel superior */}
      <div className="app-container">
        <ProfileDropdown /> {/* Esto ya estará dentro del Router */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} /> {/* Asegura que esta ruta exista */}
          <Route path="/register" element={<Register />} />
          <Route path="/subs" element={<Subs />} />
          <Route path="/account" element={<AccountInfo />} /> {/* Nueva ruta */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
