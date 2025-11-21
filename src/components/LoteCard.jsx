import { Link } from 'react-router-dom';
export default function LoteCard({ lote }) {
    const estadoStyles = {
        disponible: 'bg-green-500 text-white',
        reservado: 'bg-yellow-500 text-white',
        vendido: 'bg-red-500 text-white'
    };

    const estadoTexto = {
        disponible: 'Disponible',
        reservado: 'Reservado',
        vendido: 'Vendido'
    };

    // Recopilar servicios disponibles
    const servicios = [];
    if (lote.aguaPotable) servicios.push('Agua Potable');
    if (lote.energiaElectrica) servicios.push('Energía Eléctrica');
    if (lote.calle) servicios.push('Calle');
    if (lote.seguridad) servicios.push('Seguridad 24hs');

    // Parsear beneficios comunes si existe
    const beneficiosComunes = lote.beneficiosComunes ? JSON.parse(lote.beneficiosComunes) : [];

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-200">
            {/* Header con estado */}
            <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 p-6">
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${estadoStyles[lote.estadoVenta]}`}>
                    {estadoTexto[lote.estadoVenta]}
                </div>
                <div className="mt-4">
                    <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">
                        Mz. {lote.manzana} - Lote {lote.lote}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-2">
                        <span>📍</span> {lote.loteamiento}
                    </p>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
                {/* Información del distrito y finca */}
                <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-gray-600">Distrito: <span className="font-semibold text-gray-800">{lote.distrito}</span></p>
                    <p className="text-sm text-gray-600">Finca: <span className="font-semibold text-gray-800">{lote.finca}</span></p>
                    <p className="text-sm text-gray-600">Padrón: <span className="font-semibold text-gray-800">{lote.padron}</span></p>
                </div>

                {/* Características principales */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {lote.entregado && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            ✓ Entregado
                        </span>
                    )}
                    {lote.amojonado && (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            ✓ Amojonado
                        </span>
                    )}
                    {lote.limpio && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            ✓ Limpio
                        </span>
                    )}
                    {lote.tieneConstruccion && (
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            🏠 Con construcción
                        </span>
                    )}
                </div>

                {/* Servicios */}
                {servicios.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Servicios:</p>
                        <div className="flex flex-wrap gap-2">
                            {servicios.map((servicio, index) => (
                                <span 
                                    key={index}
                                    className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs border border-green-200"
                                >
                                    {servicio}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info de superficie y precio */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                    <div>
                        <p className="text-sm text-gray-600">Superficie</p>
                        <p className="text-xl font-bold text-gray-800">{lote.superficie}m²</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Precio Total</p>
                        <p className="text-2xl font-bold text-green-600">
                            ${parseFloat(lote.precioTotal).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Modalidad de pago */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Modalidad: <span className="font-semibold text-gray-800">{lote.modalidadPago}</span>
                    </p>
                    {lote.cuotas && lote.montoCuota && (
                        <p className="text-sm text-gray-600">
                            {lote.cuotas} cuotas de <span className="font-bold text-green-600">${parseFloat(lote.montoCuota).toLocaleString()}</span>
                        </p>
                    )}
                </div>

                {/* Expensas */}
                {lote.requiereExpensas && lote.expensas && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700">
                            Expensas: <span className="font-bold">${parseFloat(lote.expensas).toLocaleString()}/mes</span>
                        </p>
                    </div>
                )}

                {/* Botones */}
                <div className="flex gap-3">
                    <Link 
                        to={`/propiedades/${lote.id}`}
                        className="flex-1 bg-green-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                        Ver Detalles
                    </Link>
                    <a 
                        href={`https://wa.me/595982640741?text=Hola, me interesa el lote Mz.${lote.manzana} Lt.${lote.lote} en ${lote.loteamiento}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
                        title="Consultar por WhatsApp"
                    >
                        💬
                    </a>
                </div>
            </div>
        </div>
    );
}