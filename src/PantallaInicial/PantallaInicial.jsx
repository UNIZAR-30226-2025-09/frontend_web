import React from "react";
import "./PantallaInicial.css";
import SidebarLibrary from "../Menu/SidebarLibrary/SidebarLibrary.jsx";
import Header from "../Menu/Header/Header.jsx"; // Ruta corregida

const PantallaInicial = () => {
  return (
    <div className="pantalla-inicial">
      <div className="sidebar">
        <SidebarLibrary />
      </div>
      <Header />
      <div className="main-content">
        <div className="section">
          <h2 className="section-title">Artistas Recientes</h2>
          <div className="artist-grid">
            <div className="artist-card">Artista 1</div>
            <div className="artist-card">Artista 2</div>
            <div className="artist-card">Artista 3</div>
            <div className="artist-card">Artista 4</div>
          </div>
        </div>
        

        <div className="section">
          <h2 className="section-title">Escuchado Recientemente</h2>
          <div className="artist-grid">
            <div className="artist-card">Playlist 1</div>
            <div className="artist-card">Playlist 2</div>
            <div className="artist-card">Playlist 3</div>
            <div className="artist-card">Playlist 4</div>
          </div>
        </div>
      </div>
    </div>
  );
};
//Comprobacion commits
export default PantallaInicial;
