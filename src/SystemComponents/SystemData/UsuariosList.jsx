// components/UsuariosList.jsx
import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit,   
  Trash2, 
  User,
  Mail,
  Shield,
  ChevronLeft,
  ChevronRight,
  Eye,
  Key,
  UserCheck,
  UserX
} from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-PY');
};

export default function UsuariosList({ 
  usuarios: usuariosFromProps,
  onCreateClick,
  onEditClick, 
  onDeleteClick,
  // onChangePasswordClick,
}) {
  const usuarios = Array.isArray(usuariosFromProps) ? usuariosFromProps : [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const roles = ['ADMIN', 'USUARIO', 'VENDEDOR', 'COBRANZA', 'MODERADOR', 'CLIENTE'];

  const handleView = (usuario) => {
    setSelectedUsuario(usuario);
    setShowUsuarioModal(true);
  };

  const handleEdit = (usuario) => {
    onEditClick(usuario);
  };

  const handleDelete = (usuario) => {
    onDeleteClick(usuario);
  };

  // const handleChangePassword = (usuario) => {
  //   onChangePasswordClick(usuario);
  // };

  // Filtros y búsqueda
  const filteredUsuarios = useMemo(() => {
    if (!Array.isArray(usuarios)) return [];
    
    return usuarios.filter(usuario => {
      if (!usuario) return false;
      
      const matchesSearch = searchTerm === '' || 
        (usuario.nombre && usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (usuario.email && usuario.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRol = filterRol === '' || usuario.rol === filterRol;

      return matchesSearch && matchesRol;
    });
  }, [usuarios, searchTerm, filterRol]);

  // Paginación
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const paginatedUsuarios = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsuarios.slice(start, start + itemsPerPage);
  }, [filteredUsuarios, currentPage, itemsPerPage]);

  const getRolColor = (rol) => {
    switch(rol) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'VENDEDOR':
        return 'bg-blue-100 text-blue-800';
      case 'COBRANZA':
        return 'bg-green-100 text-green-800';
      case 'MODERADOR':
        return 'bg-purple-100 text-purple-800';
      case 'CLIENTE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRolIcon = (rol) => {
    switch(rol) {
      case 'ADMIN':
        return <Shield size={14} />;
      case 'VENDEDOR':
        return <UserCheck size={14} />;
      case 'COBRANZA':
        return <UserCheck size={14} />;
      case 'MODERADOR':
        return <Shield size={14} />;
      case 'CLIENTE':
        return <User size={14} />;
      default:
        return <User size={14} />;
    }
  };

  // Calcular estadísticas por rol
  const estadisticasRol = useMemo(() => {
    return usuarios.reduce((acc, usuario) => {
      acc[usuario.rol] = (acc[usuario.rol] || 0) + 1;
      return acc;
    }, {});
  }, [usuarios]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los usuarios del sistema
            </p>
          </div>
          <button 
            onClick={onCreateClick} 
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Nuevo Usuario
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
              placeholder="Buscar por nombre o email..."
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los roles</option>
              {roles.map(rol => (
                <option key={rol} value={rol}>{rol}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <User className="text-blue-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-blue-600">Total</p>
              <p className="text-2xl font-bold text-blue-800">{usuarios.length}</p>
            </div>
          </div>
        </div>
        
        {roles.map(rol => (
          estadisticasRol[rol] > 0 && (
            <div key={rol} className={`p-4 rounded-lg ${getRolColor(rol).replace('text-', 'bg-').replace('800', '50')}`}>
              <div className="flex items-center">
                {getRolIcon(rol)}
                <div className="ml-3">
                  <p className={`text-sm ${getRolColor(rol).split(' ')[1]}`}>{rol}</p>
                  <p className={`text-2xl font-bold ${getRolColor(rol).split(' ')[1]}`}>
                    {estadisticasRol[rol]}
                  </p>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="text-blue-600" size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {usuario.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail size={14} className="mr-2 text-gray-400" />
                      {usuario.email}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getRolColor(usuario.rol)}`}>
                      {getRolIcon(usuario.rol)}
                      <span className="ml-1">{usuario.rol}</span>
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(usuario.created_at)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(usuario)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(usuario)}
                        className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      {/* <button
                        onClick={() => handleChangePassword(usuario)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded transition-colors"
                        title="Cambiar contraseña"
                      >
                        <Key size={16} />
                      </button> */}
                      <button
                        onClick={() => handleDelete(usuario)}
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

        {paginatedUsuarios.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
            <p className="mt-1 text-sm text-gray-500">
              {usuarios.length === 0 ? 'No hay usuarios registrados.' : 'No se encontraron usuarios con los filtros aplicados.'}
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredUsuarios.length)} de {filteredUsuarios.length} resultados
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

      {/* Modal de detalles del usuario */}
      {showUsuarioModal && selectedUsuario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Detalles del Usuario
                </h3>
                <button
                  onClick={() => setShowUsuarioModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="text-blue-600" size={40} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800">{selectedUsuario.nombre}</h4>
                    <p className="text-gray-600">{selectedUsuario.email}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Información del Usuario</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium">#{selectedUsuario.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre:</span>
                      <span className="font-medium">{selectedUsuario.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedUsuario.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rol:</span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getRolColor(selectedUsuario.rol)}`}>
                        {getRolIcon(selectedUsuario.rol)}
                        <span className="ml-1">{selectedUsuario.rol}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Registro</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Fecha de registro:</span> <span className="font-medium">{formatDate(selectedUsuario.created_at)}</span></p>
                    {selectedUsuario.updated_at && selectedUsuario.updated_at !== selectedUsuario.created_at && (
                      <p><span className="text-gray-600">Última actualización:</span> <span className="font-medium">{formatDate(selectedUsuario.updated_at)}</span></p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUsuarioModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    handleEdit(selectedUsuario);
                    setShowUsuarioModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}