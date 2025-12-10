// src/components/SystemComponents/NoticiasSection.jsx
import { useState } from 'react';
import { 
  FileText, 
  Calendar,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Tag,
  User
} from 'lucide-react';
import { useNoticias } from '../../hook/useNoticias';
import NoticiasForm from '../SystemData/NoticiasForm';
import NoticiasList from '../SystemData/NoticiasList';

const NoticiasSection = () => {
  const { 
    noticias, 
    loading, 
    createNoticia, 
    updateNoticia, 
    deleteNoticia
  } = useNoticias();
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showForm, setShowForm] = useState(false);
  const [editingNoticia, setEditingNoticia] = useState(null);
  const [selectedNoticia, setSelectedNoticia] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Handlers
  const handleCreateNoticia = async (noticiaData, file) => {
    try {
      await createNoticia(noticiaData, file);
      setShowForm(false);
    } catch (error) {
      console.error('Error creando noticia:', error);
      throw error;
    }
  };

  const handleUpdateNoticia = async (id, noticiaData, file) => {
    try {
      await updateNoticia(id, noticiaData, file);
      setEditingNoticia(null);
    } catch (error) {
      console.error('Error actualizando noticia:', error);
      throw error;
    }
  };

  const handleDeleteNoticia = async (noticia) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la noticia "${noticia.titulo}"?`)) {
      try {
        await deleteNoticia(noticia.id);
      } catch (error) {
        console.error('Error eliminando noticia:', error);
        alert('Error al eliminar la noticia');
      }
    }
  };

  const handleToggleActivo = async (noticia) => {
    try {
      const updatedData = {
        ...noticia,
        activo: !noticia.activo
      };
      await updateNoticia(noticia.id, updatedData, null);
    } catch (error) {
      console.error('Error cambiando estado activo:', error);
      alert('Error al cambiar el estado');
    }
  };

  const handleViewDetails = (noticia) => {
    setSelectedNoticia(noticia);
    setShowDetailModal(true);
  };

  const handleEditNoticia = (noticia) => {
    setEditingNoticia(noticia);
  };

  // Estadísticas
  const estadisticas = {
    total: noticias.length,
    activas: noticias.filter(n => n.activo).length,
    esteMes: noticias.filter(n => {
      const esteMes = new Date().getMonth() + 1;
      const esteAnio = new Date().getFullYear();
      if (!n.created_at) return false;
      const fecha = new Date(n.created_at);
      return fecha.getMonth() + 1 === esteMes && fecha.getFullYear() === esteAnio;
    }).length,
    categorias: [...new Set(noticias.map(n => n.categoria).filter(Boolean))].length
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
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Noticias</h1>
                <p className="text-sm text-gray-600">
                  Gestiona las noticias y artículos de tu sitio
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

              {/* New News Button */}
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Noticia
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Noticias */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Noticias
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {estadisticas.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Active Noticias */}
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

          {/* Este Mes */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Este Mes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {estadisticas.esteMes}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Categorías */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Tag className="h-6 w-6 text-orange-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Categorías
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {estadisticas.categorias}
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
          <NoticiasList />
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header con filtros simples */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Todas las Noticias
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {noticias.length} noticias encontradas
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
                      placeholder="Buscar noticias..."
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

            {/* Grid de Noticias */}
            <div className="p-6">
              {loading && noticias.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : noticias.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay noticias</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comienza creando tu primera noticia.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Noticia
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {noticias.map((noticia) => (
                    <div key={noticia.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      {/* Image Preview */}
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                        {noticia.url_imagen ? (
                          <img
                            src={noticia.url_imagen}
                            alt={noticia.titulo}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            <FileText className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex space-x-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            noticia.activo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {noticia.activo ? 'Activo' : 'Inactivo'}
                          </span>
                          {noticia.categoria && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {noticia.categoria}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {noticia.titulo}
                        </h3>
                        
                        {noticia.contenido && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {noticia.contenido}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                          {noticia.autor && (
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {noticia.autor}
                            </div>
                          )}
                          {noticia.fecha_publicacion && (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(noticia.fecha_publicacion)}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleActivo(noticia)}
                              className={`p-1 rounded transition-colors ${
                                noticia.activo 
                                  ? 'text-green-600 hover:bg-green-50' 
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                              title={noticia.activo ? 'Desactivar' : 'Activar'}
                            >
                              {noticia.activo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            
                            <button
                              onClick={() => handleViewDetails(noticia)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleEditNoticia(noticia)}
                              className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleDeleteNoticia(noticia)}
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
        <NoticiasForm
          onSubmit={handleCreateNoticia}
          onCancel={() => setShowForm(false)}
          isLoading={loading}
        />
      )}

      {editingNoticia && (
        <NoticiasForm
          noticiaData={editingNoticia}
          onSubmit={(data, file) => 
            handleUpdateNoticia(editingNoticia.id, data, file)
          }
          onCancel={() => setEditingNoticia(null)}
          isEditing={true}
          isLoading={loading}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedNoticia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Detalles de la Noticia
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
                {/* Imagen */}
                {selectedNoticia.url_imagen && (
                  <div>
                    <img
                      src={selectedNoticia.url_imagen}
                      alt={selectedNoticia.titulo}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Información General */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedNoticia.titulo}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    {selectedNoticia.autor && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {selectedNoticia.autor}
                      </div>
                    )}
                    {selectedNoticia.fecha_publicacion && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(selectedNoticia.fecha_publicacion)}
                      </div>
                    )}
                    {selectedNoticia.categoria && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedNoticia.categoria}
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedNoticia.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedNoticia.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                {selectedNoticia.contenido && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Contenido</h4>
                    <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                      {selectedNoticia.contenido}
                    </div>
                  </div>
                )}

                {/* Información del Sistema */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Información del Sistema</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">ID</p>
                      <p className="font-medium">{selectedNoticia.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fecha de Creación</p>
                      <p className="font-medium">{formatDate(selectedNoticia.created_at)}</p>
                    </div>
                    {selectedNoticia.updated_at && (
                      <div>
                        <p className="text-gray-600">Última Actualización</p>
                        <p className="font-medium">{formatDate(selectedNoticia.updated_at)}</p>
                      </div>
                    )}
                  </div>
                </div>

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
                      handleEditNoticia(selectedNoticia);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Editar Noticia
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

export default NoticiasSection;