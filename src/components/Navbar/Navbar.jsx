import React from "react";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="menu">
            <a href="/dashboard">Dashboard</a>
            <a href="/browse">Browse</a>
            <a href="/search">Search</a>
            <a href="/library">Library</a>
        </nav>
    );
}

export default Navbar;
