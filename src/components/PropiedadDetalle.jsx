import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Footer from '../components/Footer';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function PropiedadDetalle() {
    const { id } = useParams();
    const [lote, setLote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLote = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://api.greenlandpy.com/api/lotes/${id}`);
                const data = await response.json();
                setLote(data);
            } catch (error) {
                console.error('Error al cargar el lote:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLote();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
            </div>
        );
    }

    if (!lote) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Propiedad no encontrada</h2>
                <Link to="/propiedades" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
                    Volver a Propiedades
                </Link>
            </div>
        );
    }

    const estadoStyles = {
        disponible: 'bg-green-500 text-white',
        reservado: 'bg-yellow-500 text-white',
        vendido: 'bg-red-500 text-white'
    };

    const beneficiosComunes = lote.beneficiosComunes ? JSON.parse(lote.beneficiosComunes) : [];
    const restriccionesConstruccion = lote.restriccionConstrucion ? JSON.parse(lote.restriccionConstrucion) : [];

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumb */}
                <div className="bg-white py-4 px-4 shadow-sm">
                    <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-600">
                        <Link to="/" className="hover:text-green-600">Inicio</Link>
                        <span>/</span>
                        <Link to="/propiedades" className="hover:text-green-600">Propiedades</Link>
                        <span>/</span>
                        <span className="text-gray-800 font-semibold">Mz. {lote.manzana} - Lote {lote.lote}</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h1 className="text-4xl font-display font-black text-gray-800 mb-2">
                                Manzana {lote.manzana} - Lote {lote.lote}
                            </h1>
                            <p className="text-gray-600 flex items-center gap-2 text-lg">
                                <span>📍</span> {lote.loteamiento} - {lote.distrito}
                            </p>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold text-lg ${estadoStyles[lote.estadoVenta]}`}>
                            {lote.estadoVenta.charAt(0).toUpperCase() + lote.estadoVenta.slice(1)}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Columna izquierda - Detalles */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Información Catastral */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Información Catastral</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">Fraccionamiento</p>
                                        <p className="font-semibold text-gray-800">{lote.fraccionamiento}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">Finca</p>
                                        <p className="font-semibold text-gray-800">{lote.finca}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">Padrón</p>
                                        <p className="font-semibold text-gray-800">{lote.padron}</p>
                                    </div>
                                    {lote.cuentaCatastral && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600">Cuenta Catastral</p>
                                            <p className="font-semibold text-gray-800">{lote.cuentaCatastral}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Estado del Lote */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Estado del Lote</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <StatusBadge label="Entregado" value={lote.entregado} />
                                    <StatusBadge label="Amojonado" value={lote.amojonado} />
                                    <StatusBadge label="Limpio" value={lote.limpio} />
                                    <StatusBadge label="Tiene Construcción" value={lote.tieneConstruccion} />
                                </div>
                            </div>

                            {/* Servicios Disponibles */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Servicios Disponibles</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <ServiceBadge label="Agua Potable" value={lote.aguaPotable} icon="💧" />
                                    <ServiceBadge label="Energía Eléctrica" value={lote.energiaElectrica} icon="⚡" />
                                    <ServiceBadge label="Calle Pavimentada" value={lote.calle} icon="🛣️" />
                                    <ServiceBadge label="Seguridad 24hs" value={lote.seguridad} icon="🔒" />
                                </div>
                            </div>

                            {/* Beneficios Comunes */}
                            {beneficiosComunes.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Beneficios Comunes</h2>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {beneficiosComunes.map((beneficio, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                                                <span className="text-green-500">✓</span>
                                                <span className="text-gray-700">{beneficio}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Linderos */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Linderos</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <LinderoInfo 
                                        direccion="Norte" 
                                        medida={lote.linderoNorteMedida}
                                        lindaCon={lote.linderoNorteCon}
                                        calle={lote.linderoNorteCalle}
                                    />
                                    <LinderoInfo 
                                        direccion="Sur" 
                                        medida={lote.linderoSurMedida}
                                        lindaCon={lote.linderoSurCon}
                                        calle={lote.linderoSurCalle}
                                    />
                                    <LinderoInfo 
                                        direccion="Este" 
                                        medida={lote.linderoEsteMedida}
                                        lindaCon={lote.linderoEsteCon}
                                        calle={lote.linderoEsteCalle}
                                    />
                                    <LinderoInfo 
                                        direccion="Oeste" 
                                        medida={lote.linderoOesteMedida}
                                        lindaCon={lote.linderoOesteCon}
                                        calle={lote.linderoOesteCalle}
                                    />
                                </div>
                            </div>

                            {/* Restricciones de Construcción */}
                            {restriccionesConstruccion.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Restricciones de Construcción</h2>
                                    <div className="space-y-3">
                                        {restriccionesConstruccion.map((restriccion, index) => (
                                            <div key={index} className="flex items-start gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                                <span className="text-yellow-600 mt-1">⚠️</span>
                                                <span className="text-gray-700">{restriccion}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Observaciones */}
                            {lote.observacion && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Observaciones</h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{lote.observacion}</p>
                                </div>
                            )}

                            {/* Mapa */}
                            {lote.latitud && lote.longitud && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Ubicación</h2>
                                    <div className="h-80 rounded-lg overflow-hidden">
                                        <MapContainer 
                                            center={[lote.latitud, lote.longitud]} 
                                            zoom={17} 
                                            scrollWheelZoom={false}
                                            className="w-full h-full"
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker position={[lote.latitud, lote.longitud]}>
                                                <Popup>
                                                    <div className="text-center">
                                                        <strong>Mz. {lote.manzana} - Lt. {lote.lote}</strong>
                                                        <br />
                                                        <span className="text-sm">{lote.loteamiento}</span>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Columna derecha - Precio y Contacto */}
                        <div className="space-y-6">
                            {/* Card de Precio */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                                <div className="text-center mb-6">
                                    <p className="text-gray-600 mb-2">Precio Total</p>
                                    <p className="text-4xl font-bold text-green-600">
                                        ${parseFloat(lote.precioTotal).toLocaleString()}
                                    </p>
                                </div>

                                <div className="text-center py-6 border-y mb-6">
                                    <p className="text-gray-600 mb-1">Superficie Total</p>
                                    <p className="text-3xl font-bold text-gray-800">{lote.superficie}m²</p>
                                </div>

                                {/* Modalidad de Pago */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        💰 Modalidad de Pago
                                    </h3>
                                    <p className="text-gray-700 font-semibold mb-2">{lote.modalidadPago}</p>
                                    {lote.cuotas && lote.montoCuota && (
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <p className="flex justify-between">
                                                <span>Cantidad de cuotas:</span>
                                                <span className="font-bold">{lote.cuotas} meses</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span>Valor por cuota:</span>
                                                <span className="font-bold text-green-600">
                                                    ${parseFloat(lote.montoCuota).toLocaleString()}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Expensas */}
                                {lote.requiereExpensas && lote.expensas && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                            📋 Expensas Mensuales
                                        </h3>
                                        <p className="text-2xl font-bold text-yellow-700">
                                            ${parseFloat(lote.expensas).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Incluye mantenimiento y servicios comunes
                                        </p>
                                    </div>
                                )}

                                {/* Botones de Acción */}
                                <div className="space-y-3">
                                    <a 
                                        href={`https://wa.me/595982640741?text=Hola, me interesa el lote Mz.${lote.manzana} Lt.${lote.lote} en ${lote.loteamiento}. Me gustaría recibir más información.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-green-500 text-white text-center py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                    >
                                        <span className="text-xl">💬</span>
                                        Consultar por WhatsApp
                                    </a>
                                    <a 
                                        href="tel:+595982640741"
                                        className="w-full bg-blue-500 text-white text-center py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="text-xl">📞</span>
                                        Llamar Ahora
                                    </a>
                                    <Link 
                                        to="/contacto"
                                        className="w-full bg-gray-100 text-gray-700 text-center py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="text-xl">✉️</span>
                                        Enviar Mensaje
                                    </Link>
                                </div>

                                {/* Info adicional */}
                                <div className="mt-6 pt-6 border-t text-center">
                                    <p className="text-sm text-gray-600 mb-2">
                                        ¿Querés agendar una visita?
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Estamos disponibles de Lunes a Viernes de 8:00 a 18:00 hs
                                    </p>
                                </div>
                            </div>

                            {/* Card de Info Rápida */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200">
                                <h3 className="font-display font-bold text-gray-800 mb-4 text-center">
                                    💡 ¿Por qué elegir este lote?
                                </h3>
                                <ul className="space-y-3 text-sm text-gray-700">
                                    {lote.aguaPotable && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-1">✓</span>
                                            <span>Agua potable disponible</span>
                                        </li>
                                    )}
                                    {lote.energiaElectrica && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-1">✓</span>
                                            <span>Energía eléctrica instalada</span>
                                        </li>
                                    )}
                                    {lote.calle && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-1">✓</span>
                                            <span>Calle de acceso en buen estado</span>
                                        </li>
                                    )}
                                    {lote.seguridad && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-1">✓</span>
                                            <span>Vigilancia las 24 horas</span>
                                        </li>
                                    )}
                                    {lote.entregado && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-1">✓</span>
                                            <span>Lote entregado y listo para construir</span>
                                        </li>
                                    )}
                                    {lote.limpio && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-1">✓</span>
                                            <span>Terreno limpio y nivelado</span>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* Compartir */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="font-display font-bold text-gray-800 mb-4 text-center">
                                    Compartir esta propiedad
                                </h3>
                                <div className="flex justify-center gap-3">
                                    <button 
                                        onClick={() => {
                                            const url = window.location.href;
                                            navigator.clipboard.writeText(url);
                                            alert('¡Enlace copiado al portapapeles!');
                                        }}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-full transition-colors"
                                        title="Copiar enlace"
                                    >
                                        🔗
                                    </button>
                                    <a 
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
                                        title="Compartir en Facebook"
                                    >
                                        📘
                                    </a>
                                    <a 
                                        href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=Mira este lote en ${lote.loteamiento}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-full transition-colors"
                                        title="Compartir en Twitter"
                                    >
                                        🐦
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Propiedades Similares */}
                <div className="bg-gray-100 py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-display font-bold text-gray-800 mb-8 text-center">
                            Propiedades Similares
                        </h2>
                        <p className="text-center text-gray-600 mb-4">
                            También te pueden interesar estos lotes en {lote.loteamiento}
                        </p>
                        <div className="text-center">
                            <Link 
                                to="/propiedades"
                                className="inline-block bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                            >
                                Ver Todas las Propiedades
                            </Link>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

// Componentes auxiliares
function StatusBadge({ label, value }) {
    return (
        <div className={`p-4 rounded-lg border-2 ${value ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
            <div className="flex items-center gap-2">
                <span className={`text-2xl ${value ? 'text-green-500' : 'text-gray-400'}`}>
                    {value ? '✓' : '✗'}
                </span>
                <span className={`font-semibold ${value ? 'text-green-700' : 'text-gray-500'}`}>
                    {label}
                </span>
            </div>
        </div>
    );
}

function ServiceBadge({ label, value, icon }) {
    return (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${value ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <span className="text-2xl">{icon}</span>
            <div className="flex-1">
                <p className={`font-semibold ${value ? 'text-green-700' : 'text-gray-500'}`}>
                    {label}
                </p>
                <p className={`text-xs ${value ? 'text-green-600' : 'text-gray-400'}`}>
                    {value ? 'Disponible' : 'No disponible'}
                </p>
            </div>
            <span className={`text-xl ${value ? 'text-green-500' : 'text-gray-400'}`}>
                {value ? '✓' : '✗'}
            </span>
        </div>
    );
}

function LinderoInfo({ direccion, medida, lindaCon, calle }) {
    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Lindero {direccion}</h4>
                {medida && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {medida} m
                    </span>
                )}
            </div>
            <div className="space-y-1 text-sm text-gray-600">
                {lindaCon && (
                    <p>Linda con: <span className="font-semibold text-gray-800">{lindaCon}</span></p>
                )}
                {calle && (
                    <p>Calle: <span className="font-semibold text-gray-800">{calle}</span></p>
                )}
            </div>
        </div>
    );
}