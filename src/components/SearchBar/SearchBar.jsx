// src/components/SearchBar/SearchBar.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaTimes } from 'react-icons/fa';
import debounce from 'lodash.debounce';
import './SearchBar.css';
import {useLocation} from "react-router-dom";

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);
    const location = useLocation();

    // Limpiar búsqueda solo al navegar fuera de las páginas de búsqueda
    useEffect(() => {
        // Si no estamos en la página de búsqueda o resultados, limpiar el campo
        if (!location.pathname.includes('/search') &&
            !location.pathname.includes('/artist') &&
            !location.pathname.includes('/playlist') &&
            !location.pathname.includes('/songs')) {
            // Solo limpia si hay algo que limpiar
            if (searchQuery !== '') {
                setSearchQuery('');
                // No llames a onSearch si no hay búsqueda actual
                onSearch('');
            }
        }
    }, [location.pathname, onSearch, searchQuery]);

    // Creamos una función 'debounced' para no disparar onSearch en cada pulsación exacta.
    // En su lugar, esperamos 300ms tras la última tecla antes de llamar a onSearch(query).
    const debouncedOnSearch = useCallback(
        debounce((query) => {
            onSearch(query);
        }, 300),
        [onSearch]
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        // Actualizamos la búsqueda con un retardo, para no spamear peticiones.
        debouncedOnSearch(value);
    };

    // Al desmontar el componente, cancelamos el debounce para evitar efectos secundarios.
    useEffect(() => {
        return () => {
            debouncedOnSearch.cancel();
        };
    }, [debouncedOnSearch]);

    const clearSearch = () => {
        setSearchQuery('');
        searchInputRef.current?.focus();
        onSearch(''); // Limpia también la búsqueda en el padre
    };

    return (
        <div className="search-container">
            <div className="search-box">
                {/* Ícono de lupa */}
                <FaSearch className="search-icon" />

                {/* Input */}
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleChange}
                    placeholder="¿Qué quieres reproducir?"
                    className="search-input"
                />

                {/* Ícono “X” para limpiar */}
                {searchQuery && (
                    <FaTimes
                        className="clear-icon"
                        onClick={clearSearch}
                    />
                )}
            </div>
        </div>
    )
}
SearchBar.propTypes = {
    // Ahora 'onSearch' es obligatorio y se llama cada vez que cambia el texto
    onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
