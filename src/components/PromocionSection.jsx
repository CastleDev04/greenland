import { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import PromocionCard from './PromocionCard';
// import { usePromociones } from '../hooks/usePromociones'; // Descomenta esto cuando tengas el hook

export default function PromocionSection() {
    const [promociones, setPromociones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Cargar promociones
    useEffect(() => {
        const loadPromociones = async () => {
            try {
                setLoading(true);
                
                // OPCIÓN 1: Usar tu hook (RECOMENDADO cuando lo tengas configurado)
                // const { promociones: allPromociones } = usePromociones();
                // const activas = allPromociones.filter(p => p.activo).slice(0, 3);
                // setPromociones(activas);
                
                // OPCIÓN 2: Fetch directo a tu API
                const token = localStorage.getItem('token');
                const response = await fetch('https://api.greenlandpy.com/api/publicidad', {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const activas = data.filter(p => p.activo).slice(0, 3);
                    setPromociones(activas);
                }
                
            } catch (err) {
                console.error('Error cargando promociones:', err);
            } finally {
                setLoading(false);
            }
        };

        loadPromociones();
    }, []);

    // Auto-slide
    useEffect(() => {
        if (promociones.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % promociones.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [promociones.length]);

    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % promociones.length);
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + promociones.length) % promociones.length);
    const goToSlide = (index) => setCurrentSlide(index);

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-PY', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Si está cargando
    if (loading) {
        return (
            <section className="py-16 px-4 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50">
                <div className="max-w-7xl mx-auto">
                    <HeaderSection />
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600"></div>
                    </div>
                </div>
            </section>
        );
    }

    // Si no hay promociones, no mostrar nada
    if (promociones.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-4 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <HeaderSection />

                {/* Grid Desktop - Máximo 3 columnas */}
                <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 place-items-center">
                    {promociones.map((promo) => (
                        <div 
                            key={promo.id} 
                            className="transform hover:scale-105 transition-all duration-300"
                        >
                            <PromocionCard 
                                promocion={promo}
                                formatearFecha={formatearFecha}
                            />
                        </div>
                    ))}
                </div>

                {/* Carrusel Mobile */}
                <div className="md:hidden">
                    <MobileCarousel
                        promociones={promociones}
                        currentSlide={currentSlide}
                        onNext={nextSlide}
                        onPrev={prevSlide}
                        onGoToSlide={goToSlide}
                        formatearFecha={formatearFecha}
                    />
                </div>

                {/* Botón para ver todas */}
                {/* <div className="text-center mt-12">
                    <a 
                        href="/promociones" 
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-semibold py-3 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Ver Todas las Promociones
                        <ArrowRight size={20} />
                    </a>
                </div> */}
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
                    <Sparkles className="w-8 h-8 text-lime-500" />
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
                        Promociones Activas
                    </h2>
                    <Sparkles className="w-8 h-8 text-lime-500" />
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-lime-400 to-green-400 mx-auto rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
                Aprovecha nuestras ofertas exclusivas y encuentra tu terreno ideal
            </p>
        </div>
    );
}

function MobileCarousel({ promociones, currentSlide, onNext, onPrev, onGoToSlide, formatearFecha }) {
    if (promociones.length === 0) return null;

    return (
        <div className="relative max-w-sm mx-auto">
            <div className="overflow-hidden rounded-2xl shadow-2xl bg-white">
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {promociones.map((promo) => (
                        <div key={promo.id} className="w-full flex-shrink-0">
                            <PromocionCard 
                                promocion={promo}
                                formatearFecha={formatearFecha}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {promociones.length > 1 && (
                <>
                    <button
                        onClick={onPrev}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-lime-600 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
                        aria-label="Anterior"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        onClick={onNext}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-lime-600 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
                        aria-label="Siguiente"
                    >
                        <ChevronRight size={20} />
                    </button>

                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {promociones.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => onGoToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                    index === currentSlide 
                                        ? 'bg-lime-500 scale-125' 
                                        : 'bg-gray-300 hover:bg-lime-300'
                                }`}
                                aria-label={`Ir a promoción ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}