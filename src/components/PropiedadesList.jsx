import PropiedadesCard from './PropiedadesCard.jsx';
import { useState, useEffect } from 'react';
import Casa from "../image/casa-lomas-country.jpg";
import Barrio from "../image/imagen-lomas-country-barrio1.jpg";
import Barrio2 from "../image/imagen-lomas-country-barrio2.jpg";

export default function PropiedadesList() {
    // Estados para manejar datos, carga y errores
    const [lotes, setLotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const precios = [148959800,141699800,134439800,1269598000]

    // Función para cargar propiedades
    const loadPropiedades = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`https://backend-greenland.onrender.com/api/propiedades`);
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            const datos = await res.json();
           // Filtrar propiedades al contado Y con precio mayor a 200,000,000
    const propiedadesFiltradas = datos.filter(propiedad => 
        propiedad.modalidadPago && 
        propiedad.modalidadPago.toLowerCase() === 'contado' &&
        propiedad.precioTotal && 
        propiedad.precioTotal > 100000000 &&
        propiedad.estadoVenta &&
        propiedad.estadoVenta.toLowerCase()=== "disponible"
    );
    
    // Limitar a máximo 6 propiedades
    setLotes(propiedadesFiltradas.slice(0, 4));
        } catch (error) {
            console.error('Error loading propiedades:', error);
            setError(error.message);
            // Fallback a datos estáticos en caso de error (máximo 3)
            setLotes([{
                id: 1,
                imagen: "../image/casa-lomas-country.jpg",
                loteamiento: "Las Lomas Country - Casa",
                distrito: "Loma Grande",
                superficie: "57 m²",
                precioTotal: "280000000"
            }, {
                id: 2,
                imagen: "../image/imagen-lomas-country-barrio1.jpg",
                loteamiento: "Las Lomas Country - Terreno",
                distrito: "Loma Grande",
                superficie: "57 m²",
                precioTotal: "92400000"
            }, {
                id: 3,
                imagen: "../image/imagen-lomas-country-barrio2.jpg",
                loteamiento: "Las Lomas Country - Terreno",
                distrito: "Loma Grande",
                superficie: "57 m²",
                precioTotal: "99000000"
            }]);
        } finally {
            setLoading(false);
        }
    };

    // Efecto para cargar datos al montar el componente
    useEffect(() => {
        loadPropiedades();
    }, []);

    // Auto-slide para el carrusel
    useEffect(() => {
        if (lotes.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % lotes.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [lotes.length]);

    // Funciones para navegación manual del carrusel
    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % lotes.length);
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + lotes.length) % lotes.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };
    
    // Componente de loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold font-display bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                            Propiedades Destacadas
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full"></div>
                    </div>
                    
                    {/* Loading spinner */}
                    <div className="flex flex-col justify-center items-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-emerald-600 mt-4 font-medium">Cargando propiedades...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Si no hay datos después de cargar
    if (!loading && lotes.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">No hay propiedades disponibles</h2>
                    <p className="text-gray-600">Por favor, intenta nuevamente más tarde.</p>
                </div>
            </div>
        );
    }

    const imagenes = [Casa, Barrio, Barrio2];

    return(
        <>
            {/* Background con gradiente sutil */}
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-16 px-4">
                {/* Container principal */}
                <div className="max-w-7xl mx-auto">
                    {/* Header mejorado */}
                    <div className="text-center mb-16">
                        <div className="inline-block">
                            <h2 className="text-4xl md:text-5xl font-bold font-display bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                                Propiedades Destacadas
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full"></div>
                        </div>
                        <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
                            Descubre las mejores oportunidades inmobiliarias en ubicaciones privilegiadas
                        </p>
                        
                        {/* Mostrar mensaje de error si existe */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 max-w-2xl mx-auto">
                                <p className="font-medium">⚠️ Error al cargar propiedades desde el servidor</p>
                                <p className="text-sm mt-1">Mostrando propiedades de ejemplo. Error: {error}</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop Grid - Mejorado (máximo 3 en desktop) */}
                    <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 place-items-center">
                        {lotes.slice(0, 3).map((lote, index) => (
                            <div key={lote.id || index} className="transform hover:scale-105 transition-all duration-300">
                                <PropiedadesCard 
                                    imagen={lote.imagen || imagenes[index % imagenes.length]}
                                    titulo={lote.loteamiento || lote.titulo} 
                                    ubicacion={lote.distrito || lote.ubicacion} 
                                    superficie={lote.superficie} 
                                    precio={precios[index]} 
                                />
                            </div>
                        ))}
                    </div>

                    {/* Mobile Carousel Custom - Funcional */}
                    <div className="md:hidden">
                        <div className="relative max-w-sm mx-auto">
                            {/* Container del carrusel */}
                            <div className="overflow-hidden rounded-2xl shadow-2xl bg-white">
                                <div 
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                >
                                    {lotes.map((lote, index) => (
                                        <div key={lote.id || index} className="w-full flex-shrink-0">
                                            <PropiedadesCard 
                                                imagen={lote.imagen || imagenes[index % imagenes.length]}
                                                titulo={lote.loteamiento || lote.titulo} 
                                                ubicacion={lote.distrito || lote.ubicacion} 
                                                superficie={lote.superficie} 
                                                precio={precios[index]} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Controles del carrusel */}
                            {lotes.length > 1 && (
                                <>
                                    {/* Botón anterior */}
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-emerald-600 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                                        aria-label="Anterior"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                    </button>

                                    {/* Botón siguiente */}
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-emerald-600 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                                        aria-label="Siguiente"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>

                                    {/* Indicadores */}
                                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {lotes.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToSlide(index)}
                                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                                    index === currentSlide 
                                                        ? 'bg-emerald-500 scale-125' 
                                                        : 'bg-gray-300 hover:bg-emerald-300'
                                                }`}
                                                aria-label={`Ir a slide ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Call to action adicional */}
                    <div className="text-center mt-20">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-lg border border-white/20">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                ¿Buscas algo específico?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Nuestro equipo está listo para ayudarte a encontrar la propiedad perfecta
                            </p>
                            <button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg">
                                Ver Todas las Propiedades
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};