import { useState } from "react";
import PropTypes from "prop-types";
import "./PlaylistModal.css";

const PlaylistModal = ({ onSubmit, onClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert("El título es obligatorio");
            return;
        }
        onSubmit({ title, description });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Crear nueva playlist</h2>
                <form onSubmit={handleSubmit}>
                    <label>Título:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ingresa el nombre..."
                    />
                    <label>Descripción:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ingresa la descripción..."
                    />
                    <div className="modal-actions">
                        <button type="submit">Crear</button>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

PlaylistModal.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default PlaylistModal;
