import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { apiFetch } from '#utils/apiFetch';
import { getImageUrl } from '#utils/getImageUrl';
import './SearchPage.css';

const SearchPage = () => {
    // Obtener consulta desde la URL
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';

    // Estados para resultados
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [filteredArtists, setFilteredArtists] = useState([]);
    const [activeCategory, setActiveCategory] = useState('todo');
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    // Obtener funciones del contexto para el reproductor
    const { handleAccessWithoutLogin } = useOutletContext();

    // Función para reproducir canciones
    const playSong = (song) => {
        // La implementación de esta función dependerá de cómo quieras manejar la reproducción
        console.log('Reproduciendo canción:', song);
        // Aquí se implementaría la lógica para reproducir la canción
    };

    // Cargar resultados cuando cambia la consulta
    useEffect(() => {
        if (!query.trim()) {
            setFilteredSongs([]);
            setFilteredPlaylists([]);
            setFilteredArtists([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const fetchSearchResults = async () => {
            try {
                // Obtener datos desde diferentes endpoints
                const [songsData, artistsData, playlistsData] = await Promise.all([
                    fetchSongs(),
                    fetchArtists(),
                    fetchPlaylists()
                ]);

                setFilteredSongs(songsData);
                setFilteredPlaylists(playlistsData);
                setFilteredArtists(artistsData);
            } catch (error) {
                console.error("Error al buscar:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    // Funciones para obtener datos filtrados
    const fetchSongs = async () => {
        try {
            const data = await apiFetch('/songs/');
            return data
                .filter(song =>
                    song.name.toLowerCase().includes(query.toLowerCase()) ||
                    (song.artist_name && song.artist_name.toLowerCase().includes(query.toLowerCase()))
                )
                .map(song => ({
                    id: song.id,
                    name: song.name,
                    duration: song.duration,
                    artist: song.artist_name || "Artista desconocido",
                    photo_video: song.photo_video || "",
                    url_mp3: song.url_mp3 || ""
                }));
        } catch (error) {
            console.error("Error buscando canciones:", error);
            return [];
        }
    };

    const fetchArtists = async () => {
        try {
            const data = await apiFetch('/artist/artists/');
            return data
                .filter(artist => artist.name.toLowerCase().includes(query.toLowerCase()))
                .map(artist => ({
                    id: artist.id,
                    name: artist.name,
                    photo: artist.photo || "/artist-placeholder.jpg",
                    biography: artist.bio || ""
                }));
        } catch (error) {
            console.error("Error buscando artistas:", error);
            return [];
        }
    };

    const fetchPlaylists = async () => {
        try {
            const data = await apiFetch('/playlists/');
            return data
                .filter(playlist => playlist.name.toLowerCase().includes(query.toLowerCase()))
                .map(playlist => ({
                    id: playlist.id,
                    title: playlist.name,
                    imageUrl: playlist.front_page || "/playlist-placeholder.jpg",
                    idAutor: playlist.user_id,
                    description: playlist.description || "",
                    esPublica: playlist.type,
                    esAlbum: playlist.typeP === "album",
                }));
        } catch (error) {
            console.error("Error buscando playlists:", error);
            return [];
        }
    };

    // Funciones para navegación
    const handlePlaylistClick = (playlistId, e) => {
        if (!localStorage.getItem("token")) {
            handleAccessWithoutLogin(e);
        } else {
            navigate(`/playlist/${playlistId}`);
        }
    };

    const handleArtistClick = (artistId) => {
        navigate(`/artist/${artistId}`);
    };

    // Determinar resultado principal
    const getMainResult = () => {
        if (filteredSongs.length > 0) {
            return {
                type: 'song',
                id: filteredSongs[0].id,
                item: filteredSongs[0],
                name: filteredSongs[0].name,
                image: filteredSongs[0].photo_video,
                subtext: `Canción • ${filteredSongs[0].artist}`
            };
        } else if (filteredArtists.length > 0) {
            return {
                type: 'artist',
                id: filteredArtists[0].id,
                name: filteredArtists[0].name,
                image: filteredArtists[0].photo,
                subtext: 'Artista'
            };
        } else if (filteredPlaylists.length > 0) {
            return {
                type: 'playlist',
                id: filteredPlaylists[0].id,
                name: filteredPlaylists[0].title,
                image: filteredPlaylists[0].imageUrl,
                subtext: 'Playlist'
            };
        }
        return null;
    };

    // Manejar clic en resultado principal
    const handleMainResultClick = (result, e) => {
        if (!result) return;

        switch (result.type) {
            case 'song':
                playSong(result.item);
                break;
            case 'artist':
                handleArtistClick(result.id);
                break;
            case 'playlist':
                handlePlaylistClick(result.id, e);
                break;
            default:
                break;
        }
    };

    const mainResult = getMainResult();
    const hasResults = filteredSongs.length > 0 || filteredArtists.length > 0 || filteredPlaylists.length > 0;

    // Verificar qué resultados mostrar según categoría
    const showSongs = activeCategory === 'todo' || activeCategory === 'canciones';
    const showArtists = activeCategory === 'todo' || activeCategory === 'artistas';
    const showPlaylists = activeCategory === 'todo' || activeCategory === 'playlists';
    const showAlbums = activeCategory === 'todo' || activeCategory === 'albums';

    // Filtrar playlists que son álbumes
    const albumPlaylists = filteredPlaylists.filter(playlist => playlist.esAlbum);

    // Limitar a máximo 4 elementos por categoría cuando se muestra "todo"
    const limitedSongs = activeCategory === 'todo' ? filteredSongs.slice(0, 4) : filteredSongs;
    const limitedArtists = activeCategory === 'todo' ? filteredArtists.slice(0, 4) : filteredArtists;
    const limitedPlaylists = activeCategory === 'todo' ? filteredPlaylists.filter(p => !p.esAlbum).slice(0, 4) : filteredPlaylists.filter(p => !p.esAlbum);
    const limitedAlbums = activeCategory === 'todo' ? albumPlaylists.slice(0, 4) : albumPlaylists;

    // Función para agrupar artistas en pares (2 por fila)
    const groupArtistsInPairs = (artists) => {
        const pairs = [];
        for (let i = 0; i < artists.length; i += 2) {
            pairs.push(artists.slice(i, i + 2));
        }
        return pairs;
    };

    // Agrupar artistas en pares para el layout 2x2
    const artistPairs = groupArtistsInPairs(activeCategory === 'todo' ? limitedArtists : filteredArtists);

    return (
        <div className="search-page">
            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Buscando...</p>
                </div>
            ) : (
                <>
                    <div className="filter-tabs">
                        <button
                            className={`filter-button ${activeCategory === 'todo' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('todo')}
                        >
                            Todo
                        </button>
                        <button
                            className={`filter-button ${activeCategory === 'canciones' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('canciones')}
                        >
                            Canciones
                        </button>
                        <button
                            className={`filter-button ${activeCategory === 'artistas' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('artistas')}
                        >
                            Artistas
                        </button>
                        <button
                            className={`filter-button ${activeCategory === 'playlists' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('playlists')}
                        >
                            Playlists
                        </button>
                        <button
                            className={`filter-button ${activeCategory === 'albums' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('albums')}
                        >
                            Álbumes
                        </button>
                        <button
                            className={`filter-button ${activeCategory === 'podcasts' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('podcasts')}
                        >
                            Pódcasts y programas
                        </button>
                    </div>

                    <div className="search-results-content">
                        {!hasResults ? (
                            <div className="no-results">
                                <h3 className="no-results-title">No se encontraron resultados para &ldquo;{query}&rdquo;</h3>
                                <p className="no-results-subtitle">
                                    Comprueba que has escrito correctamente todas las palabras o prueba con menos palabras clave.
                                </p>
                            </div>
                        ) : (
                            <div className="results-layout">
                                {/* Columna izquierda con Resultado principal y Artistas */}
                                <div className="results-left">
                                    {/* Resultado principal */}
                                    {mainResult && activeCategory === 'todo' && (
                                        <div className="section">
                                            <h2 className="section-title">Resultado principal</h2>
                                            <div className="main-result">
                                                <div
                                                    className="main-result-card"
                                                    onClick={(e) => handleMainResultClick(mainResult, e)}
                                                >
                                                    <div className="main-result-image">
                                                        <img
                                                            src={getImageUrl(mainResult.image) || "/placeholder.jpg"}
                                                            alt={mainResult.name}
                                                        />
                                                    </div>
                                                    <div className="main-result-info">
                                                        <h3 className="main-result-name">{mainResult.name}</h3>
                                                        <p className="main-result-subtext">{mainResult.subtext}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Artistas - Layout 2x2 */}
                                    {filteredArtists.length > 0 && showArtists && (
                                        <div className="artists-section">
                                            <h2 className="section-title">Artistas</h2>
                                            <div className="artists-grid-2x2">
                                                {artistPairs.map((pair, rowIndex) => (
                                                    <div key={`row-${rowIndex}`} className="artists-row">
                                                        {pair.map((artist) => (
                                                            <div
                                                                key={artist.id}
                                                                className="artists-item"
                                                                onClick={() => handleArtistClick(artist.id)}
                                                            >
                                                                <div className="artists-image">
                                                                    <img
                                                                        src={getImageUrl(artist.photo) || "/artist-placeholder.jpg"}
                                                                        alt={artist.name}
                                                                    />
                                                                </div>
                                                                <p className="artists-name">{artist.name}</p>
                                                                <p className="artists-type">Artista</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Columna derecha con Canciones, Playlists y Álbumes */}
                                <div className="results-right">
                                    {/* Canciones */}
                                    {filteredSongs.length > 0 && showSongs && (
                                        <div className="section">
                                            <h2 className="section-title">Canciones</h2>
                                            <div className="songs-list">
                                                {(activeCategory === 'todo' ? limitedSongs : filteredSongs).map((song) => (
                                                    <div
                                                        key={song.id}
                                                        className="songs-item"
                                                        onClick={() => navigate(`/song/${song.id}`)}
                                                    >
                                                        <div className="songs-item-content">
                                                            <div className="songs-image">
                                                                <img
                                                                    src={getImageUrl(song.photo_video) || "/song-placeholder.jpg"}
                                                                    alt={song.name}
                                                                />
                                                            </div>
                                                            <div className="songs-info">
                                                                <p className="songs-name">{song.name}</p>
                                                                <p className="songs-artist">{song.artist}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Playlists (mostrando solo las que NO son álbumes) */}
                                    {filteredPlaylists.filter(p => !p.esAlbum).length > 0 && showPlaylists && (
                                        <div className="section">
                                            <h2 className="section-title">Playlists</h2>
                                            <div className="playlists-grid">
                                                {limitedPlaylists.map((playlist) => (
                                                    <div
                                                        key={playlist.id}
                                                        className="playlists-item"
                                                        onClick={(e) => handlePlaylistClick(playlist.id, e)}
                                                    >
                                                        <div className="playlists-image">
                                                            <img
                                                                src={getImageUrl(playlist.imageUrl) || "/playlist-placeholder.jpg"}
                                                                alt={playlist.title}
                                                            />
                                                        </div>
                                                        <p className="playlists-title">{playlist.title}</p>
                                                        <p className="playlists-type">Playlist</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Álbumes (mostrando solo las playlists que SÍ son álbumes) */}
                                    {albumPlaylists.length > 0 && showAlbums && (
                                        <div className="section">
                                            <h2 className="section-title">Álbumes</h2>
                                            <div className="playlists-grid">
                                                {(activeCategory === 'todo' ? limitedAlbums : albumPlaylists).map((album) => (
                                                    <div
                                                        key={album.id}
                                                        className="playlists-item"
                                                        onClick={(e) => handlePlaylistClick(album.id, e)}
                                                    >
                                                        <div className="playlists-image">
                                                            <img
                                                                src={getImageUrl(album.imageUrl) || "/playlist-placeholder.jpg"}
                                                                alt={album.title}
                                                            />
                                                        </div>
                                                        <p className="playlists-title">{album.title}</p>
                                                        <p className="playlists-type">Álbum</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default SearchPage;