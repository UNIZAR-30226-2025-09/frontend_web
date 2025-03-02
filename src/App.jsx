import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Subs from "./Subs/Subs"; // Importa el componente Subs
import ProfileDropdown from "./Profile/Profile"; // Importa el menú desplegable

function App() {
  return (
    <div className="app-container">
      <ProfileDropdown /> {/* Aquí se muestra el menú desplegable */}

      <Router> {/* Asegura que Router envuelve todo */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/subs" element={<Subs />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

