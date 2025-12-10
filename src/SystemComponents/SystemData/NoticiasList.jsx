// src/components/SystemComponents/NoticiasList.jsx
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
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Tag
} from 'lucide-react';
import { useNoticias } from '../../hook/useNoticias';
import NoticiasForm from './NoticiasForm';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('es-PY');
  } catch {
    return 'Fecha inválida';
  }
};

const NoticiasList = () => {
  const { 
    noticias, 
    loading, 
    createNoticia, 
    updateNoticia, 
    deleteNoticia
  } = useNoticias();
  
  const [filterCategoria, setFilterCategoria] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNoticia, setSelectedNoticia] = useState(null);
  const [showNoticiaModal, setShowNoticiaModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNoticia, setEditingNoticia] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Filtros y búsqueda
  const filteredNoticias = useMemo(() => {
    if (!Array.isArray(noticias)) {
      console.warn('noticias no es un array:', noticias);
      return [];
    }
    
    return noticias.filter(noticia => {
      if (!noticia) return false;
      
      const matchesSearch = searchTerm === '' || 
        (noticia.titulo && noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (noticia.contenido && noticia.contenido.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (noticia.autor && noticia.autor.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategoria = filterCategoria === '' || 
        noticia.categoria === filterCategoria;

      const matchesActivo = filterActivo === '' || 
        (filterActivo === 'activo' && noticia.activo) ||
        (filterActivo === 'inactivo' && !noticia.activo);

      return matchesSearch && matchesCategoria && matchesActivo;
    });
  }, [noticias, searchTerm, filterCategoria, filterActivo]);

  // Paginación
  const totalPages = Math.ceil(filteredNoticias.length / itemsPerPage);
  const paginatedNoticias = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNoticias.slice(start, start + itemsPerPage);
  }, [filteredNoticias, currentPage, itemsPerPage]);

  // Obtener categorías únicas
  const categorias = useMemo(() => {
    const cats = noticias.map(n => n.categoria).filter(Boolean);
    return [...new Set(cats)];
  }, [noticias]);

  // Handlers
  const handleView = (noticia) => {
    setSelectedNoticia(noticia);
    setShowNoticiaModal(true);
  };

  const handleEdit = (noticia) => {
    setEditingNoticia(noticia);
  };

  const handleDelete = async (noticia) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la noticia "${noticia.titulo}"?`)) {
      try {
        await deleteNoticia(noticia.id);
      } catch (error) {
        console.error('Error eliminando noticia:', error);
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
    }
  };

  const handleCreate = async (noticiaData, file) => {
    try {
      await createNoticia(noticiaData, file);
      setShowForm(false);
    } catch (error) {
      console.error('Error creando noticia:', error);
      throw error;
    }
  };

  const handleUpdate = async (id, noticiaData, file) => {
    try {
      await updateNoticia(id, noticiaData, file);
      setEditingNoticia(null);
    } catch (error) {
      console.error('Error actualizando noticia:', error);
      throw error;
    }
  };

  // Estadísticas
  const estadisticas = useMemo(() => {
    const totalNoticias = noticias.length;
    const noticiasActivas = noticias.filter(n => n.activo).length;
    
    // Noticias creadas este mes
    const esteMes = new Date().getMonth() + 1;
    const esteAnio = new Date().getFullYear();
    const noticiasEsteMes = noticias.filter(noticia => {
      if (!noticia.created_at) return false;
      const fecha = new Date(noticia.created_at);
      return fecha.getMonth() + 1 === esteMes && fecha.getFullYear() === esteAnio;
    }).length;

    // Contar por categoría (top categoría)
    const categoriasCount = {};
    noticias.forEach(n => {
      if (n.categoria) {
        categoriasCount[n.categoria] = (categoriasCount[n.categoria] || 0) + 1;
      }
    });
    const topCategoria = Object.entries(categoriasCount).sort((a, b) => b[1] - a[1])[0];

    return { 
      totalNoticias, 
      noticiasActivas, 
      noticiasEsteMes,
      topCategoria: topCategoria ? topCategoria[0] : 'N/A'
    };
  }, [noticias]);

  if (loading && noticias.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-800">Noticias</h1>
            <p className="text-gray-600 mt-1">
              Gestiona las noticias y artículos de tu sitio
            </p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Nueva Noticia
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
              placeholder="Buscar por título, contenido o autor..."
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
                Categoría
              </label>
              <select
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
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
            <FileText className="text-blue-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-blue-600">Total Noticias</p>
              <p className="text-2xl font-bold text-blue-800">{estadisticas.totalNoticias}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Eye className="text-green-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-green-600">Activas</p>
              <p className="text-2xl font-bold text-green-800">{estadisticas.noticiasActivas}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Calendar className="text-purple-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-purple-600">Este Mes</p>
              <p className="text-2xl font-bold text-purple-800">{estadisticas.noticiasEsteMes}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Tag className="text-orange-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-orange-600">Top Categoría</p>
              <p className="text-lg font-bold text-orange-800 truncate">{estadisticas.topCategoria}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Noticias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedNoticias.map((noticia) => (
          <div key={noticia.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
            {/* Image Preview */}
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              {noticia.url_imagen ? (
                <img
                  src={noticia.url_imagen}
                  alt={noticia.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Image size={48} className="text-gray-400" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex space-x-1">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  noticia.activo 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {noticia.activo ? 'Activo' : 'Inactivo'}
                </span>
                {noticia.categoria && (
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-500 text-white">
                    {noticia.categoria}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                {noticia.titulo}
              </h3>
              
              {noticia.contenido && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {noticia.contenido}
                </p>
              )}

              {/* Metadata */}
              <div className="text-xs text-gray-500 space-y-1 mb-3">
                {noticia.autor && (
                  <div className="flex items-center">
                    <span className="font-medium">Autor:</span>
                    <span className="ml-1">{noticia.autor}</span>
                  </div>
                )}
                {noticia.fecha_publicacion && (
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(noticia.fecha_publicacion)}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleActivo(noticia)}
                    className={`p-2 rounded ${
                      noticia.activo 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={noticia.activo ? 'Desactivar' : 'Activar'}
                  >
                    {noticia.activo ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  
                  <button
                    onClick={() => handleView(noticia)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Ver detalles"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => handleEdit(noticia)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(noticia)}
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
      {paginatedNoticias.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay noticias</h3>
          <p className="mt-1 text-sm text-gray-500">
            {noticias.length === 0 ? 'No hay noticias registradas.' : 'No se encontraron noticias con los filtros aplicados.'}
          </p>
          {noticias.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Primera Noticia
            </button>
          )}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredNoticias.length)} de {filteredNoticias.length} resultados
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

      {/* Modal de detalles de la noticia */}
      {showNoticiaModal && selectedNoticia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Detalles de la Noticia
                </h3>
                <button
                  onClick={() => setShowNoticiaModal(false)}
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
                      <p><span className="font-medium">Título:</span> {selectedNoticia.titulo}</p>
                      <p><span className="font-medium">Estado:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          selectedNoticia.activo 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {selectedNoticia.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </p>
                      {selectedNoticia.categoria && (
                        <p><span className="font-medium">Categoría:</span> 
                          <span className="ml-2 px-2 py-1 rounded-full text-xs bg-blue-500 text-white">
                            {selectedNoticia.categoria}
                          </span>
                        </p>
                      )}
                      {selectedNoticia.autor && (
                        <p><span className="font-medium">Autor:</span> {selectedNoticia.autor}</p>
                      )}
                    </div>
                  </div>

                  {selectedNoticia.contenido && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Contenido</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedNoticia.contenido}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Fechas</h4>
                    <div className="space-y-2 text-sm">
                      {selectedNoticia.fecha_publicacion && (
                        <p><span className="font-medium">Publicación:</span> {formatDate(selectedNoticia.fecha_publicacion)}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Imagen</h4>
                    {selectedNoticia.url_imagen ? (
                      <div className="border rounded-lg p-4">
                        <img
                          src={selectedNoticia.url_imagen}
                          alt={selectedNoticia.titulo}
                          className="w-full h-48 object-cover rounded mb-3"
                        />
                        <div className="text-sm">
                          <p className="text-gray-500 truncate">URL: {selectedNoticia.url_imagen}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No hay imagen</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Información del Sistema</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">ID:</span> {selectedNoticia.id}</p>
                      <p><span className="font-medium">Fecha de Creación:</span> {formatDate(selectedNoticia.created_at)}</p>
                      {selectedNoticia.updated_at && (
                        <p><span className="font-medium">Última Actualización:</span> {formatDate(selectedNoticia.updated_at)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowNoticiaModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    handleEdit(selectedNoticia);
                    setShowNoticiaModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar Noticia
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forms */}
      {showForm && (
        <NoticiasForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isLoading={loading}
        />
      )}

      {editingNoticia && (
        <NoticiasForm
          noticiaData={editingNoticia}
          onSubmit={(data, file) => handleUpdate(editingNoticia.id, data, file)}
          onCancel={() => setEditingNoticia(null)}
          isEditing={true}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default NoticiasList;