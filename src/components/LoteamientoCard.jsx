import { BsCurrencyDollar, BsCardList } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import portada from "../image/logo-lomas-country.jpg";

export default function LoteamientoCard({ fraccionamiento }) {
    // Función para formatear el precio
    const formatPrice = (price) => {
        if (!price) return '0';
        return new Intl.NumberFormat('es-PY').format(price);
    };

    // Si no hay fraccionamiento, no mostrar nada
    if (!fraccionamiento) {
        return null;
    }

    return (
        <>
            <div className="group w-64 md:w-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-emerald-200">
                {/* Container de imagen con overlay */}
                <div className="relative overflow-hidden">
                    <img 
                        src={portada} 
                        alt="Imagen de loteamiento" 
                        className="w-full h-48 md:h-54 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badge de tipo de desarrollo */}
                    <div className="absolute top-4 left-4">
                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
                            <IoHomeOutline className="w-4 h-4" />
                            Loteamiento
                        </span>
                    </div>
                </div>

                {/* Contenido de la card */}
                <div className="p-6 space-y-6">
                    {/* Título - viene de la BD */}
                    <div className="text-center">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-display leading-tight">
                            {fraccionamiento.nombre || "Nombre no disponible"}
                        </h2>
                    </div>

                    {/* Información del loteamiento */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="flex items-center gap-2 text-emerald-600 font-semibold min-w-fit">
                                <FiMapPin className="w-5 h-5" />
                                <span>Ubicación:</span>
                            </div>
                            {/* Ubicación viene de la BD */}
                            <span className="font-medium">{fraccionamiento.ubicacion || "Ubicación no disponible"}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="flex items-center gap-2 text-emerald-600 font-semibold min-w-fit">
                                <BsCardList className="w-5 h-5" />
                                <span>Disponible:</span>
                            </div>
                            {/* Cantidad de lotes viene de la BD */}
                            <span className="font-medium">{fraccionamiento.cantidad_lotes || 0} lotes</span>
                        </div>
                    </div>

                    {/* Precio destacado */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                                <BsCurrencyDollar className="w-5 h-5" />
                                <span>Desde:</span>
                            </div>
                            <div className="text-right">
                                {/* Precio viene de la BD */}
                                <span className="text-2xl font-bold text-emerald-700">
                                    {formatPrice(fraccionamiento.precio_venta)}
                                </span>
                                <span className="text-emerald-600 text-lg font-medium ml-1">Gs</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón de contacto - lleva a /contacto como pediste */}
                <div className="p-6 pt-0">
                    <Link to="/contacto" className="block w-full">
                        <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg group-hover:shadow-emerald-200">
                            <span className="flex items-center justify-center gap-2">
                                Ver Contacto
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                </svg>
                            </span>
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
}