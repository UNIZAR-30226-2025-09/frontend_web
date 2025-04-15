import React, { useState } from 'react';
import { FaQuestion, FaMusic, FaUser, FaCreditCard, FaDesktop, FaMobile, FaHeadphones } from 'react-icons/fa';
import { MdPlaylistAdd, MdLibraryMusic } from 'react-icons/md';
import './Help.css';

const Help = () => {
    const [activeCategory, setActiveCategory] = useState('get-started');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    // Categorías de ayuda
    const categories = [
        { id: 'get-started', name: 'Primeros pasos', icon: <FaQuestion /> },
        { id: 'account', name: 'Cuenta y perfil', icon: <FaUser /> },
        { id: 'payment', name: 'Pagos y Premium', icon: <FaCreditCard /> },
        { id: 'app-desktop', name: 'Aplicación de escritorio', icon: <FaDesktop /> },
        { id: 'app-mobile', name: 'Aplicación móvil', icon: <FaMobile /> },
        { id: 'music', name: 'Escuchar música', icon: <FaHeadphones /> },
        { id: 'playlists', name: 'Playlists', icon: <MdPlaylistAdd /> },
        { id: 'library', name: 'Tu biblioteca', icon: <MdLibraryMusic /> },
    ];

    // Preguntas frecuentes por categoría
    const faqsByCategory = {
        'get-started': [
            {
                question: '¿Cómo puedo comenzar a usar Vibra?',
                answer: 'Registrarse en Vibra es muy sencillo. Solo tienes que crear una cuenta gratuita con tu correo electrónico y contraseña, o inicia sesión con tu cuenta de Google o Facebook. Una vez registrado, podrás empezar a explorar millones de canciones y crear tus propias playlists.'
            },
            {
                question: '¿Cuáles son las diferencias entre la versión gratuita y Premium?',
                answer: 'La versión gratuita te permite escuchar música con anuncios ocasionales y limitaciones en la reproducción móvil. Con Premium, disfrutas de música sin anuncios, reproducción sin conexión, mejor calidad de audio y control total sobre tu experiencia de escucha.'
            },
            {
                question: '¿Cómo puedo navegar por la aplicación?',
                answer: 'Vibra tiene una interfaz intuitiva con un menú lateral para acceder a tu biblioteca, buscar contenido, ver tus playlists guardadas y descubrir nueva música. La barra de reproducción en la parte inferior te permite controlar lo que estás escuchando desde cualquier pantalla.'
            }
        ],
        'account': [
            {
                question: '¿Cómo puedo editar mi perfil de usuario?',
                answer: 'Para editar tu perfil, haz clic en tu nombre de usuario en la esquina superior derecha, selecciona "Perfil" y luego haz clic en "Editar perfil". Allí podrás cambiar tu foto de perfil, nombre de usuario y otros detalles.'
            },
            {
                question: '¿Cómo cambio mi contraseña?',
                answer: 'Puedes cambiar tu contraseña en la sección "Cuenta" de tu perfil. Si olvidaste tu contraseña, utiliza la opción "¿Olvidaste tu contraseña?" en la pantalla de inicio de sesión para recibir un correo con instrucciones para restablecerla.'
            },
            {
                question: '¿Puedo cambiar mi correo electrónico?',
                answer: 'Sí, puedes cambiar tu correo electrónico asociado en la sección de "Configuración de cuenta". Tendrás que verificar el nuevo correo electrónico antes de que se complete el cambio.'
            }
        ],
        'payment': [
            {
                question: '¿Qué métodos de pago acepta Vibra?',
                answer: 'Vibra acepta tarjetas de crédito y débito (Visa, MasterCard, American Express), PayPal y en algunos países, opciones de pago móvil y prepago.'
            },
            {
                question: '¿Cómo funciona la prueba gratuita de Premium?',
                answer: 'Los nuevos usuarios de Vibra Premium pueden disfrutar de una prueba gratuita de 30 días. Después de este período, se te cobrará automáticamente la tarifa mensual a menos que canceles antes del final del período de prueba.'
            },
            {
                question: '¿Cómo cancelo mi suscripción Premium?',
                answer: 'Puedes cancelar tu suscripción en cualquier momento desde la sección "Cuenta" > "Suscripción". La cancelación entrará en vigor al final de tu período de facturación actual.'
            }
        ],
        // ... más categorías con sus preguntas
        'app-desktop': [
            {
                question: '¿Cuáles son los requisitos del sistema?',
                answer: 'Para la versión web de Vibra, necesitas un navegador moderno actualizado (Chrome, Firefox, Edge o Safari). Para la aplicación de escritorio, necesitas Windows 7 o superior, o macOS 10.12 o superior.'
            },
            {
                question: '¿Cómo configuro la calidad de audio?',
                answer: 'En la aplicación, ve a "Configuración" > "Calidad de audio" donde puedes ajustar la calidad de streaming y descarga según tu conexión a internet.'
            }
        ],
        'app-mobile': [
            {
                question: '¿Cómo descargo canciones para escucharlas sin conexión?',
                answer: 'Los usuarios Premium pueden descargar música para escuchar sin conexión. Solo tienes que tocar el botón de descarga en una playlist, álbum o canción individual. La música descargada aparecerá con un ícono de descarga verde.'
            },
            {
                question: '¿Cuánto espacio ocupan las descargas?',
                answer: 'El espacio que ocupan las descargas depende de la cantidad de música y la calidad de audio seleccionada. En promedio, una hora de música en calidad normal ocupa aproximadamente 60MB.'
            }
        ],
        'music': [
            {
                question: '¿Cómo encuentro nueva música?',
                answer: 'Vibra te ofrece recomendaciones personalizadas basadas en tu historial de escucha. También puedes explorar las listas destacadas, novedades, géneros y estados de ánimo desde la sección "Explorar".'
            },
            {
                question: '¿Cómo funciona la radio de Vibra?',
                answer: 'La radio de Vibra crea una estación basada en una canción, artista o género que elijas, reproduciendo canciones similares que cree que te gustarán.'
            }
        ],
        'playlists': [
            {
                question: '¿Cómo creo una playlist?',
                answer: 'Haz clic en "Crear playlist" en el menú lateral. Luego, puedes agregar canciones arrastrándolas o usando el menú contextual (clic derecho en una canción) y seleccionando "Agregar a playlist".'
            },
            {
                question: '¿Cómo comparto una playlist?',
                answer: 'Abre la playlist que quieres compartir, haz clic en el ícono de tres puntos (...) y selecciona "Compartir". Puedes copiar el enlace o compartirlo directamente en redes sociales.'
            }
        ],
        'library': [
            {
                question: '¿Cómo organizo mi biblioteca?',
                answer: 'Tu biblioteca se organiza automáticamente en secciones: playlists, artistas y álbumes. Puedes filtrar y ordenar cada sección según diferentes criterios como título, fecha de agregado o frecuencia de reproducción.'
            },
            {
                question: '¿Hay un límite de canciones que puedo guardar?',
                answer: 'Los usuarios gratuitos pueden guardar hasta 10,000 canciones en su biblioteca. Los usuarios Premium no tienen límite en la cantidad de canciones que pueden guardar.'
            }
        ]
    };

    // Filtrar preguntas por búsqueda
    const filteredFaqs = searchQuery
        ? Object.values(faqsByCategory).flat().filter(faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : faqsByCategory[activeCategory] || [];

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    return (
        <div className="help-container">
            <div className="help-header">
                <h1>Centro de Ayuda</h1>
                <p>¿En qué podemos ayudarte?</p>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar en la ayuda..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="help-search-input"
                    />
                </div>
            </div>

            <div className="help-content">
                <div className="categories-sidebar">
                    <h2>Categorías</h2>
                    <ul>
                        {categories.map((category) => (
                            <li
                                key={category.id}
                                className={activeCategory === category.id ? 'active' : ''}
                                onClick={() => {
                                    setActiveCategory(category.id);
                                    setSearchQuery('');
                                    setExpandedQuestion(null);
                                }}
                            >
                                <span className="category-icon">{category.icon}</span>
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="faqs-container">
                    {searchQuery ? <h2>Resultados de búsqueda</h2> : 
                        <h2>{categories.find(c => c.id === activeCategory)?.name || 'Preguntas frecuentes'}</h2>
                    }

                    {filteredFaqs.length === 0 ? (
                        <p className="no-results">No se encontraron resultados para tu búsqueda.</p>
                    ) : (
                        <div className="faq-list">
                            {filteredFaqs.map((faq, index) => (
                                <div className="faq-item" key={index}>
                                    <div 
                                        className={`faq-question ${expandedQuestion === index ? 'expanded' : ''}`}
                                        onClick={() => toggleQuestion(index)}
                                    >
                                        {faq.question}
                                        <span className="expand-icon">{expandedQuestion === index ? '−' : '+'}</span>
                                    </div>
                                    {expandedQuestion === index && (
                                        <div className="faq-answer">
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="contact-support">
                <h3>¿No encuentras lo que buscas?</h3>
                <p>Nuestro equipo de soporte está listo para ayudarte.</p>
                <button className="contact-button">Contactar con Soporte</button>
            </div>
        </div>
    );
};

export default Help;