import { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';
import NoticiaCard from './NoticiaCard';

export default function NoticiasSection() {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Cargar noticias
    useEffect(() => {
        const loadNoticias = async () => {
            try {
                setLoading(true);
                
                // Fetch directo a tu API para noticias activas
                const response = await fetch('https://api.greenlandpy.com/api/noticias/activas');
                
                if (response.ok) {
                    const data = await response.json();
                    // Tomar solo las últimas 3 noticias activas
                    const noticiasActivas = data.slice(0, 3);
                    setNoticias(noticiasActivas);
                } else {
                    console.error('Error en la respuesta:', response.status);
                }
                
            } catch (err) {
                console.error('Error cargando noticias:', err);
            } finally {
                setLoading(false);
            }
        };

        loadNoticias();
    }, []);

    // Auto-slide
    useEffect(() => {
        if (noticias.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % noticias.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [noticias.length]);

    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % noticias.length);
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + noticias.length) % noticias.length);
    const goToSlide = (index) => setCurrentSlide(index);

    const formatearFecha = (fecha) => {
        if (!fecha) return 'Sin fecha';
        return new Date(fecha).toLocaleDateString('es-PY', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Si está cargando
    if (loading) {
        return (
            <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="max-w-7xl mx-auto">
                    <HeaderSection />
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </section>
        );
    }

    // Si no hay noticias, no mostrar nada
    if (noticias.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <HeaderSection />

                {/* Grid Desktop - Máximo 3 columnas */}
                <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 place-items-center">
                    {noticias.map((noticia) => (
                        <div 
                            key={noticia.id} 
                            className="transform hover:scale-105 transition-all duration-300"
                        >
                            <NoticiaCard 
                                noticia={noticia}
                                formatearFecha={formatearFecha}
                            />
                        </div>
                    ))}
                </div>

                {/* Carrusel Mobile */}
                <div className="md:hidden">
                    <MobileCarousel
                        noticias={noticias}
                        currentSlide={currentSlide}
                        onNext={nextSlide}
                        onPrev={prevSlide}
                        onGoToSlide={goToSlide}
                        formatearFecha={formatearFecha}
                    />
                </div>

                {/* Botón para ver todas */}
                <div className="text-center mt-12">
                    <a 
                        href="/noticias" 
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Ver Todas las Noticias
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
}

// ========== COMPONENTES AUXILIARES ==========

function HeaderSection() {
    return (
        <div className="text-center mb-16">
            <div className="inline-block">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Newspaper className="w-8 h-8 text-blue-500" />
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Últimas Noticias
                    </h2>
                    <Newspaper className="w-8 h-8 text-blue-500" />
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
                Mantente informado con las últimas novedades y actualizaciones
            </p>
        </div>
    );
}

function MobileCarousel({ noticias, currentSlide, onNext, onPrev, onGoToSlide, formatearFecha }) {
    if (noticias.length === 0) return null;

    return (
        <div className="relative max-w-sm mx-auto">
            <div className="overflow-hidden rounded-2xl shadow-2xl bg-white">
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {noticias.map((noticia) => (
                        <div key={noticia.id} className="w-full flex-shrink-0">
                            <NoticiaCard 
                                noticia={noticia}
                                formatearFecha={formatearFecha}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {noticias.length > 1 && (
                <>
                    <button
                        onClick={onPrev}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-blue-600 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
                        aria-label="Anterior"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        onClick={onNext}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-blue-600 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
                        aria-label="Siguiente"
                    >
                        <ChevronRight size={20} />
                    </button>

                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {noticias.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => onGoToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                    index === currentSlide 
                                        ? 'bg-blue-500 scale-125' 
                                        : 'bg-gray-300 hover:bg-blue-300'
                                }`}
                                aria-label={`Ir a noticia ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}