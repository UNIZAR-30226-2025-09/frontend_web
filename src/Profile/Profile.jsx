import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="profile-container">
      <div className="profile-border" onClick={() => setIsOpen(!isOpen)}>
        <svg className= "profile-icon" width="50" height="50" viewBox="0 0 24 24">
          <circle cx="12" cy="7" r="5" fill="#E0E0E0"/>
          <path d="M4 21C4 17.134 7.134 14 11 14H13C16.866 14 20 17.134 20 21" fill="none" stroke="#C4C4C4" stroke-width="2"/>
        </svg>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li>Amigos</li>
            <li>Ajustes</li>
            <li className="logout">Cerrar sesión</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
