import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./OptionsPopup.css";

const OptionsPopup = ({
                          trigger,
                          options,
                          position = "bottom-right",
                          onOptionSelect,
                          submenuPosition = "right" // "right" o "left"
                      }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null);
    const popupRef = useRef(null);
    const triggerRef = useRef(null);
    const timeoutRef = useRef(null); // Referencia para el timeout

    const handleDocumentClick = (e) => {
        // Si se hace clic fuera del popup y del trigger, se cierra el popup
        if (
            popupRef.current &&
            !popupRef.current.contains(e.target) &&
            triggerRef.current &&
            !triggerRef.current.contains(e.target)
        ) {
            setShowPopup(false);
            setOpenSubmenuIndex(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleDocumentClick);
        return () => {
            document.removeEventListener("mousedown", handleDocumentClick);
            // Limpiar timeout si existe
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleTriggerClick = () => {
        setShowPopup((prev) => !prev);
        setOpenSubmenuIndex(null);
    };

    const handleOptionMouseEnter = (index, hasSubmenu) => {
        // Cancelar cualquier timeout existente
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        
        if (hasSubmenu) {
            setOpenSubmenuIndex(index);
        }
    };

    const handleOptionMouseLeave = () => {
        // No cerramos el submenu inmediatamente para dar tiempo a mover el ratón al submenu
    };
    
    // Nuevo manejador para cerrar el menú cuando el ratón sale del área
    const handleMenuMouseLeave = () => {
        // Usamos un pequeño timeout para evitar que el menú se cierre 
        // si el usuario solo está moviendo el ratón entre opciones
        timeoutRef.current = setTimeout(() => {
            setShowPopup(false);
            setOpenSubmenuIndex(null);
        }, 300); // 300ms de retardo
    };

    const handleOptionClick = (option, index) => {
        // Si la opción tiene submenu, ya no necesitamos toggle aquí porque se 
        // manejará con el mouse enter (hover)
        if (!option.submenu) {
            // Si no tiene submenu, ejecutar la función y cerrar todo
            if (onOptionSelect) {
                onOptionSelect(option, index);
            }
            setShowPopup(false);
            setOpenSubmenuIndex(null);
        }
    };

    // Cancelar el timeout si el usuario vuelve a entrar al menú
    const handleMenuMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    return (
        <div className="popup-container">
            <div 
                ref={triggerRef} 
                onClick={handleTriggerClick} 
                className="popup-trigger"
            >
                {trigger}
            </div>
            {showPopup && (
                <div 
                    ref={popupRef} 
                    className={`popup-menu ${position}`}
                    onMouseLeave={handleMenuMouseLeave}
                    onMouseEnter={handleMenuMouseEnter}
                >
                    <ul>
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className="popup-option"
                                onClick={() => handleOptionClick(option, index)}
                                onMouseEnter={() => handleOptionMouseEnter(index, option.submenu)}
                                onMouseLeave={handleOptionMouseLeave}
                            >
                                <span className="option-label">
                                    {option.label}
                                    {option.submenu && <span className="submenu-arrow">▶</span>}
                                </span>
                                {option.submenu && openSubmenuIndex === index && (
                                    <div className={`nested-popup ${submenuPosition}`}>
                                        <ul>
                                            {option.submenu.map((subOption, subIndex) => (
                                                <li
                                                    key={subIndex}
                                                    className="nested-option"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Evita que el clic se propague
                                                        if (onOptionSelect) {
                                                            onOptionSelect(subOption, subIndex);
                                                        }
                                                        setShowPopup(false);
                                                        setOpenSubmenuIndex(null);
                                                    }}
                                                >
                                                    {subOption.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

OptionsPopup.propTypes = {
    trigger: PropTypes.node.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.node.isRequired,
            submenu: PropTypes.array, // Opcional: submenu es un array de opciones
        })
    ).isRequired,
    position: PropTypes.oneOf(["bottom-right", "bottom-left", "top-right", "top-left"]),
    submenuPosition: PropTypes.oneOf(["right", "left"]),
    onOptionSelect: PropTypes.func,
};

export default OptionsPopup;