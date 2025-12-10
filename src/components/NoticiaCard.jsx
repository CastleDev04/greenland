import { Calendar, User, Tag, ArrowRight, X, Copy, ExternalLink, CalendarDays, Info, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function NoticiaCard({ noticia, formatearFecha }) {
    const [showModal, setShowModal] = useState(false);
    // const [copied, setCopied] = useState(false);

    // Calcular tiempo transcurrido desde publicación
    const calcularTiempoTranscurrido = (fechaPublicacion) => {
        if (!fechaPublicacion) return 'Reciente';
        
        const ahora = new Date();
        const publicacion = new Date(fechaPublicacion);
        const diferencia = Math.floor((ahora - publicacion) / (1000 * 60 * 60 * 24));
        
        if (diferencia < 1) return 'Hoy';
        if (diferencia === 1) return 'Ayer';
        if (diferencia < 7) return `Hace ${diferencia} días`;
        if (diferencia < 30) return `Hace ${Math.floor(diferencia / 7)} semanas`;
        if (diferencia < 365) return `Hace ${Math.floor(diferencia / 30)} meses`;
        return 'Hace más de un año';
    };

    const tiempoTranscurrido = calcularTiempoTranscurrido(noticia.fecha_publicacion);
    const esReciente = tiempoTranscurrido.includes('Hoy') || tiempoTranscurrido.includes('Ayer');

    // Función para copiar URL
    // const copyToClipboard = () => {
    //     navigator.clipboard.writeText(noticia.url_imagen || '');
    //     setCopied(true);
    //     setTimeout(() => setCopied(false), 2000);
    // };

    // Extraer contenido breve
    const obtenerContenidoBreve = () => {
        if (!noticia.contenido) return 'Sin contenido disponible';
        
        const contenido = noticia.contenido.length > 150 
            ? noticia.contenido.substring(0, 150) + '...' 
            : noticia.contenido;
        
        return contenido;
    };

    return (
        <>
            {/* Card Principal */}
            <div className="group w-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer">
                {/* Container de imagen */}
                <div 
                    className="relative overflow-hidden h-56"
                    onClick={() => setShowModal(true)}
                >
                    {noticia.url_imagen ? (
                        <img 
                            src={noticia.url_imagen} 
                            alt={noticia.titulo} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-blue-300" />
                        </div>
                    )}
                    
                    {/* Badges en la esquina superior izquierda */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {noticia.categoria || 'General'}
                        </span>
                        {noticia.activo ? (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                Activa
                            </span>
                        ) : (
                            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                Inactiva
                            </span>
                        )}
                    </div>

                    {/* Badge de noticia reciente */}
                    {esReciente && (
                        <div className="absolute top-4 right-4">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                                ¡Nueva!
                            </span>
                        </div>
                    )}
                </div>

                {/* Contenido de la card */}
                <div 
                    className="p-6 space-y-4"
                    onClick={() => setShowModal(true)}
                >
                    {/* Título */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-display leading-tight line-clamp-2 min-h-[3.5rem]">
                            {noticia.titulo}
                        </h2>
                    </div>

                    {/* Contenido breve */}
                    <p className="text-gray-600 text-sm line-clamp-3 min-h-[4rem]">
                        {obtenerContenidoBreve()}
                    </p>

                    {/* Información de autor y fecha */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                            <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <div className="text-sm">
                                <span className="text-blue-600 font-semibold">Por:</span>
                                <span className="ml-1 font-medium">{noticia.autor || 'Anónimo'}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <div className="text-sm">
                                <span className="text-blue-600 font-semibold">Publicado:</span>
                                <span className="ml-1 font-medium">{tiempoTranscurrido}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón de acción - LEER MÁS */}
                <div className="p-6 pt-0">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg group-hover:shadow-blue-200 flex items-center justify-center gap-2"
                    >
                        <span>Leer Más</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* Modal Compacto de Detalles */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div 
                        className="bg-white rounded-xl max-w-md w-full shadow-xl max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-2">
                                <Info className="text-blue-600" size={20} />
                                <h3 className="font-semibold text-gray-800">Detalles de la Noticia</h3>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Cerrar"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Contenido - Scrollable */}
                        <div className="overflow-y-auto flex-1 p-4 space-y-4">
                            {/* Imagen */}
                            <div className="rounded-lg overflow-hidden bg-gray-100">
                                {noticia.url_imagen ? (
                                    <img 
                                        src={noticia.url_imagen} 
                                        alt={noticia.titulo} 
                                        className="w-full h-48 object-contain bg-white"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                        <BookOpen className="w-20 h-20 text-blue-300" />
                                    </div>
                                )}
                            </div>

                            {/* Información Principal */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-lg text-gray-800 leading-tight">
                                    {noticia.titulo}
                                </h4>
                                
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                        noticia.activo 
                                            ? 'bg-green-100 text-green-800 border border-green-200' 
                                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                                    }`}>
                                        {noticia.activo ? '✅ Publicada' : '⭕ Sin publicar'}
                                    </span>
                                    {noticia.categoria && (
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                            📰 {noticia.categoria}
                                        </span>
                                    )}
                                    {esReciente && (
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                                            ⚡ {tiempoTranscurrido}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Información del autor y fecha */}
                            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1 font-medium">Autor</p>
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-blue-600" />
                                        <span className="text-sm font-medium text-gray-800">
                                            {noticia.autor || 'Anónimo'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1 font-medium">Fecha de Publicación</p>
                                    <div className="flex items-center gap-2">
                                        <CalendarDays size={14} className="text-blue-600" />
                                        <span className="text-sm font-medium text-gray-800">
                                            {formatearFecha(noticia.fecha_publicacion)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contenido completo */}
                            <div className="pt-3 border-t">
                                <p className="text-xs text-gray-500 mb-2 font-medium">Contenido</p>
                                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                                    {noticia.contenido || 'No hay contenido disponible.'}
                                </div>
                            </div>

                            {/* URL de la Imagen */}
                            {/* {noticia.url_imagen && (
                                <div className="pt-3 border-t">
                                    <p className="text-xs text-gray-500 mb-2 font-medium">URL de la imagen</p>
                                    <div className="flex gap-2">
                                        <div className="flex-1 min-w-0">
                                            <input
                                                type="text"
                                                value={noticia.url_imagen}
                                                readOnly
                                                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 truncate focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={copyToClipboard}
                                                className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center ${
                                                    copied 
                                                        ? 'bg-green-100 text-green-700 border border-green-200' 
                                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300'
                                                }`}
                                                title={copied ? 'Copiado!' : 'Copiar URL'}
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <a
                                                href={noticia.url_imagen}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 rounded-lg transition-colors flex items-center justify-center"
                                                title="Abrir imagen en nueva pestaña"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        </div>
                                    </div>
                                    {copied && (
                                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                            <span>✓</span> URL copiada al portapapeles
                                        </p>
                                    )}
                                </div>
                            )} */}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t">
                            <div className="flex justify-between items-center">
                                {/* <div className="text-xs text-gray-500">
                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded border">
                                        ID: {noticia.id}
                                    </span>
                                </div> */}
                                <div className="flex gap-2">
                                    {noticia.url_imagen && (
                                        <a
                                            href={noticia.url_imagen}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <ExternalLink size={14} />
                                            Ver Imagen
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}