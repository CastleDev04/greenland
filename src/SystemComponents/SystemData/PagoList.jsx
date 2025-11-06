import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit,   
  Trash2, 
  DollarSign,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye,
  CreditCard,
  AlertCircle
} from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-PY');
};

const formatMoney = (amount) => {
  if (!amount) return 'Gs. 0';
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function PagosList({ 
  pagos: pagosFromProps,
  ventas = [], // Para mostrar info de la venta asociada
  onCreateClick,
  onEditClick, 
  onDeleteClick,
}) {
  const pagos = Array.isArray(pagosFromProps) ? pagosFromProps : [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipoPago, setFilterTipoPago] = useState('');
  const [filterMes, setFilterMes] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleView = (pago) => {
    setSelectedPago(pago);
    setShowPagoModal(true);
  };

  const handleEdit = (pago) => {
    onEditClick(pago);
  };

  const handleDelete = (pago) => {
    onDeleteClick(pago);
  };

  // Obtener información de la venta
  const getVentaInfo = (ventaId) => {
    return ventas.find(v => v.id === ventaId) || null;
  };

  // Filtros y búsqueda
  const filteredPagos = useMemo(() => {
    if (!Array.isArray(pagos)) return [];
    
    return pagos.filter(pago => {
      if (!pago) return false;
      
      const ventaInfo = getVentaInfo(pago.venta_id);
      
      const matchesSearch = searchTerm === '' || 
        (pago.comprobante && pago.comprobante.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pago.tipoPago && pago.tipoPago.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ventaInfo && ventaInfo.clienteNombre && ventaInfo.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTipoPago = filterTipoPago === '' || pago.tipoPago === filterTipoPago;

      const matchesMes = filterMes === '' || 
        (pago.fechaPago && pago.fechaPago.startsWith(filterMes));

      return matchesSearch && matchesTipoPago && matchesMes;
    });
  }, [pagos, searchTerm, filterTipoPago, filterMes, ventas]);

  // Paginación
  const totalPages = Math.ceil(filteredPagos.length / itemsPerPage);
  const paginatedPagos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPagos.slice(start, start + itemsPerPage);
  }, [filteredPagos, currentPage, itemsPerPage]);

  const getTipoPagoColor = (tipo) => {
    switch(tipo?.toLowerCase()) {
      case 'efectivo':
        return 'bg-green-100 text-green-800';
      case 'transferencia':
        return 'bg-blue-100 text-blue-800';
      case 'cheque':
        return 'bg-purple-100 text-purple-800';
      case 'tarjeta':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calcular totales
  const totales = useMemo(() => {
    return filteredPagos.reduce((acc, pago) => {
      acc.total += parseFloat(pago.monto || 0);
      acc.intereses += parseFloat(pago.interes || 0);
      acc.multas += parseFloat(pago.multa || 0);
      return acc;
    }, { total: 0, intereses: 0, multas: 0 });
  }, [filteredPagos]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pagos</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los pagos de las ventas realizadas
            </p>
          </div>
          <button 
            onClick={onCreateClick} 
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Registrar Pago
          </button>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por comprobante, tipo de pago o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Filter size={20} className="mr-2" />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Pago
              </label>
              <select
                value={filterTipoPago}
                onChange={(e) => setFilterTipoPago(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="cheque">Cheque</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mes
              </label>
              <input
                type="month"
                value={filterMes}
                onChange={(e) => setFilterMes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="text-blue-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-blue-600">Total Pagos</p>
              <p className="text-xl font-bold text-blue-800">{pagos.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CreditCard className="text-green-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-green-600">Monto Total</p>
              <p className="text-lg font-bold text-green-800">{formatMoney(totales.total)}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="text-yellow-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-yellow-600">Intereses</p>
              <p className="text-lg font-bold text-yellow-800">{formatMoney(totales.intereses)}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="text-red-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-red-600">Multas</p>
              <p className="text-lg font-bold text-red-800">{formatMoney(totales.multas)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de pagos */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venta/Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comprobante
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPagos.map((pago) => {
                const ventaInfo = getVentaInfo(pago.venta_id);
                return (
                  <tr key={pago.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar size={14} className="mr-2 text-gray-400" />
                        {formatDate(pago.fechaPago)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Venta #{pago.venta_id}
                        </div>
                        {ventaInfo && (
                          <div className="text-sm text-gray-500">
                            {ventaInfo.clienteNombre || 'Cliente'}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {formatMoney(pago.monto)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTipoPagoColor(pago.tipoPago)}`}>
                        {pago.tipoPago}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {pago.interes > 0 && (
                          <div className="text-yellow-600">
                            Int: {formatMoney(pago.interes)}
                          </div>
                        )}
                        {pago.multa > 0 && (
                          <div className="text-red-600">
                            Multa: {formatMoney(pago.multa)}
                          </div>
                        )}
                        {!pago.interes && !pago.multa && (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        {pago.comprobante ? (
                          <>
                            <FileText size={14} className="mr-1 text-gray-400" />
                            {pago.comprobante}
                          </>
                        ) : (
                          <span className="text-gray-400">Sin comprobante</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleView(pago)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(pago)}
                          className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(pago)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {paginatedPagos.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pagos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {pagos.length === 0 ? 'No hay pagos registrados.' : 'No se encontraron pagos con los filtros aplicados.'}
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredPagos.length)} de {filteredPagos.length} resultados
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} className="mr-1" />
              Anterior
            </button>
            
            <div className="flex space-x-1">
              {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de detalles del pago */}
      {showPagoModal && selectedPago && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Detalles del Pago
                </h3>
                <button
                  onClick={() => setShowPagoModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Información del Pago</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">ID Pago:</p>
                      <p className="font-medium">#{selectedPago.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">ID Venta:</p>
                      <p className="font-medium">#{selectedPago.venta_id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fecha de Pago:</p>
                      <p className="font-medium">{formatDate(selectedPago.fechaPago)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tipo de Pago:</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTipoPagoColor(selectedPago.tipoPago)}`}>
                        {selectedPago.tipoPago}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Montos</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monto principal:</span>
                      <span className="font-bold text-lg">{formatMoney(selectedPago.monto)}</span>
                    </div>
                    {selectedPago.interes > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interés:</span>
                        <span className="font-medium text-yellow-600">{formatMoney(selectedPago.interes)}</span>
                      </div>
                    )}
                    {selectedPago.multa > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Multa:</span>
                        <span className="font-medium text-red-600">{formatMoney(selectedPago.multa)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold text-gray-700">Total:</span>
                      <span className="font-bold text-xl text-green-700">
                        {formatMoney((selectedPago.monto || 0) + (selectedPago.interes || 0) + (selectedPago.multa || 0))}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedPago.comprobante && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Comprobante</h4>
                    <div className="flex items-center text-sm">
                      <FileText size={16} className="mr-2 text-gray-400" />
                      <span>{selectedPago.comprobante}</span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  <p>Registrado: {formatDate(selectedPago.created_at)}</p>
                  {selectedPago.updated_at && selectedPago.updated_at !== selectedPago.created_at && (
                    <p>Última actualización: {formatDate(selectedPago.updated_at)}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPagoModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    handleEdit(selectedPago);
                    setShowPagoModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}