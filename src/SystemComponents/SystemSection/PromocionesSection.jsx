// src/components/SystemComponents/PromocionesSection.jsx
import { useState } from 'react';
import { 
  Image, 
  Video, 
  Calendar,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  FileText
} from 'lucide-react';
import { usePromociones } from '../../hook/usePromociones';
import PromocionesForm from '../SystemData/PromocionesForm';
import PromocionesList from '../SystemData/PromocionesList';

const PromocionesSection = () => {
  const { 
    promociones, 
    loading, 
    createPromocion, 
    updatePromocion, 
    deletePromocion
  } = usePromociones();
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showForm, setShowForm] = useState(false);
  const [editingPromocion, setEditingPromocion] = useState(null);
  const [selectedPromocion, setSelectedPromocion] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Handlers
  const handleCreatePromocion = async (promocionData, file) => {
    try {
      await createPromocion(promocionData, file);
      setShowForm(false);
    } catch (error) {
      console.error('Error creando publicidad:', error);
      throw error;
    }
  };

  const handleUpdatePromocion = async (id, promocionData, file) => {
    try {
      await updatePromocion(id, promocionData, file);
      setEditingPromocion(null);
    } catch (error) {
      console.error('Error actualizando publicidad:', error);
      throw error;
    }
  };

  const handleDeletePromocion = async (promocion) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la publicidad "${promocion.titulo}"?`)) {
      try {
        await deletePromocion(promocion.id);
      } catch (error) {
        console.error('Error eliminando publicidad:', error);
        alert('Error al eliminar la publicidad');
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
      alert('Error al cambiar el estado');
    }
  };

  const handleViewDetails = (promocion) => {
    setSelectedPromocion(promocion);
    setShowDetailModal(true);
  };

  const handleEditPromocion = (promocion) => {
    setEditingPromocion(promocion);
  };

  // Estadísticas actualizadas para la nueva estructura
  const estadisticas = {
    total: promociones.length,
    activas: promociones.filter(p => p.activo).length,
    imagenes: promociones.filter(p => p.tipo_medio === 'imagen').length,
    videos: promociones.filter(p => p.tipo_medio === 'video').length
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      return new Date(dateString).toLocaleDateString('es-PY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Image className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Publicidad</h1>
                <p className="text-sm text-gray-600">
                  Gestiona las publicidades de tu empresa
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Lista
                </button>
              </div>

              {/* New Promotion Button */}
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Publicidad
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Publicidades */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Publicidades
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {estadisticas.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Active Publicidades */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Activas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {estadisticas.activas}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Image className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Imágenes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {estadisticas.imagenes}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Videos */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Video className="h-6 w-6 text-orange-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Videos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {estadisticas.videos}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {viewMode === 'list' ? (
          <PromocionesList />
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header con filtros simples */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Todas las Publicidades
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {promociones.length} publicidades encontradas
                  </p>
                </div>
                
                <div className="mt-3 sm:mt-0 flex space-x-3">
                  {/* Search */}
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Buscar publicidades..."
                    />
                  </div>
                  
                  {/* Filter Button */}
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </button>
                </div>
              </div>
            </div>

            {/* Grid de Publicidades */}
            <div className="p-6">
              {loading && promociones.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : promociones.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay publicidades</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comienza creando tu primera publicidad.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Publicidad
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promociones.map((promocion) => (
                    <div key={promocion.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      {/* Media Preview */}
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                        {promocion.url_medio ? (
                          promocion.tipo_medio === 'imagen' ? (
                            <img
                              src={promocion.url_medio}
                              alt={promocion.titulo}
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <div className="relative w-full h-48 bg-gray-800">
                              <video
                                src={promocion.url_medio}
                                className="w-full h-48 object-cover opacity-80"
                                muted
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black bg-opacity-50 rounded-full p-3">
                                  <Video className="h-8 w-8 text-white" />
                                </div>
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            <Image className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex space-x-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            promocion.activo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {promocion.activo ? 'Activo' : 'Inactivo'}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            promocion.tipo_medio === 'video' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {promocion.tipo_medio}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {promocion.titulo}
                        </h3>
                        
                        {promocion.descripcion && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {promocion.descripcion}
                          </p>
                        )}

                        {/* Fechas */}
                        {(promocion.fecha_inicio || promocion.fecha_fin) && (
                          <div className="flex items-center text-xs text-gray-500 mb-3">
                            <Calendar className="h-3 w-3 mr-1" />
                            {promocion.fecha_inicio && formatDate(promocion.fecha_inicio)}
                            {promocion.fecha_fin && ` - ${formatDate(promocion.fecha_fin)}`}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleActivo(promocion)}
                              className={`p-1 rounded transition-colors ${
                                promocion.activo 
                                  ? 'text-green-600 hover:bg-green-50' 
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                              title={promocion.activo ? 'Desactivar' : 'Activar'}
                            >
                              {promocion.activo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            
                            <button
                              onClick={() => handleViewDetails(promocion)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleEditPromocion(promocion)}
                              className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleDeletePromocion(promocion)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals y Forms */}
      {showForm && (
        <PromocionesForm
          onSubmit={handleCreatePromocion}
          onCancel={() => setShowForm(false)}
          isLoading={loading}
        />
      )}

      {editingPromocion && (
        <PromocionesForm
          promocionData={editingPromocion}
          onSubmit={(data, file) => 
            handleUpdatePromocion(editingPromocion.id, data, file)
          }
          onCancel={() => setEditingPromocion(null)}
          isEditing={true}
          isLoading={loading}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedPromocion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Detalles de la Publicidad
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Información General */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Información General</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Título</p>
                      <p className="font-medium">{selectedPromocion.titulo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedPromocion.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedPromocion.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipo de Medio</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedPromocion.tipo_medio === 'video' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {selectedPromocion.tipo_medio}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                {selectedPromocion.descripcion && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Descripción</h4>
                    <p className="text-gray-600">{selectedPromocion.descripcion}</p>
                  </div>
                )}

                {/* Fechas */}
                {(selectedPromocion.fecha_inicio || selectedPromocion.fecha_fin) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Fechas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPromocion.fecha_inicio && (
                        <div>
                          <p className="text-sm text-gray-600">Fecha de Inicio</p>
                          <p className="font-medium">{formatDate(selectedPromocion.fecha_inicio)}</p>
                        </div>
                      )}
                      {selectedPromocion.fecha_fin && (
                        <div>
                          <p className="text-sm text-gray-600">Fecha de Fin</p>
                          <p className="font-medium">{formatDate(selectedPromocion.fecha_fin)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Archivo Multimedia */}
                {selectedPromocion.url_medio && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Archivo Multimedia
                    </h4>
                    <div className="border rounded-lg p-4">
                      {selectedPromocion.tipo_medio === 'imagen' ? (
                        <img
                          src={selectedPromocion.url_medio}
                          alt={selectedPromocion.titulo}
                          className="w-full h-64 object-cover rounded mb-3"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-100 rounded mb-3 flex items-center justify-center relative">
                          <video
                            src={selectedPromocion.url_medio}
                            className="w-full h-64 object-cover rounded"
                            controls
                          />
                        </div>
                      )}
                      <div className="text-sm">
                        <p className="font-medium">Tipo: {selectedPromocion.tipo_medio}</p>
                        <p className="text-gray-500 truncate">URL: {selectedPromocion.url_medio}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      handleEditPromocion(selectedPromocion);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Editar Publicidad
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromocionesSection;