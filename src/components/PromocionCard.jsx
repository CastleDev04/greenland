import { Calendar, Play, Clock, Tag, ArrowRight, X, Copy, ExternalLink, CalendarDays, Info } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function PromocionCard({ promocion, formatearFecha }) {
    const videoRef = useRef(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const calcularDiasRestantes = (fechaFin) => {
        const hoy = new Date();
        const fin = new Date(fechaFin);
        const diferencia = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
        
        if (diferencia < 0) return 'Expirada';
        if (diferencia === 0) return 'Último día';
        if (diferencia === 1) return '1 día restante';
        if (diferencia <= 7) return `${diferencia} días restantes`;
        if (diferencia <= 30) return `${Math.ceil(diferencia / 7)} semanas restantes`;
        return `${Math.ceil(diferencia / 30)} meses restantes`;
    };

    const diasRestantes = calcularDiasRestantes(promocion.fecha_fin);
    const esUrgente = diasRestantes.includes('día') && !diasRestantes.includes('Expirada');

    // Función para copiar URL
    const copyToClipboard = () => {
        navigator.clipboard.writeText(promocion.url_medio);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Función para reproducir/pausar video en la card
    const toggleVideoPlay = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (isVideoPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsVideoPlaying(!isVideoPlaying);
        }
    };

    // Efecto para manejar eventos del video
    useEffect(() => {
        if (videoRef.current && promocion.tipo_medio === 'video') {
            const video = videoRef.current;
            
            const handlePlay = () => setIsVideoPlaying(true);
            const handlePause = () => setIsVideoPlaying(false);
            const handleLoaded = () => setIsVideoLoaded(true);

            video.addEventListener('play', handlePlay);
            video.addEventListener('pause', handlePause);
            video.addEventListener('loadeddata', handleLoaded);

            return () => {
                video.removeEventListener('play', handlePlay);
                video.removeEventListener('pause', handlePause);
                video.removeEventListener('loadeddata', handleLoaded);
            };
        }
    }, [promocion.tipo_medio]);

    return (
        <>
            {/* Card Principal */}
            <div className="group w-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-lime-200 cursor-pointer">
                {/* Container de imagen/video */}
                <div 
                    className="relative overflow-hidden h-56"
                    onClick={() => setShowModal(true)}
                >
                    {promocion.tipo_medio === 'imagen' ? (
                        <img 
                            src={promocion.url_medio} 
                            alt={promocion.titulo} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                        />
                    ) : (
                        <div className="relative w-full h-full">
                            <video
                                ref={videoRef}
                                src={promocion.url_medio}
                                className="w-full h-full object-cover"
                                muted
                                loop
                                playsInline
                                preload="metadata"
                            />
                            {/* Overlay con botón de play/pause */}
                            <div 
                                className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors flex items-center justify-center"
                                onClick={toggleVideoPlay}
                            >
                                <div className={`bg-white/90 rounded-full p-3 transition-all duration-300 ${
                                    isVideoPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                                } group-hover:scale-110`}>
                                    {isVideoPlaying ? (
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <div className="w-2 h-4 bg-lime-600 mx-0.5"></div>
                                            <div className="w-2 h-4 bg-lime-600 mx-0.5"></div>
                                        </div>
                                    ) : (
                                        <Play className="text-lime-600" size={24} />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Badges en la esquina superior izquierda */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-lime-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {promocion.tipo_medio === 'video' ? 'Video' : 'Imagen'}
                        </span>
                        {promocion.activo ? (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                Activa
                            </span>
                        ) : (
                            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                Inactiva
                            </span>
                        )}
                    </div>

                    {/* Badge de urgencia */}
                    {esUrgente && (
                        <div className="absolute top-4 right-4">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                                ¡Últimos días!
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
                            {promocion.titulo}
                        </h2>
                    </div>

                    {/* Descripción */}
                    <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
                        {promocion.descripcion}
                    </p>

                    {/* Información de fechas */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-lime-600 flex-shrink-0" />
                            <div className="flex flex-col text-sm">
                                <span className="text-lime-600 font-semibold">Válida hasta:</span>
                                <span className="font-medium">{formatearFecha(promocion.fecha_fin)}</span>
                            </div>
                        </div>

                        {/* Días restantes destacado */}
                        <div className={`rounded-xl p-3 border ${
                            esUrgente 
                                ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-100' 
                                : 'bg-gradient-to-r from-lime-50 to-green-50 border-lime-100'
                        }`}>
                            <div className="flex items-center gap-2">
                                <Clock className={`w-5 h-5 ${esUrgente ? 'text-red-600' : 'text-lime-600'}`} />
                                <div className="text-right flex-1">
                                    <span className={`text-lg font-bold ${esUrgente ? 'text-red-700' : 'text-lime-700'}`}>
                                        {diasRestantes}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón de acción - VER DETALLES */}
                <div className="p-6 pt-0">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg group-hover:shadow-lime-200 flex items-center justify-center gap-2"
                    >
                        <span>Ver Detalles</span>
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
                                <Info className="text-lime-600" size={20} />
                                <h3 className="font-semibold text-gray-800">Detalles de la Promoción</h3>
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
                            {/* Media */}
                            <div className="rounded-lg overflow-hidden bg-gray-100">
                                {promocion.tipo_medio === 'imagen' ? (
                                    <img 
                                        src={promocion.url_medio} 
                                        alt={promocion.titulo} 
                                        className="w-full h-48 object-contain bg-white"
                                    />
                                ) : (
                                    <video
                                        src={promocion.url_medio}
                                        className="w-full h-48 object-contain bg-black"
                                        controls
                                        autoPlay
                                        muted
                                    />
                                )}
                            </div>

                            {/* Información Principal */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-lg text-gray-800 leading-tight">
                                    {promocion.titulo}
                                </h4>
                                
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                        promocion.activo 
                                            ? 'bg-green-100 text-green-800 border border-green-200' 
                                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                                    }`}>
                                        {promocion.activo ? '✅ Activa' : '⭕ Inactiva'}
                                    </span>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-lime-100 text-lime-800 border border-lime-200">
                                        {promocion.tipo_medio === 'video' ? '🎬 Video' : '🖼️ Imagen'}
                                    </span>
                                    {esUrgente && (
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200 animate-pulse">
                                            ⚡ {diasRestantes}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Descripción */}
                            {promocion.descripcion && (
                                <div className="pt-3 border-t">
                                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                        {promocion.descripcion}
                                    </p>
                                </div>
                            )}

                            {/* Fechas */}
                            <div className="pt-3 border-t">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1 font-medium">Fecha de Inicio</p>
                                        <div className="flex items-center gap-2">
                                            <CalendarDays size={14} className="text-lime-600" />
                                            <span className="text-sm font-medium text-gray-800">
                                                {formatearFecha(promocion.fecha_inicio)}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1 font-medium">Fecha de Fin</p>
                                        <div className="flex items-center gap-2">
                                            <CalendarDays size={14} className="text-lime-600" />
                                            <span className="text-sm font-medium text-gray-800">
                                                {formatearFecha(promocion.fecha_fin)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* URL del Medio */}
                            <div className="pt-3 border-t">
                                <p className="text-xs text-gray-500 mb-2 font-medium">URL del archivo</p>
                                <div className="flex gap-2">
                                    <div className="flex-1 min-w-0">
                                        <input
                                            type="text"
                                            value={promocion.url_medio}
                                            readOnly
                                            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 truncate focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
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
                                            href={promocion.url_medio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-2 bg-lime-100 hover:bg-lime-200 text-lime-700 border border-lime-300 rounded-lg transition-colors flex items-center justify-center"
                                            title="Abrir en nueva pestaña"
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
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t">
                            <div className="flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded border">
                                        ID: {promocion.id}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={promocion.url_medio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 text-sm bg-lime-500 hover:bg-lime-600 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <ExternalLink size={14} />
                                        Abrir
                                    </a>
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