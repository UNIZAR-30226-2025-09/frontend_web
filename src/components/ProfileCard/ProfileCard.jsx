import React from "react";
import { FiLogOut } from "react-icons/fi"; // Icono de logout
import "./ProfileCard.css";

const ProfileCard = ({ user }) => {
    return (
        <div className="profile-card">
            <img src={user.imageUrl} alt="Profile" className="profile-img" />
            <div className="profile-info">
                <h3>Hi, <strong>{user.name}</strong></h3>
                <p>{user.email}</p>
            </div>
            <button className="logout-btn">
                <FiLogOut size={20} />
            </button>
        </div>
    );
};

export default ProfileCard;
