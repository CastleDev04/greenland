import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Calendar, 
  User, 
  MapPin, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  FileText
} from 'lucide-react';

const VentasList = ({ 
  ventas = [], 
  onView, 
  onEdit, 
  onDelete, 
  onExport, 
  loading = false 
}) => {
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: '',
    tipoPago: '',
    fechaDesde: '',
    fechaHasta: '',
    cliente: ''
  });
  
  const [ordenamiento, setOrdenamiento] = useState({ campo: 'fecha', direccion: 'desc' });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina] = useState(10);

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PY', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Estados con colores
  const getEstadoChip = (estado) => {
    const estados = {
      'Activa': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
      'Finalizada': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      'Cancelada': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };
    
    const config = estados[estado] || estados['Activa'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon size={12} className="mr-1" />
        {estado}
      </span>
    );
  };

  // Filtrar y ordenar ventas
  const ventasFiltradas = useMemo(() => {
    let resultado = ventas.filter(venta => {
      const matchBusqueda = !filtros.busqueda || 
        venta.cliente?.nombre?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        venta.cliente?.apellido?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        venta.cliente?.cedula?.includes(filtros.busqueda) ||
        venta.lote?.fraccionamiento?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        venta.lote?.manzana?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        venta.lote?.lote?.toLowerCase().includes(filtros.busqueda.toLowerCase());

      const matchEstado = !filtros.estado || venta.estado === filtros.estado;
      const matchTipoPago = !filtros.tipoPago || venta.tipoPago === filtros.tipoPago;
      const matchCliente = !filtros.cliente || venta.clienteId.toString() === filtros.cliente;
      
      const fechaVenta = new Date(venta.fecha);
      const matchFechaDesde = !filtros.fechaDesde || fechaVenta >= new Date(filtros.fechaDesde);
      const matchFechaHasta = !filtros.fechaHasta || fechaVenta <= new Date(filtros.fechaHasta);

      return matchBusqueda && matchEstado && matchTipoPago && matchCliente && matchFechaDesde && matchFechaHasta;
    });

    // Ordenamiento
    resultado.sort((a, b) => {
      let valorA = a[ordenamiento.campo];
      let valorB = b[ordenamiento.campo];

      // Casos especiales
      if (ordenamiento.campo === 'cliente') {
        valorA = `${a.cliente?.nombre} ${a.cliente?.apellido}`.toLowerCase();
        valorB = `${b.cliente?.nombre} ${b.cliente?.apellido}`.toLowerCase();
      } else if (ordenamiento.campo === 'lote') {
        valorA = `${a.lote?.fraccionamiento} ${a.lote?.manzana}-${a.lote?.lote}`.toLowerCase();
        valorB = `${b.lote?.fraccionamiento} ${b.lote?.manzana}-${b.lote?.lote}`.toLowerCase();
      }

      if (valorA < valorB) return ordenamiento.direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return ordenamiento.direccion === 'asc' ? 1 : -1;
      return 0;
    });

    return resultado;
  }, [ventas, filtros, ordenamiento]);

  // Paginación
  const totalPaginas = Math.ceil(ventasFiltradas.length / itemsPorPagina);
  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginaActual(1); // Reset a primera página
  };

  const handleOrdenamiento = (campo) => {
    setOrdenamiento(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      estado: '',
      tipoPago: '',
      fechaDesde: '',
      fechaHasta: '',
      cliente: ''
    });
    setPaginaActual(1);
  };

  // Obtener clientes únicos para filtro
  const clientesUnicos = [...new Map(ventas.map(v => [v.clienteId, v.cliente])).values()];

  // Calcular resumen
  const resumen = useMemo(() => {
    const total = ventasFiltradas.length;
    const activas = ventasFiltradas.filter(v => v.estado === 'Activa').length;
    const finalizadas = ventasFiltradas.filter(v => v.estado === 'Finalizada').length;
    const canceladas = ventasFiltradas.filter(v => v.estado === 'Cancelada').length;
    const montoTotal = ventasFiltradas.reduce((sum, v) => sum + (v.montoTotal || 0), 0);

    return { total, activas, finalizadas, canceladas, montoTotal };
  }, [ventasFiltradas]);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Ventas</h1>
            <p className="text-gray-600 mt-1">
              {resumen.total} venta{resumen.total !== 1 ? 's' : ''} encontrada{resumen.total !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter size={20} className="mr-2" />
              Filtros
              <ChevronDown 
                size={16} 
                className={`ml-1 transform transition-transform ${mostrarFiltros ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {onExport && (
              <button
                onClick={() => onExport(ventasFiltradas)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download size={20} className="mr-2" />
                Exportar
              </button>
            )}
          </div>
        </div>

        {/* Resumen estadístico */}
        <div className="grid grid-cols-5 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{resumen.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{resumen.activas}</p>
            <p className="text-sm text-gray-600">Activas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{resumen.finalizadas}</p>
            <p className="text-sm text-gray-600">Finalizadas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{resumen.canceladas}</p>
            <p className="text-sm text-gray-600">Canceladas</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{formatCurrency(resumen.montoTotal)}</p>
            <p className="text-sm text-gray-600">Valor Total</p>
          </div>
        </div>
      </div>

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Búsqueda
              </label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={filtros.busqueda}
                  onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                  placeholder="Cliente, CI, lote..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filtros.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="Activa">Activa</option>
                <option value="Finalizada">Finalizada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Pago
              </label>
              <select
                value={filtros.tipoPago}
                onChange={(e) => handleFiltroChange('tipoPago', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los tipos</option>
                <option value="Contado">Contado</option>
                <option value="Credito">Crédito</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                value={filtros.cliente}
                onChange={(e) => handleFiltroChange('cliente', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los clientes</option>
                {clientesUnicos.map(cliente => cliente && (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desde
              </label>
              <input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hasta
              </label>
              <input
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={limpiarFiltros}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Tabla de ventas */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrdenamiento('fecha')}
              >
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Fecha
                  {ordenamiento.campo === 'fecha' && (
                    <span className="ml-1">{ordenamiento.direccion === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrdenamiento('cliente')}
              >
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  Cliente
                  {ordenamiento.campo === 'cliente' && (
                    <span className="ml-1">{ordenamiento.direccion === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrdenamiento('lote')}
              >
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Lote
                  {ordenamiento.campo === 'lote' && (
                    <span className="ml-1">{ordenamiento.direccion === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrdenamiento('montoTotal')}
              >
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-2" />
                  Monto
                  {ordenamiento.campo === 'montoTotal' && (
                    <span className="ml-1">{ordenamiento.direccion === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo Pago
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrdenamiento('estado')}
              >
                <div className="flex items-center">
                  Estado
                  {ordenamiento.campo === 'estado' && (
                    <span className="ml-1">{ordenamiento.direccion === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuotas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Cargando ventas...</span>
                  </div>
                </td>
              </tr>
            ) : ventasPaginadas.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No se encontraron ventas</p>
                    <p className="text-sm">Intente ajustar los filtros de búsqueda</p>
                  </div>
                </td>
              </tr>
            ) : (
              ventasPaginadas.map((venta) => (
                <tr key={venta.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(venta.fecha)}
                    </div>
                    <div className="text-sm text-gray-500">
                      #{venta.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {venta.cliente?.nombre} {venta.cliente?.apellido}
                    </div>
                    <div className="text-sm text-gray-500">
                      CI: {venta.cliente?.cedula}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {venta.lote?.fraccionamiento}
                    </div>
                    <div className="text-sm text-gray-500">
                      Mz: {venta.lote?.manzana} - Lt: {venta.lote?.lote}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(venta.montoTotal)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      venta.tipoPago === 'Contado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {venta.tipoPago}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoChip(venta.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {venta.tipoPago === 'Credito' ? (
                      <div>
                        <div>{venta.cuotasPagadas || 0}/{venta.cantidadCuotas}</div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(venta.montoCuota)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(venta)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      {onEdit && venta.estado === 'Activa' && (
                        <button
                          onClick={() => onEdit(venta)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                          title="Editar venta"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {onDelete && venta.estado !== 'Finalizada' && (
                        <button
                          onClick={() => onDelete(venta)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Cancelar venta"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((paginaActual - 1) * itemsPorPagina) + 1} a {Math.min(paginaActual * itemsPorPagina, ventasFiltradas.length)} de {ventasFiltradas.length} resultados
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPaginaActual(pageNum)}
                  className={`px-3 py-1 border rounded text-sm ${
                    paginaActual === pageNum
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VentasList;