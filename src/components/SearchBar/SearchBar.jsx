import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaTimes } from 'react-icons/fa';
import debounce from 'lodash.debounce';
import './SearchBar.css';
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const isSearchRelatedPage = useRef(false);
    const previousPathRef = useRef(location.pathname);

    const isNavigatingToResult = useRef(false);

    // Creamos la función debounced fuera del ciclo de renderizado
    const debouncedOnSearch = useCallback(
        debounce((query) => {
            console.log('[SearchBar] Searching for:', query);
            onSearch(query);
        }, 300),
        [onSearch]
    );

    // Detectar cuando se selecciona un resultado específico
    useEffect(() => {
        const currentPath = location.pathname;

        // Si venimos de búsqueda y vamos a un resultado específico
        if (previousPathRef.current.includes('/search')) {
            if (
                (currentPath.includes('/songs/') ||
                    currentPath.includes('/artist/') ||
                    currentPath.includes('/playlist/')) &&
                !currentPath.includes('/search')
            ) {
                // Marcamos que estamos navegando a un resultado
                isNavigatingToResult.current = true;
                setSearchQuery(''); // Limpiamos el input visualmente

                // MODIFICADO: No llamamos a onSearch('') para evitar redirecciones no deseadas
                // Solo reseteamos el flag de navegación después de un tiempo
                setTimeout(() => {
                    // onSearch(''); -- REMOVIDO, esta línea causa la redirección no deseada
                    isNavigatingToResult.current = false;
                }, 100);
            }
        }

        // Actualizamos referencia para la próxima vez
        previousPathRef.current = currentPath;
    }, [location.pathname, onSearch]);

    // En las funciones de búsqueda, verificamos si estamos navegando
    const handleChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (!isNavigatingToResult.current) {
            debouncedOnSearch(value);
        }
    };

    // Limpieza del debounce al desmontar
    useEffect(() => {
        return () => {
            console.log('[SearchBar] Unmounting, canceling debounce');
            debouncedOnSearch.cancel();
        };
    }, [debouncedOnSearch]);

    // Similar para el resto de funciones que llaman a onSearch
    const clearSearch = () => {
        setSearchQuery('');
        if (!isNavigatingToResult.current) {
            onSearch('');
        }
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 0);
    };

    // Realiza búsqueda cuando se presiona Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            // Navegar a la página de búsqueda con la consulta
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="search-container">
            <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="¿Qué quieres reproducir?"
                    className="search-input"
                />
                {searchQuery && (
                    <FaTimes
                        className="clear-icon"
                        onClick={clearSearch}
                    />
                )}
            </div>
        </div>
    );
};

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default SearchBar;