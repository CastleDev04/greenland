import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit,   
  Trash2, 
  Phone, 
  Mail, 
  MapPin,
  User,
  Calendar,
  FileText,
  MoreVertical,
  ChevronLeft,
  ChevronRight,Eye
} from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-PY');
};

export default function ClienteList({ 
  clientes: clientesFromProps,
  onCreateClick,
  onEditClick, 
  onDeleteClick,
}) {
  const clientes = clientesFromProps || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNacionalidad, setFilterNacionalidad] = useState('');
  const [filterEstadoCivil, setFilterEstadoCivil] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleView = (cliente) => {
    setSelectedCliente(cliente);
    setShowClienteModal(true);
  };
  // Reemplazar las funciones de acción existentes:
  const handleEdit = (cliente) => {
    onEditClick(cliente);
  };

  const handleDelete = (cliente) => {
    onDeleteClick(cliente);
  };

  // Filtros y búsqueda
  const filteredClientes = useMemo(() => {
    return clientes.filter(cliente => {
      const matchesSearch = searchTerm === '' || 
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cedula.includes(searchTerm) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesNacionalidad = filterNacionalidad === '' || 
        cliente.nacionalidad === filterNacionalidad;

      const matchesEstadoCivil = filterEstadoCivil === '' || 
        cliente.estadoCivil === filterEstadoCivil;

      return matchesSearch && matchesNacionalidad && matchesEstadoCivil;
    });
  }, [clientes, searchTerm, filterNacionalidad, filterEstadoCivil]);

  // Paginación
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const paginatedClientes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClientes.slice(start, start + itemsPerPage);
  }, [filteredClientes, currentPage, itemsPerPage]);

  

  

  const getStatusColor = (lotes) => {
    if (lotes.length === 0) return 'bg-gray-100 text-gray-800';
    if (lotes.length === 1) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (lotes) => {
    if (lotes.length === 0) return 'Sin lotes';
    if (lotes.length === 1) return '1 lote';
    return `${lotes.length} lotes`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
            <p className="text-gray-600 mt-1">
              Gestiona la información de todos los clientes
            </p>
          </div>
          <button onClick={onCreateClick} className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
            <Plus size={20} className="mr-2" />
            Nuevo Cliente
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
              placeholder="Buscar por nombre, apellido, cédula o email..."
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
                Nacionalidad
              </label>
              <select
                value={filterNacionalidad}
                onChange={(e) => setFilterNacionalidad(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las nacionalidades</option>
                <option value="Paraguaya">Paraguaya</option>
                <option value="Argentina">Argentina</option>
                <option value="Brasileña">Brasileña</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado Civil
              </label>
              <select
                value={filterEstadoCivil}
                onChange={(e) => setFilterEstadoCivil(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="Soltero">Soltero</option>
                <option value="Casado">Casado</option>
                <option value="Divorciado">Divorciado</option>
                <option value="Viudo">Viudo</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <User className="text-blue-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-blue-600">Total Clientes</p>
              <p className="text-2xl font-bold text-blue-800">{clientes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <FileText className="text-green-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-green-600">Con Lotes</p>
              <p className="text-2xl font-bold text-green-800">
                {clientes.filter(c => c.lotes.length > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Calendar className="text-yellow-600" size={24} />
            <div className="ml-3">
              <p className="text-sm text-yellow-600">Este Mes</p>
              <p className="text-2xl font-bold text-yellow-800">
                {clientes.filter(c => c.createdAt.includes('2024-04')).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Información
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lotes
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
              {paginatedClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {cliente.nombre} {cliente.apellido}
                      </div>
                      <div className="text-sm text-gray-500">
                        CI: {cliente.cedula}
                      </div>
                      {cliente.ruc && (
                        <div className="text-sm text-gray-500">
                          RUC: {cliente.ruc}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center mb-1">
                      <Mail size={14} className="mr-1 text-gray-400" />
                      {cliente.email}
                    </div>
                    {cliente.telefono && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone size={14} className="mr-1 text-gray-400" />
                        {cliente.telefono}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cliente.nacionalidad}</div>
                    <div className="text-sm text-gray-500">{cliente.profesion}</div>
                    <div className="text-sm text-gray-500">{cliente.estadoCivil}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(cliente.lotes)}`}>
                      {getStatusText(cliente.lotes)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(cliente.createdAt)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(cliente)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(cliente)}
                        className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cliente)}
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

        {paginatedClientes.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clientes</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron clientes con los filtros aplicados.
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredClientes.length)} de {filteredClientes.length} resultados
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

      {/* Modal de detalles del cliente */}
      {showClienteModal && selectedCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Detalles del Cliente
                </h3>
                <button
                  onClick={() => setShowClienteModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Información Personal</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nombre:</span> {selectedCliente.nombre} {selectedCliente.apellido}</p>
                      <p><span className="font-medium">Cédula:</span> {selectedCliente.cedula}</p>
                      {selectedCliente.ruc && <p><span className="font-medium">RUC:</span> {selectedCliente.ruc}</p>}
                      <p><span className="font-medium">Estado Civil:</span> {selectedCliente.estadoCivil}</p>
                      <p><span className="font-medium">Fecha de Nacimiento:</span> {formatDate(selectedCliente.fechaNacimiento)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Información Profesional</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Profesión:</span> {selectedCliente.profesion}</p>
                      <p><span className="font-medium">Nacionalidad:</span> {selectedCliente.nacionalidad}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Información de Contacto</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center">
                        <Mail size={14} className="mr-2 text-gray-400" />
                        {selectedCliente.email}
                      </p>
                      {selectedCliente.telefono && (
                        <p className="flex items-center">
                          <Phone size={14} className="mr-2 text-gray-400" />
                          {selectedCliente.telefono}
                        </p>
                      )}
                      <p className="flex items-start">
                        <MapPin size={14} className="mr-2 text-gray-400 mt-1" />
                        {selectedCliente.direccion}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Lotes Adquiridos</h4>
                    {selectedCliente.lotes.length > 0 ? (
                      <div className="space-y-1">
                        {selectedCliente.lotes.map((lote, index) => (
                          <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2 mb-1">
                            {lote}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No tiene lotes asignados</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Información del Sistema</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">ID:</span> {selectedCliente.id}</p>
                      <p><span className="font-medium">Fecha de Registro:</span> {formatDate(selectedCliente.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowClienteModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    handleEdit(selectedCliente);
                    setShowClienteModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    )
};
