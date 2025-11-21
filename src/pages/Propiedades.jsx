import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import  LoteCard  from '../components/LoteCard';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const position = [-25.2894950, -57.6394610];

export default function Propiedades() {
    const [lotes, setLotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [filtroLoteamiento, setFiltroLoteamiento] = useState('todos');
    const [filtroOrden, setFiltroOrden] = useState('recientes');
    const [loteamientos, setLoteamientos] = useState([]);

    // Fetch de lotes desde la API
    useEffect(() => {
        const fetchLotes = async () => {
            try {
                setLoading(true);
                // Reemplaza con tu endpoint real
                const response = await fetch('https://api.greenlandpy.com/api/lotes');
                const data = await response.json();
                setLotes(data);
                
                // Extraer loteamientos únicos
                const lotesUnicos = [...new Set(data.map(lote => lote.loteamiento))];
                setLoteamientos(lotesUnicos);
            } catch (error) {
                console.error('Error al cargar los lotes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLotes();
    }, []);

    // Filtrar lotes
    const lotesFiltrados = lotes
        .filter(lote => {
            const cumpleFiltroEstado = filtroEstado === 'todos' || lote.estadoVenta === filtroEstado;
            const cumpleFiltroLoteamiento = filtroLoteamiento === 'todos' || lote.loteamiento === filtroLoteamiento;
            const cumplePrecioMinimo = parseFloat(lote.precioTotal) > 100000000;
            return cumpleFiltroEstado && cumpleFiltroLoteamiento && cumplePrecioMinimo;
        })
        .sort((a, b) => {
            if (filtroOrden === 'precio-asc') return a.precioTotal - b.precioTotal;
            if (filtroOrden === 'precio-desc') return b.precioTotal - a.precioTotal;
            if (filtroOrden === 'superficie-asc') return a.superficie - b.superficie;
            if (filtroOrden === 'superficie-desc') return b.superficie - a.superficie;
            return 0;
        });

    return (
        <>
            <div className="flex flex-col min-h-screen">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-green-300 via-green-200 to-emerald-200 py-12 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-black text-gray-800 mb-4">
                        Nuestras Propiedades
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                        Encontrá el lote perfecto para construir tu hogar soñado
                    </p>
                </div>

                {/* Map Section */}
                <div className="w-full px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-display font-bold text-gray-800 mb-4 text-center">
                            📍 Ubicación
                        </h2>
                        <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                            <MapContainer 
                                center={position} 
                                zoom={15} 
                                scrollWheelZoom={false} 
                                className="w-full h-full z-0"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {/* Marker principal */}
                                <Marker position={position}>
                                    <Popup>
                                        <div className="text-center">
                                            <strong>Oficinas Las Lomas Country</strong>
                                            <br />
                                            <span className="text-sm">Nuestra Sra. de la Asunción 1109</span>
                                        </div>
                                    </Popup>
                                </Marker>
                                {/* Markers de lotes disponibles */}
                                {lotes.map(lote => (
                                    lote.latitud && lote.longitud && (
                                        <Marker key={lote.id} position={[lote.latitud, lote.longitud]}>
                                            <Popup>
                                                <div className="text-center">
                                                    <strong>Mz. {lote.manzana} Lt. {lote.lote}</strong>
                                                    <br />
                                                    <span className="text-sm">{lote.loteamiento}</span>
                                                    <br />
                                                    <span className="text-sm">{lote.superficie}m²</span>
                                                    <br />
                                                    <span className="font-bold text-green-600">
                                                        ${lote.precioTotal.toLocaleString()}
                                                    </span>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    )
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-gray-50 py-8 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-xl shadow-md">
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-wrap">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-600">Loteamiento</label>
                                    <select 
                                        value={filtroLoteamiento}
                                        onChange={(e) => setFiltroLoteamiento(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="todos">Todos los loteamientos</option>
                                        {loteamientos.map(loteamiento => (
                                            <option key={loteamiento} value={loteamiento}>{loteamiento}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-600">Estado</label>
                                    <select 
                                        value={filtroEstado}
                                        onChange={(e) => setFiltroEstado(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="disponible">Disponibles</option>
                                        <option value="reservado">Reservados</option>
                                        <option value="vendido">Vendidos</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-600">Ordenar por</label>
                                    <select 
                                        value={filtroOrden}
                                        onChange={(e) => setFiltroOrden(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="recientes">Más recientes</option>
                                        <option value="precio-asc">Precio: menor a mayor</option>
                                        <option value="precio-desc">Precio: mayor a menor</option>
                                        <option value="superficie-asc">Superficie: menor a mayor</option>
                                        <option value="superficie-desc">Superficie: mayor a menor</option>
                                    </select>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-sm text-gray-600">Total de lotes</p>
                                <p className="text-3xl font-bold text-green-600">{lotesFiltrados.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Propiedades */}
                <div className="flex-grow py-12 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-8 text-center">
                            Lotes Disponibles
                        </h2>
                        
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
                                <p className="text-gray-600 text-lg">Cargando propiedades...</p>
                            </div>
                        ) : lotesFiltrados.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-2xl text-gray-600 mb-4">No se encontraron lotes con los filtros seleccionados</p>
                                <button 
                                    onClick={() => {
                                        setFiltroEstado('todos');
                                        setFiltroLoteamiento('todos');
                                        setFiltroOrden('recientes');
                                    }}
                                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {lotesFiltrados.map(lote => (
                                    <LoteCard key={lote.id} lote={lote} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 py-12 px-4 text-center">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                        ¿No encontraste lo que buscabas?
                    </h2>
                    <p className="text-white text-lg mb-6 max-w-2xl mx-auto">
                        Contactanos y te ayudaremos a encontrar el lote perfecto para vos
                    </p>
                    <Link 
                        to="/contacto"
                        className="inline-block bg-white text-green-600 font-bold py-4 px-8 rounded-full text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Contactar Ahora
                    </Link>
                </div>

                <Footer />
            </div>
        </>
    );
}