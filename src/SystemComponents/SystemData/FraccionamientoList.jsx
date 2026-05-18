import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit,   
  Trash2, 
  MapPin, 
  Building,
  Home,
  ChevronLeft,
  ChevronRight,
  Eye,
  DollarSign,
  Calendar,
  TrendingUp
} from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('es-PY');
  } catch {
    return 'Fecha inválida';
  }
};

const formatCurrency = (amount) => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0
  }).format(amount);
};

export default function FraccionamientoList({ 
  fraccionamientos: fraccionamientosFromProps = [],
  onCreateClick,
  onEditClick, 
  onDeleteClick,
  onViewLotesClick
}) {
  const fraccionamientos = Array.isArray(fraccionamientosFromProps) ? fraccionamientosFromProps : [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFraccionamiento, setSelectedFraccionamiento] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Estados disponibles
  const estadosUnicos = useMemo(() => {
    const estados = fraccionamientos.map(f => f.estado).filter(Boolean);
    return [...new Set(estados)];
  }, [fraccionamientos]);

  const handleView = (fraccionamiento) => {
    setSelectedFraccionamiento(fraccionamiento);
    setShowDetailModal(true);
  };

  // Filtros y búsqueda
  const filteredFraccionamientos = useMemo(() => {
    return fraccionamientos.filter(fraccionamiento => {
      if (!fraccionamiento) return false;
      
      const matchesSearch = searchTerm === '' || 
        (fraccionamiento.nombre && fraccionamiento.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (fraccionamiento.ubicacion && fraccionamiento.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesEstado = filterEstado === '' || fraccionamiento.estado === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [fraccionamientos, searchTerm, filterEstado]);

  // Paginación
  const totalPages = Math.ceil(filteredFraccionamientos.length / itemsPerPage);
  const paginatedFraccionamientos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFraccionamientos.slice(start, start + itemsPerPage);
  }, [filteredFraccionamientos, currentPage, itemsPerPage]);

  const getStatusColor = (estado) => {
    switch(estado) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'En desarrollo': return 'bg-yellow-100 text-yellow-800';
      case 'Finalizado': return 'bg-blue-100 text-blue-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = fraccionamientos.length;
    const activos = fraccionamientos.filter(f => f.estado === 'Activo').length;
    const enDesarrollo = fraccionamientos.filter(f => f.estado === 'En desarrollo').length;
    const totalLotes = fraccionamientos.reduce((sum, f) => sum + (f.cantidad_lotes || 0), 0);
    
    return { total, activos, enDesarrollo, totalLotes };
  }, [fraccionamientos]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Fraccionamientos</h1>
            <p className="text-gray-600 mt-1">
              Gestiona todos los fraccionamientos y sus lotes
            </p>
          </div>
          <button 
            onClick={onCreateClick} 
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Nuevo Fraccionamiento
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
              placeholder="Buscar por nombre o ubicación..."
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
          <div className="mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                {estadosUnicos.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Building className="text-blue-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-blue-600">Total Fraccionamientos</p>
              <p className="text-2xl font-bold text-blue-800">{estadisticas.total}</p>
            </div>
          </div>
        </div>
        
        

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Home className="text-purple-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-purple-600">Total Lotes</p>
              <p className="text-2xl font-bold text-purple-800">{estadisticas.totalLotes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de fraccionamientos */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fraccionamiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lotes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedFraccionamientos.map((fraccionamiento) => (
                <tr key={fraccionamiento.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {fraccionamiento.nombre}
                      </div>
                      {fraccionamiento.descripcion && (
                        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                          {fraccionamiento.descripcion}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center">
                      <MapPin size={14} className="mr-1 text-gray-400" />
                      {fraccionamiento.ubicacion || 'N/A'}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {fraccionamiento.cantidad_lotes || 0} lotes
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {formatCurrency(fraccionamiento.precio_venta)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(fraccionamiento.estado)}`}>
                      {fraccionamiento.estado || 'Activo'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(fraccionamiento)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button
                        onClick={() => onEditClick(fraccionamiento)}
                        className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteClick(fraccionamiento)}
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>

        {paginatedFraccionamientos.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay fraccionamientos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {fraccionamientos.length === 0 ? 'No hay fraccionamientos registrados.' : 'No se encontraron fraccionamientos con los filtros aplicados.'}
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredFraccionamientos.length)} de {filteredFraccionamientos.length} resultados
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
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
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

      {/* Modal de detalles */}
      {showDetailModal && selectedFraccionamiento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Detalles del Fraccionamiento
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Building size={18} className="mr-2 text-blue-600" />
                    Información General
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-medium">Nombre:</span> {selectedFraccionamiento.nombre}</p>
                    <p><span className="font-medium">Estado:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedFraccionamiento.estado)}`}>
                        {selectedFraccionamiento.estado || 'Activo'}
                      </span>
                    </p>
                    <p className="col-span-2"><span className="font-medium">Descripción:</span> {selectedFraccionamiento.descripcion || 'N/A'}</p>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <MapPin size={18} className="mr-2 text-green-600" />
                    Ubicación
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p className="col-span-2"><span className="font-medium">Dirección:</span> {selectedFraccionamiento.ubicacion || 'N/A'}</p>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Home size={18} className="mr-2 text-purple-600" />
                    Información de Lotes
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-medium">Cantidad de lotes:</span> {selectedFraccionamiento.cantidad_lotes || 0}</p>
                    <p><span className="font-medium">Precio por lote:</span> {formatCurrency(selectedFraccionamiento.precio_venta)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Calendar size={18} className="mr-2 text-gray-600" />
                    Información del Sistema
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-medium">ID:</span> {selectedFraccionamiento.id}</p>
                    <p><span className="font-medium">Fecha de Registro:</span> {formatDate(selectedFraccionamiento.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    onEditClick(selectedFraccionamiento);
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar Fraccionamiento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}