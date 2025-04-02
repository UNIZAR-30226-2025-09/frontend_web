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
        };
    }, []);

    const handleTriggerClick = () => {
        setShowPopup((prev) => !prev);
        setOpenSubmenuIndex(null);
    };

    const handleOptionClick = (option, index) => {
        // Si la opción tiene submenu, no cerramos el popup aún
        if (!option.submenu) {
            if (onOptionSelect) {
                onOptionSelect(option, index);
            }
            setShowPopup(false);
            setOpenSubmenuIndex(null);
        }
    };

    const handleOptionMouseEnter = (index) => {
        if (options[index].submenu) {
            setOpenSubmenuIndex(index);
        }
    };

    const handleOptionMouseLeave = (index) => {
        if (options[index].submenu) {
            setOpenSubmenuIndex(null);
        }
    };

    return (
        <div className="popup-container">
            <div ref={triggerRef} onClick={handleTriggerClick} className="popup-trigger">
                {trigger}
            </div>
            {showPopup && (
                <div ref={popupRef} className={`popup-menu ${position}`}>
                    <ul>
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className="popup-option"
                                onClick={() => handleOptionClick(option, index)}
                                onMouseEnter={() => handleOptionMouseEnter(index)}
                                onMouseLeave={() => handleOptionMouseLeave(index)}
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
                                                    onClick={() => {
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
