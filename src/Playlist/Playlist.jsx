/*import {useEffect, useState} from "react";*/
import { FaPlay, FaHeart, FaDownload, FaEllipsisH } from "react-icons/fa";
import SongItem from "../SongItem/SongItem.jsx";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";

const Playlist = ({ playlistId }) => {
    const [playlist, setPlaylist] = useState(null);

    useEffect(() => {
        /*if (!playlistId) return;*/
        if (!playlistId) {
            // Si no hay playlistId, usamos datos de prueba
            setPlaylist({
                title: "Mix Diario de Prueba",
                description: "Playlist generada para pruebas",
                isPrivate: false,
                imageUrl: "https://via.placeholder.com/150",
                songs: [
                    { id: 1, title: "Cosquilleo", artist: "Lucho RK, Juacko", duration: "2:30" },
                    { id: 2, title: "Jordan I", artist: "SAIKO, Quevedo", duration: "3:12" },
                    { id: 3, title: "AMANECIÓ", artist: "Quevedo, De La Rose", duration: "4:15" },
                    { id: 4, title: "Escribiendo TKM", artist: "céro, D3llano", duration: "2:25" },
                ],
            });
            return;
        }

        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/playlists/${playlistId}`);
                const data = await response.json();
                setPlaylist(data);
            } catch (error) {
                console.error("Error fetching playlist:", error);
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    if (!playlist) {
        return <p>Cargando playlist...</p>;
    }

    return (
        <div className="playlist-container">
            {/* CABECERA DINÁMICA */}
            <div className="playlist-header">
                <img src={playlist.imageUrl || "https://via.placeholder.com/150"} alt="Playlist Cover" />
                <div className="playlist-info">
                    <h3>{playlist.title}</h3>
                    <p>{playlist.description}</p>
                    <p>{playlist.isPrivate ? "Privada 🔒" : "Pública 🌍"} - {playlist.songs.length} canciones</p>
                    <div className="playlist-actions">
                        <button className="play-btn"><FaPlay /> Reproducir</button>
                        <FaHeart className="icon" />
                        <FaDownload className="icon" />
                        <FaEllipsisH className="icon" />
                    </div>
                </div>
            </div>

            {/* LISTADO DE CANCIONES */}
            <div className="song-list">
                {playlist.songs.map((song) => (
                    <SongItem key={song.id} song={song} />
                ))}
            </div>
        </div>

    );
};

Playlist.propTypes = {
    playlistId: PropTypes.number.isRequired,
};

export default Playlist;
