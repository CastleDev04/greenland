import { LuSearch, LuMapPin, LuTrendingUp } from "react-icons/lu";
import { Link } from "react-router-dom";
import portada from "../image/portada-greenland.jpg";

export default function Hero() {
    return(
        <>
        {/* Hero Section Mejorado */}
            <div className="font-body w-full bg-cover bg-center relative min-h-screen flex items-center overflow-hidden"
            style={{ backgroundImage: `url(${portada})` }}>
                {/* Overlay gradiente oscuro */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                
                {/* Contenido */}
                <div className="relative w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="flex flex-col justify-center items-start h-full gap-8 py-24">
                        {/* Etiqueta superior */}
                        <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-4 py-2 w-fit">
                            <LuTrendingUp className="text-emerald-400 text-lg" />
                            <span className="text-emerald-300 text-sm font-semibold">Desarrollos inmobiliarios</span>
                        </div>

                        {/* Título principal */}
                        <div className="space-y-4 max-w-2xl">
                            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
                                <span className="text-white">Tu terreno </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400">soñado</span>
                                <span className="text-white"> te espera</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-xl">
                                Descuentos exclusivos, sistemas de financiamiento flexible y posesión inmediata en los mejores fraccionamientos de la zona.
                            </p>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <Link to="/propiedades" className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg">
                                <LuSearch className="text-lg" /> 
                                Ver propiedades
                            </Link>
                            <Link to="/contacto" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/60 px-8 py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm">
                                <LuMapPin className="text-lg" />
                                Contactar
                            </Link>
                        </div>

                        {/* Stats 
                        <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-emerald-300">500+</div>
                                <div className="text-sm text-gray-300">Lotes disponibles</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-emerald-300">99%</div>
                                <div className="text-sm text-gray-300">Clientes satisfechos</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-emerald-300">10+</div>
                                <div className="text-sm text-gray-300">Años de trayectoria</div>
                            </div>
                        </div>*/}
                    </div>
                </div>
            </div>
        </>
    )
};
