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
  FileText,
  ArrowLeft,
  Phone,
  Mail,
  Home,
  Printer,
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const VentasList = ({ 
  ventas = [], 
  onEdit, 
  onDelete,
  loading = false 
}) => {
  // Validación crítica - asegurar que ventas sea siempre un array
  const ventasValidas = Array.isArray(ventas) ? ventas : [];
  
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
  
  // Estados para la vista de detalle
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  // Manejar vista de detalle
  const handleView = (venta) => {
    setVentaSeleccionada(venta);
    setMostrarDetalle(true);
  };

  const handleBackToList = () => {
    setMostrarDetalle(false);
    setVentaSeleccionada(null);
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-PY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha inválida';
    }
  };

  // Formatear fecha completa
  const formatDateLong = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      return new Date(dateString).toLocaleDateString('es-PY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha larga:', error);
      return 'Fecha inválida';
    }
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
        {estado || 'Activa'}
      </span>
    );
  };

  // Estados con colores para detalle
  const getEstadoConfig = (estado) => {
    const estados = {
      'Activa': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock, border: 'border-blue-200' },
      'Finalizada': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, border: 'border-green-200' },
      'Cancelada': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, border: 'border-red-200' }
    };
    return estados[estado] || estados['Activa'];
  };

  // Filtrar y ordenar ventas
  const ventasFiltradas = useMemo(() => {
    if (!Array.isArray(ventasValidas)) {
      console.warn('ventasValidas no es un array:', ventasValidas);
      return [];
    }

    let resultado = ventasValidas.filter(venta => {
      if (!venta) return false;

      const matchBusqueda = !filtros.busqueda || 
        venta.cliente?.nombre?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        venta.cliente?.apellido?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        venta.cliente?.cedula?.includes(filtros.busqueda) ||
        venta.lote?.fraccionamiento?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        venta.lote?.manzana?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        venta.lote?.lote?.toLowerCase().includes(filtros.busqueda.toLowerCase());

      const matchEstado = !filtros.estado || venta.estado === filtros.estado;
      const matchTipoPago = !filtros.tipoPago || venta.tipoPago === filtros.tipoPago;
      const matchCliente = !filtros.cliente || (venta.clienteId && venta.clienteId.toString() === filtros.cliente);
      
      const fechaVenta = venta.fecha ? new Date(venta.fecha) : new Date();
      const matchFechaDesde = !filtros.fechaDesde || fechaVenta >= new Date(filtros.fechaDesde);
      const matchFechaHasta = !filtros.fechaHasta || fechaVenta <= new Date(filtros.fechaHasta);

      return matchBusqueda && matchEstado && matchTipoPago && matchCliente && matchFechaDesde && matchFechaHasta;
    });

    // Ordenamiento
    resultado.sort((a, b) => {
      if (!a || !b) return 0;

      let valorA = a[ordenamiento.campo];
      let valorB = b[ordenamiento.campo];

      if (ordenamiento.campo === 'cliente') {
        valorA = `${a.cliente?.nombre || ''} ${a.cliente?.apellido || ''}`.toLowerCase();
        valorB = `${b.cliente?.nombre || ''} ${b.cliente?.apellido || ''}`.toLowerCase();
      } else if (ordenamiento.campo === 'lote') {
        valorA = `${a.lote?.fraccionamiento || ''} ${a.lote?.manzana || ''}-${a.lote?.lote || ''}`.toLowerCase();
        valorB = `${b.lote?.fraccionamiento || ''} ${b.lote?.manzana || ''}-${b.lote?.lote || ''}`.toLowerCase();
      }

      valorA = valorA || '';
      valorB = valorB || '';

      if (valorA < valorB) return ordenamiento.direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return ordenamiento.direccion === 'asc' ? 1 : -1;
      return 0;
    });

    return resultado;
  }, [ventasValidas, filtros, ordenamiento]);

  // Paginación
  const totalPaginas = Math.ceil(ventasFiltradas.length / itemsPorPagina);
  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginaActual(1);
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
  const clientesUnicos = useMemo(() => {
    if (!Array.isArray(ventasValidas)) return [];
    
    const clientesMap = new Map();
    ventasValidas.forEach(venta => {
      if (venta && venta.cliente && venta.cliente.id) {
        clientesMap.set(venta.cliente.id, venta.cliente);
      }
    });
    
    return Array.from(clientesMap.values());
  }, [ventasValidas]);

  // Calcular resumen
  const resumen = useMemo(() => {
    if (!Array.isArray(ventasFiltradas)) {
      return { total: 0, activas: 0, finalizadas: 0, canceladas: 0, montoTotal: 0 };
    }

    const total = ventasFiltradas.length;
    const activas = ventasFiltradas.filter(v => v && v.estado === 'Activa').length;
    const finalizadas = ventasFiltradas.filter(v => v && v.estado === 'Finalizada').length;
    const canceladas = ventasFiltradas.filter(v => v && v.estado === 'Cancelada').length;
    const montoTotal = ventasFiltradas.reduce((sum, v) => sum + (v?.montoTotal || 0), 0);

    return { total, activas, finalizadas, canceladas, montoTotal };
  }, [ventasFiltradas]);

  // Componente de Vista de Detalle
  const VentaDetailView = ({ venta }) => {
    if (!venta) return null;

    const estadoConfig = getEstadoConfig(venta.estado);
    const EstadoIcon = estadoConfig.icon;

    // Calcular progreso de cuotas
    const progresoCalculado = venta.tipoPago === 'Credito' && venta.cantidadCuotas > 0
      ? Math.round((venta.cuotasPagadas / venta.cantidadCuotas) * 100)
      : venta.tipoPago === 'Contado' ? 100 : 0;

    // Calcular monto pendiente
    const montoPagado = venta.tipoPago === 'Credito' 
      ? (venta.cuotasPagadas * venta.montoCuota) 
      : venta.tipoPago === 'Contado' && venta.cuotasPagadas > 0 ? venta.montoTotal : 0;
      
    const montoPendiente = venta.montoTotal - montoPagado;

    return (
      <div className="bg-white">
        {/* Header con navegación */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBackToList}
                className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
              >
                <ArrowLeft size={20} className="mr-2" />
                Volver al listado
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Detalle de Venta #{venta.id}
                </h1>
                <p className="text-gray-600">
                  Creada el {formatDateLong(venta.fecha || venta.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Estado de la venta */}
              <div className={`flex items-center px-4 py-2 rounded-lg border ${estadoConfig.bg} ${estadoConfig.text} ${estadoConfig.border}`}>
                <EstadoIcon size={20} className="mr-2" />
                <span className="font-medium">{venta.estado}</span>
              </div>
              
              {onEdit && venta.estado === 'Activa' && (
                <button
                  onClick={() => onEdit(venta)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit size={16} className="mr-2" />
                  Editar
                </button>
              )}
              
              {/* <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Printer size={16} className="mr-2" />
                Imprimir
              </button> */}
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Información del Cliente */}
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <User className="text-blue-600 mr-3" size={24} />
                  <h2 className="text-xl font-semibold text-gray-900">Información del Cliente</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Datos Personales</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Nombre completo:</span><br />
                        <span className="text-lg">{venta.cliente?.nombre} {venta.cliente?.apellido}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Cédula de Identidad:</span><br />
                        <span>{venta.cliente?.cedula}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Contacto</h3>
                    <div className="space-y-2">
                      {venta.cliente?.telefono && (
                        <div className="flex items-center text-sm">
                          <Phone size={16} className="mr-2 text-gray-400" />
                          {venta.cliente.telefono}
                        </div>
                      )}
                      {venta.cliente?.email && (
                        <div className="flex items-center text-sm">
                          <Mail size={16} className="mr-2 text-gray-400" />
                          {venta.cliente.email}
                        </div>
                      )}
                      {venta.cliente?.direccion && (
                        <div className="flex items-center text-sm">
                          <Home size={16} className="mr-2 text-gray-400" />
                          {venta.cliente.direccion}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del Lote */}
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="text-green-600 mr-3" size={24} />
                  <h2 className="text-xl font-semibold text-gray-900">Información del Lote</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Ubicación</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Fraccionamiento:</span><br />
                        <span className="text-lg">{venta.lote?.fraccionamiento}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Manzana:</span> {venta.lote?.manzana}
                        <span className="ml-4"><span className="font-medium text-gray-700">Lote:</span> {venta.lote?.lote}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Características</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Superficie:</span><br />
                        <span className="text-lg">{venta.lote?.superficie} m²</span>
                      </p>
                      {venta.lote?.precioTotal && (
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Precio base:</span><br />
                          <span className="text-lg font-bold text-green-600">{formatCurrency(venta.lote.precioTotal)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles de Pago */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="text-yellow-600 mr-3" size={24} />
                  <h2 className="text-xl font-semibold text-gray-900">Detalles de Pago</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Modalidad</h3>
                    <div className="space-y-2">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        venta.tipoPago === 'Contado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {venta.tipoPago}
                      </div>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Monto total de la venta:</span><br />
                        <span className="text-2xl font-bold text-gray-900">{formatCurrency(venta.montoTotal)}</span>
                      </p>
                    </div>
                  </div>
                  
                  {venta.tipoPago === 'Credito' && (
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Plan de Cuotas</h3>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Cantidad de cuotas:</span> {venta.cantidadCuotas}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Monto por cuota:</span><br />
                          <span className="text-lg font-bold">{formatCurrency(venta.montoCuota)}</span>
                        </p>
                        {venta.fechaInicioPagos && (
                          <p className="text-sm">
                            <span className="font-medium text-gray-700">Inicio de pagos:</span><br />
                            {formatDateLong(venta.fechaInicioPagos)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Sidebar - Resumen y progreso */}
            <div className="space-y-6">
              
              {/* Resumen financiero */}
              <div className="bg-white border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="mr-2 text-gray-600" size={20} />
                  Resumen Financiero
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Monto total</span>
                    <span className="font-bold text-lg">{formatCurrency(venta.montoTotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="text-sm text-gray-600">Monto pagado</span>
                    <span className="font-bold text-lg text-green-600">{formatCurrency(montoPagado)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                    <span className="text-sm text-gray-600">Monto pendiente</span>
                    <span className="font-bold text-lg text-orange-600">{formatCurrency(montoPendiente)}</span>
                  </div>
                </div>
              </div>

              {/* Progreso de cuotas */}
              {venta.tipoPago === 'Credito' && (
                <div className="bg-white border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="mr-2 text-gray-600" size={20} />
                    Progreso de Cuotas
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Cuotas pagadas</span>
                        <span className="font-medium">{venta.cuotasPagadas}/{venta.cantidadCuotas}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${progresoCalculado}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{progresoCalculado}% completado</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="font-medium text-blue-600">{venta.cuotasPagadas}</p>
                        <p className="text-xs text-gray-600">Pagadas</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="font-medium text-gray-600">{venta.cantidadCuotas - venta.cuotasPagadas}</p>
                        <p className="text-xs text-gray-600">Pendientes</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Información adicional */}
              <div className="bg-white border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="mr-2 text-gray-600" size={20} />
                  Información Adicional
                </h2>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">ID de venta:</span>
                    <p className="text-gray-600">#{venta.id}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Fecha de creación:</span>
                    <p className="text-gray-600">{formatDate(venta.fecha || venta.createdAt)}</p>
                  </div>
                  
                  {venta.updatedAt && (
                    <div>
                      <span className="font-medium text-gray-700">Última modificación:</span>
                      <p className="text-gray-600">{formatDate(venta.updatedAt)}</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="font-medium text-gray-700">Estado actual:</span>
                    <p className="text-gray-600">{venta.estado}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };

  // Si se está mostrando el detalle, renderizar la vista de detalle
  if (mostrarDetalle && ventaSeleccionada) {
    return <VentaDetailView venta={ventaSeleccionada} />;
  }

  // Vista de lista (render principal)
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
            
            {/* {onExport && (
              <button
                onClick={() => onExport(ventasFiltradas)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download size={20} className="mr-2" />
                Exportar
              </button>
            )} */}
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
                      <button
                        onClick={() => handleView(venta)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
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
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} className="mr-1" />
              Anterior
            </button>
            
            <div className="flex gap-1">
              {[...Array(Math.min(5, totalPaginas))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPaginaActual(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      paginaActual === pageNum
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
              onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VentasList;