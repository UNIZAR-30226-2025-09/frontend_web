import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Playlist = () => {
    const { playlistId } = useParams(); // 🔥 Obtiene el ID de la URL
    const [playlist, setPlaylist] = useState(null);

    useEffect(() => {
        if (!playlistId) return; // Evita llamadas innecesarias si no hay ID

        const fetchPlaylist = async () => {
            try {
                console.log(`Obteniendo playlist con ID: ${playlistId}`); // 🔥 Verifica en consola
                const response = await fetch(`http://localhost:5001/api/playlists/${playlistId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }

                const data = await response.json();
                console.log("Playlist cargada:", data);
                setPlaylist(data);
            } catch (error) {
                console.error("Error al obtener la playlist:", error);
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    if (!playlist) {
        return <p>Cargando playlist...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="playlist-header">
                <img src={playlist.front_page} alt="Playlist Cover"/>
                <div className="playlist-info">
                    <h3>{playlist.name}</h3>
                    <p>{playlist.description}</p>
                    <p>{playlist.type}</p>
                </div>
            </div>


            {/* Lista de canciones */}
            <div className="mt-6">
                <h2 className="text-white text-2xl font-semibold mb-4">Canciones</h2>
                <table className="w-full text-left text-gray-400">
                    <thead>
                    <tr className="border-b border-gray-600">
                        <th className="py-2">#</th>
                        <th className="py-2">Título</th>
                        <th className="py-2">Artista</th>
                        <th className="py-2">Duración</th>
                    </tr>
                    </thead>
                    <tbody>
                    {playlist.songs.map((song, index) => (
                        <tr key={song.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4">{song.name}</td>
                            <td className="py-3 px-4">{song.artist}</td>
                            <td className="py-3 px-4">{song.duration}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Playlist;
