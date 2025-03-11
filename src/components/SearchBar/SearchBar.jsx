import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

export default function SearchBar() {
    return (
        <div className="search-bar-container">
            <div className="search-box">
                <form className="search-form">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search..."
                    />
                    <button type="submit" className="search-button">
                        <FaSearch />
                    </button>
                </form>
            </div>
        </div>
    );
}
