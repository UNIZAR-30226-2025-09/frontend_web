import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  // Captura el cambio de ubicación
  const location = useLocation();
  
  // Este efecto se ejecuta cada vez que la ruta cambia
  useEffect(() => {
    // La parte clave: Aquí reseteamos la posición del scroll
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'  // 'auto' en lugar de 'smooth' para evitar conflictos
    });
    
    // Como respaldo adicional por si el scroll anterior fallara
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0; // Para Safari
    }, 50);
  }, [location.pathname]); // Se ejecuta cada vez que cambia la ruta

  return null; // Este componente no renderiza nada
}

export default ScrollToTop;