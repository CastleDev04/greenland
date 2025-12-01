// src/components/SystemComponents/PromocionesList.jsx
import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Calendar,
  Image,
  Video,
  FileText,
  ChevronLeft,
  ChevronRight,
  Play,
  X
} from 'lucide-react';
import { usePromociones } from '../../hook/usePromociones';
import PromocionesForm from './PromocionesForm';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('es-PY');
  } catch {
    return 'Fecha inválida';
  }
};

const PromocionesList = () => {
  const { 
    promociones, 
    loading, 
    createPromocion, 
    updatePromocion, 
    deletePromocion
  } = usePromociones();
  
  const [filterTipoMedio, setFilterTipoMedio] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPromocion, setSelectedPromocion] = useState(null);
  const [showPromocionModal, setShowPromocionModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPromocion, setEditingPromocion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Filtros y búsqueda
  const filteredPromociones = useMemo(() => {
    if (!Array.isArray(promociones)) {
      console.warn('promociones no es un array:', promociones);
      return [];
    }
    
    return promociones.filter(promocion => {
      if (!promocion) return false;
      
      const matchesSearch = searchTerm === '' || 
        (promocion.titulo && promocion.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (promocion.descripcion && promocion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesActivo = filterActivo === '' || 
        (filterActivo === 'activo' && promocion.activo) ||
        (filterActivo === 'inactivo' && !promocion.activo);

      return matchesSearch && matchesActivo;
    });
  }, [promociones, searchTerm, filterActivo]);

  // Paginación
  const totalPages = Math.ceil(filteredPromociones.length / itemsPerPage);
  const paginatedPromociones = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPromociones.slice(start, start + itemsPerPage);
  }, [filteredPromociones, currentPage, itemsPerPage]);

  // Handlers
  const handleView = (promocion) => {
    setSelectedPromocion(promocion);
    setShowPromocionModal(true);
  };

  const handleEdit = (promocion) => {
    setEditingPromocion(promocion);
  };

  const handleDelete = async (promocion) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la publicidad "${promocion.titulo}"?`)) {
      try {
        await deletePromocion(promocion.id);
      } catch (error) {
        console.error('Error eliminando publicidad:', error);
      }
    }
  };

  const handleToggleActivo = async (promocion) => {
    try {
      const updatedData = {
        ...promocion,
        activo: !promocion.activo
      };
      await updatePromocion(promocion.id, updatedData, null);
    } catch (error) {
      console.error('Error cambiando estado activo:', error);
    }
  };

  const handleCreate = async (promocionData, file) => {
    try {
      await createPromocion(promocionData, file);
      setShowForm(false);
    } catch (error) {
      console.error('Error creando publicidad:', error);
      throw error;
    }
  };

  const handleUpdate = async (id, promocionData, file) => {
    try {
      await updatePromocion(id, promocionData, file);
      setEditingPromocion(null);
    } catch (error) {
      console.error('Error actualizando publicidad:', error);
      throw error;
    }
  };

  // Estadísticas
  const estadisticas = useMemo(() => {
    const totalPromociones = promociones.length;
    const promocionesActivas = promociones.filter(p => p.activo).length;
    
    // Publicidades creadas este mes
    const esteMes = new Date().getMonth() + 1;
    const esteAnio = new Date().getFullYear();
    const promocionesEsteMes = promociones.filter(promocion => {
      if (!promocion.created_at) return false;
      const fecha = new Date(promocion.created_at);
      return fecha.getMonth() + 1 === esteMes && fecha.getFullYear() === esteAnio;
    }).length;

    // Contar por tipo de medio
    const imagenes = promociones.filter(p => p.tipo_medio === 'imagen').length;
    const videos = promociones.filter(p => p.tipo_medio === 'video').length;

    return { 
      totalPromociones, 
      promocionesActivas, 
      promocionesEsteMes,
      imagenes,
      videos
    };
  }, [promociones]);

  if (loading && promociones.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Publicidad</h1>
            <p className="text-gray-600 mt-1">
              Gestiona las publicidades con imágenes y videos
            </p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Nueva Publicidad
          </button>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Botón de filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Filter size={20} className="mr-2" />
            Filtros
          </button>
        </div>

        {/* Filtros expandibles */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filterActivo}
                onChange={(e) => setFilterActivo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Tipo de Medio
  </label>
  <select
    value={filterTipoMedio}
    onChange={(e) => setFilterTipoMedio(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  >
    <option value="">Todos los tipos</option>
    <option value="imagen">Imágenes</option>
    <option value="video">Videos</option>
  </select>
</div>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <FileText className="text-blue-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-blue-600">Total Publicidades</p>
              <p className="text-2xl font-bold text-blue-800">{estadisticas.totalPromociones}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Eye className="text-green-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-green-600">Activas</p>
              <p className="text-2xl font-bold text-green-800">{estadisticas.promocionesActivas}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Image className="text-purple-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-purple-600">Imágenes</p>
              <p className="text-2xl font-bold text-purple-800">{estadisticas.imagenes}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Video className="text-orange-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-orange-600">Videos</p>
              <p className="text-2xl font-bold text-orange-800">{estadisticas.videos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Publicidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPromociones.map((promocion) => (
          <div key={promocion.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
            {/* Media Preview */}
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              {promocion.url_medio ? (
                promocion.tipo_medio === 'imagen' ? (
                  <img
                    src={promocion.url_medio}
                    alt={promocion.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={promocion.url_medio}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <Play size={48} className="text-white opacity-80" />
                    </div>
                  </div>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Image size={48} className="text-gray-400" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex space-x-1">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  promocion.activo 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {promocion.activo ? 'Activo' : 'Inactivo'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  promocion.tipo_medio === 'video' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-purple-500 text-white'
                }`}>
                  {promocion.tipo_medio}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                {promocion.titulo}
              </h3>
              
              {promocion.descripcion && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {promocion.descripcion}
                </p>
              )}

              {/* Fechas */}
              <div className="text-xs text-gray-500 space-y-1 mb-3">
                {promocion.fecha_inicio && (
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    Inicio: {formatDate(promocion.fecha_inicio)}
                  </div>
                )}
                {promocion.fecha_fin && (
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    Fin: {formatDate(promocion.fecha_fin)}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleActivo(promocion)}
                    className={`p-2 rounded ${
                      promocion.activo 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={promocion.activo ? 'Desactivar' : 'Activar'}
                  >
                    {promocion.activo ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  
                  <button
                    onClick={() => handleView(promocion)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Ver detalles"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => handleEdit(promocion)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(promocion)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {paginatedPromociones.length === 0 && !loading && (
        <div className="text-center py-12">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay publicidades</h3>
          <p className="mt-1 text-sm text-gray-500">
            {promociones.length === 0 ? 'No hay publicidades registradas.' : 'No se encontraron publicidades con los filtros aplicados.'}
          </p>
          {promociones.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Primera Publicidad
            </button>
          )}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredPromociones.length)} de {filteredPromociones.length} resultados
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

      {/* Modal de detalles de la publicidad */}
      {showPromocionModal && selectedPromocion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Detalles de la Publicidad
                </h3>
                <button
                  onClick={() => setShowPromocionModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Información General</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Título:</span> {selectedPromocion.titulo}</p>
                      <p><span className="font-medium">Estado:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          selectedPromocion.activo 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {selectedPromocion.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </p>
                      <p><span className="font-medium">Tipo de Medio:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          selectedPromocion.tipo_medio === 'video' 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-purple-500 text-white'
                        }`}>
                          {selectedPromocion.tipo_medio}
                        </span>
                      </p>
                    </div>
                  </div>

                  {selectedPromocion.descripcion && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Descripción</h4>
                      <p className="text-sm text-gray-600">{selectedPromocion.descripcion}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Fechas</h4>
                    <div className="space-y-2 text-sm">
                      {selectedPromocion.fecha_inicio && (
                        <p><span className="font-medium">Inicio:</span> {formatDate(selectedPromocion.fecha_inicio)}</p>
                      )}
                      {selectedPromocion.fecha_fin && (
                        <p><span className="font-medium">Fin:</span> {formatDate(selectedPromocion.fecha_fin)}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Archivo Multimedia</h4>
                    {selectedPromocion.url_medio ? (
                      <div className="border rounded-lg p-4">
                        {selectedPromocion.tipo_medio === 'imagen' ? (
                          <img
                            src={selectedPromocion.url_medio}
                            alt={selectedPromocion.titulo}
                            className="w-full h-48 object-cover rounded mb-3"
                          />
                        ) : (
                          <div className="relative w-full h-48 bg-gray-100 rounded mb-3 flex items-center justify-center">
                            <video
                              src={selectedPromocion.url_medio}
                              className="w-full h-full object-cover rounded"
                              controls
                            />
                          </div>
                        )}
                        <div className="text-sm">
                          <p className="font-medium">Tipo: {selectedPromocion.tipo_medio}</p>
                          <p className="text-gray-500 truncate">URL: {selectedPromocion.url_medio}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No hay archivo multimedia</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Información del Sistema</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">ID:</span> {selectedPromocion.id}</p>
                      <p><span className="font-medium">Fecha de Creación:</span> {formatDate(selectedPromocion.created_at)}</p>
                      {selectedPromocion.updated_at && (
                        <p><span className="font-medium">Última Actualización:</span> {formatDate(selectedPromocion.updated_at)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPromocionModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    handleEdit(selectedPromocion);
                    setShowPromocionModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar Publicidad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forms */}
      {showForm && (
        <PromocionesForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isLoading={loading}
        />
      )}

      {editingPromocion && (
        <PromocionesForm
          promocionData={editingPromocion}
          onSubmit={(data, file) => handleUpdate(editingPromocion.id, data, file)}
          onCancel={() => setEditingPromocion(null)}
          isEditing={true}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default PromocionesList;