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
  AlertCircle,
  User,
  Building,
  ChevronRight as ArrowRight,
  ReceiptText
} from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try { return new Date(dateString).toLocaleDateString('es-PY'); }
  catch { return 'Fecha inválida'; }
};

const formatMoney = (amount) => {
  if (!amount && amount !== 0) return 'Gs. 0';
  return new Intl.NumberFormat('es-PY', {
    style: 'currency', currency: 'PYG',
    minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(parseFloat(amount) || 0);
};

// ── Tarjeta de venta con resumen de pagos ──────────────────────────────────────
function VentaCard({ venta, pagosDeVenta = [], onVerPagos }) {
  const isPagoCompletado = (pago) => {
    if (!pago) return false;
    return Boolean(pago.fechaPago || pago.tipoPago || (pago.estado && pago.estado.toLowerCase() === 'pagado'));
  };

  const pagosCompletados = pagosDeVenta.filter(isPagoCompletado);
  const cuotasPendientes = pagosDeVenta.filter(pago => !isPagoCompletado(pago));
  const cuotasVencidas = cuotasPendientes.filter(pago => {
    if (!pago.fecha_vencimiento) return false;
    const vencimiento = new Date(pago.fecha_vencimiento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return vencimiento < hoy;
  });

  const totalPagadoPrincipal = pagosCompletados.reduce((s, p) => s + (parseFloat(p.monto) || 0), 0);
  const totalInteresesPendientes = cuotasPendientes.reduce((s, p) => s + (parseFloat(p.interes) || 0), 0);
  const totalMultasPendientes = cuotasPendientes.reduce((s, p) => s + (parseFloat(p.multa) || 0), 0);
  const totalPagado = venta.monto_pagado !== undefined && venta.monto_pagado !== null
    ? parseFloat(venta.monto_pagado) || (totalPagadoPrincipal + totalInteresesPendientes + totalMultasPendientes)
    : pagosCompletados.reduce(
        (s, p) => s + (parseFloat(p.monto) || 0) + (parseFloat(p.interes) || 0) + (parseFloat(p.multa) || 0),
        0
      );

  const principalPendiente = Math.max(0, (venta.montoTotal || 0) - totalPagadoPrincipal);
  const saldo = Math.max(0, principalPendiente + totalInteresesPendientes + totalMultasPendientes);
  const porcentaje = venta.montoTotal > 0
    ? Math.min(100, Math.round((totalPagadoPrincipal / venta.montoTotal) * 100))
    : 0;

  const getClienteNombre = (v) => {
    if (!v) return 'Cliente';
    if (v.cliente?.nombre && v.cliente?.apellido) return `${v.cliente.nombre} ${v.cliente.apellido}`;
    if (v.cliente?.nombre) return v.cliente.nombre;
    if (v.clienteNombre) return v.clienteNombre;
    return `Cliente #${v.cliente_id || v.id}`;
  };

  const getLoteInfo = (v) => {
    if (v.lote?.numero) return `Lote ${v.lote.numero}`;
    if (v.lote_numero) return `Lote ${v.lote_numero}`;
    return 'Sin lote';
  };

  const estadoColor = {
    pagado: 'bg-green-100 text-green-800 border-green-200',
    cancelado: 'bg-gray-100 text-gray-700 border-gray-200',
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    activo: 'bg-blue-100 text-blue-800 border-blue-200',
  }[venta.estado?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Venta #{venta.id}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${estadoColor}`}>
              {venta.estado || 'pendiente'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-800 font-semibold">
            <User size={14} className="text-gray-400" />
            <span>{getClienteNombre(venta)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
            <Building size={13} className="text-gray-400" />
            <span>{getLoteInfo(venta)}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total venta</p>
          <p className="text-base font-bold text-gray-900">{formatMoney(venta.montoTotal)}</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Pagado: <span className="font-semibold text-green-700">{formatMoney(totalPagado)}</span></span>
          <span>Saldo: <span className={`font-semibold ${saldo > 0 ? 'text-red-600' : 'text-green-600'}`}>{formatMoney(saldo)}</span></span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${porcentaje}%`,
              background: porcentaje >= 100
                ? '#16a34a'
                : porcentaje >= 50
                ? '#2563eb'
                : '#f59e0b'
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>
            {pagosCompletados.length} pago{pagosCompletados.length !== 1 ? 's' : ''} registrado{pagosCompletados.length !== 1 ? 's' : ''}
            {cuotasPendientes.length > 0 && (
              <> • {cuotasPendientes.length} pendiente{cuotasPendientes.length !== 1 ? 's' : ''}</>
            )}
            {cuotasVencidas.length > 0 && (
              <> • {cuotasVencidas.length} vencida{cuotasVencidas.length !== 1 ? 's' : ''}</>
            )}
          </span>
          <span>{porcentaje}% pagado</span>
        </div>
      </div>

      <button
        onClick={() => onVerPagos(venta)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <ReceiptText size={16} />
        Ver pagos de esta venta
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function PagosList({
  pagos: pagosFromProps,
  ventas = [],
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onVerPagosVenta,
  loading = false,
  modoVentas = false,  // true: muestra cards de ventas agrupadas
}) {
  const pagos = useMemo(() => {
    if (!pagosFromProps) return [];
    return Array.isArray(pagosFromProps) ? pagosFromProps : [];
  }, [pagosFromProps]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipoPago, setFilterTipoPago] = useState('');
  const [filterMes, setFilterMes] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleView = (pago) => { setSelectedPago(pago); setShowPagoModal(true); };
  const handleEdit = (pago) => { if (onEditClick) onEditClick(pago); };
  const handleDelete = (pago) => { if (onDeleteClick) onDeleteClick(pago); };

  const getVentaInfo = (ventaId) => {
    if (!ventaId) return null;
    return ventas.find(v => v.id === ventaId || v.id === parseInt(ventaId)) || null;
  };

  const getClienteNombre = (ventaInfo) => {
    if (!ventaInfo) return 'Cliente no encontrado';
    if (ventaInfo.cliente?.nombre && ventaInfo.cliente?.apellido)
      return `${ventaInfo.cliente.nombre} ${ventaInfo.cliente.apellido}`;
    if (ventaInfo.cliente?.nombre) return ventaInfo.cliente.nombre;
    if (ventaInfo.clienteNombre) return ventaInfo.clienteNombre;
    if (ventaInfo.cliente_id) return `Cliente #${ventaInfo.cliente_id}`;
    return 'Cliente no especificado';
  };

  const filteredPagos = useMemo(() => {
    if (!Array.isArray(pagos) || pagos.length === 0) return [];
    return pagos.filter(pago => {
      if (!pago || typeof pago !== 'object') return false;
      const ventaInfo = getVentaInfo(pago.venta_id);
      const clienteNombre = getClienteNombre(ventaInfo);
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        (pago.comprobante && pago.comprobante.toLowerCase().includes(searchLower)) ||
        (pago.tipoPago && pago.tipoPago.toLowerCase().includes(searchLower)) ||
        (pago.id && pago.id.toString().includes(searchLower)) ||
        (pago.venta_id && pago.venta_id.toString().includes(searchLower)) ||
        clienteNombre.toLowerCase().includes(searchLower);
      const matchesTipoPago = filterTipoPago === '' ||
        (pago.tipoPago && pago.tipoPago.toLowerCase() === filterTipoPago.toLowerCase());
      const matchesMes = filterMes === '' ||
        (pago.fechaPago && pago.fechaPago.startsWith(filterMes));
      return matchesSearch && matchesTipoPago && matchesMes;
    });
  }, [pagos, searchTerm, filterTipoPago, filterMes, ventas, getVentaInfo]);

  const totalPages = Math.ceil(filteredPagos.length / itemsPerPage) || 1;
  const paginatedPagos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPagos.slice(start, start + itemsPerPage);
  }, [filteredPagos, currentPage, itemsPerPage]);

  const totales = useMemo(() => {
    return filteredPagos.reduce((acc, pago) => {
      if (!pago) return acc;
      acc.total += parseFloat(pago.monto || 0);
      acc.intereses += parseFloat(pago.interes || 0);
      acc.multas += parseFloat(pago.multa || 0);
      acc.totalGeneral += parseFloat(pago.monto || 0) + parseFloat(pago.interes || 0) + parseFloat(pago.multa || 0);
      return acc;
    }, { total: 0, intereses: 0, multas: 0, totalGeneral: 0, count: filteredPagos.length });
  }, [filteredPagos]);

  const getTipoPagoColor = (tipo) => {
    if (!tipo) return 'bg-gray-100 text-gray-800';
    switch (tipo.toLowerCase()) {
      case 'efectivo': return 'bg-green-100 text-green-800 border border-green-200';
      case 'transferencia': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'cheque': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'tarjeta': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'deposito': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'giro': return 'bg-pink-100 text-pink-800 border border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // ── MODO VENTAS: grid de cards por venta ──────────────────────────────────────
  if (modoVentas) {
    const ventasConPagos = ventas.filter(v => v && v.id);

    // Filtrar ventas por búsqueda
    const ventasFiltradas = ventasConPagos.filter(v => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      const nombre = getClienteNombre(v).toLowerCase();
      return (
        nombre.includes(s) ||
        v.id?.toString().includes(s) ||
        v.lote?.numero?.toString().includes(s)
      );
    });

    return (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Pagos por Venta</h1>
              <p className="text-gray-600 mt-1">
                {ventasConPagos.length} venta{ventasConPagos.length !== 1 ? 's' : ''} registrada{ventasConPagos.length !== 1 ? 's' : ''}
              </p>
            </div>
            {onCreateClick && (
              <button
                onClick={onCreateClick}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Nuevo Pago
              </button>
            )}
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por cliente, lote o ID de venta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-2 text-gray-600">Cargando ventas...</p>
          </div>
        )}

        {!loading && ventasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ventas</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No se encontraron ventas con esos criterios.' : 'No hay ventas registradas en el sistema.'}
            </p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ventasFiltradas.map(venta => (
              <VentaCard
                key={venta.id}
                venta={venta}
                pagosDeVenta={pagos.filter(p => p.venta_id === venta.id)}
                onVerPagos={onVerPagosVenta}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── MODO TABLA CLÁSICA ──────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pagos</h1>
            <p className="text-gray-600 mt-1">Gestiona los pagos de las ventas realizadas</p>
          </div>
          {onCreateClick && (
            <button
              onClick={onCreateClick}
              className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Nuevo Pago
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por comprobante, tipo, cliente o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-100'}`}
          >
            <Filter size={20} className="mr-2" />
            Filtros
            {(filterTipoPago || filterMes) && (
              <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">!</span>
            )}
          </button>
        </div>
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pago</label>
              <select value={filterTipoPago} onChange={(e) => setFilterTipoPago(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Todos los tipos</option>
                {['efectivo','transferencia','cheque','tarjeta','deposito','giro'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
              <input type="month" value={filterMes} onChange={(e) => setFilterMes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-end">
              <button onClick={() => { setFilterTipoPago(''); setFilterMes(''); setSearchTerm(''); }}
                className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100">
                Limpiar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Cargando pagos...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Pagos', value: totales.count, Icon: CreditCard, color: 'blue', isCount: true },
              { label: 'Monto Principal', value: totales.total, Icon: DollarSign, color: 'green' },
              { label: 'Intereses', value: totales.intereses, Icon: AlertCircle, color: 'yellow' },
              { label: 'Multas', value: totales.multas, Icon: AlertCircle, color: 'red' },
            ].map(({ label, value, Icon, color, isCount }) => (
              <div key={label} className={`bg-${color}-50 p-4 rounded-lg border border-${color}-200`}>
                <div className="flex items-center">
                  <Icon className={`text-${color}-600`} size={24} />
                  <div className="ml-3">
                    <p className={`text-sm text-${color}-600`}>{label}</p>
                    <p className={`text-xl font-bold text-${color}-800`}>
                      {isCount ? value : formatMoney(value)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Fecha', 'Venta/Cliente', 'Monto', 'Tipo', 'Cargos', 'Comprobante', 'Acciones'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPagos.map((pago) => {
                    const ventaInfo = getVentaInfo(pago.venta_id);
                    const clienteNombre = getClienteNombre(ventaInfo);
                    const totalPago = (parseFloat(pago.monto) || 0) + (parseFloat(pago.interes) || 0) + (parseFloat(pago.multa) || 0);
                    return (
                      <tr key={pago.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar size={14} className="mr-2 text-gray-400" />
                            {formatDate(pago.fechaPago)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            <User size={14} className="mr-1 text-gray-400" />{clienteNombre}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Venta #{pago.venta_id}{pago.numero_cuota && ` • Cuota ${pago.numero_cuota}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-bold text-gray-900">{formatMoney(totalPago)}</div>
                          <div className="text-xs text-gray-500">{formatMoney(pago.monto)} base</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoPagoColor(pago.tipoPago)}`}>
                            {pago.tipoPago || 'No especificado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {pago.interes > 0 && <div className="text-yellow-700 text-xs">Interés: {formatMoney(pago.interes)}</div>}
                          {pago.multa > 0 && <div className="text-red-700 text-xs">Multa: {formatMoney(pago.multa)}</div>}
                          {(!pago.interes || pago.interes <= 0) && (!pago.multa || pago.multa <= 0) && (
                            <span className="text-gray-400 text-xs">Sin cargos</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pago.comprobante ? (
                            <div className="flex items-center">
                              <FileText size={14} className="mr-1 text-gray-400" />
                              <span className="max-w-32 truncate" title={pago.comprobante}>{pago.comprobante}</span>
                            </div>
                          ) : <span className="text-gray-400 text-xs">Sin comprobante</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-1">
                            <button onClick={() => handleView(pago)}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded transition-colors hover:bg-blue-50" title="Ver detalles">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => handleEdit(pago)}
                              className="text-green-600 hover:text-green-900 p-2 rounded transition-colors hover:bg-green-50" title="Editar">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(pago)}
                              className="text-red-600 hover:text-red-900 p-2 rounded transition-colors hover:bg-red-50" title="Eliminar">
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

            {paginatedPagos.length === 0 && !loading && (
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
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredPagos.length)} de {filteredPagos.length} resultados
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft size={16} className="mr-1" />Anterior
                </button>
                <div className="flex space-x-1">
                  {getPageNumbers().map(n => (
                    <button key={n} onClick={() => setCurrentPage(n)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === n ? 'bg-blue-600 text-white border border-blue-600' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}`}>
                      {n}
                    </button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Siguiente<ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal detalle de pago */}
      {showPagoModal && selectedPago && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800">Detalles del Pago #{selectedPago.id}</h3>
                <button onClick={() => setShowPagoModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <CreditCard size={16} className="mr-2" />Información del Pago
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div><p className="text-gray-600 text-xs uppercase tracking-wide">ID Pago</p><p className="font-medium">#{selectedPago.id}</p></div>
                    <div><p className="text-gray-600 text-xs uppercase tracking-wide">ID Venta</p><p className="font-medium">#{selectedPago.venta_id}</p></div>
                    <div><p className="text-gray-600 text-xs uppercase tracking-wide">Fecha de Pago</p><p className="font-medium">{formatDate(selectedPago.fechaPago)}</p></div>
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-wide">Tipo de Pago</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTipoPagoColor(selectedPago.tipoPago)}`}>
                        {selectedPago.tipoPago}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <DollarSign size={16} className="mr-2" />Detalles de Montos
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Monto principal:</span><span className="font-semibold">{formatMoney(selectedPago.monto)}</span></div>
                    {selectedPago.interes > 0 && <div className="flex justify-between"><span className="text-gray-600">Interés moratorio:</span><span className="font-medium text-yellow-700">{formatMoney(selectedPago.interes)}</span></div>}
                    {selectedPago.multa > 0 && <div className="flex justify-between"><span className="text-gray-600">Multa por mora:</span><span className="font-medium text-red-700">{formatMoney(selectedPago.multa)}</span></div>}
                    <div className="border-t border-green-200 pt-2 flex justify-between">
                      <span className="font-semibold text-gray-700">Total pagado:</span>
                      <span className="font-bold text-lg text-green-700">
                        {formatMoney((parseFloat(selectedPago.monto) || 0) + (parseFloat(selectedPago.interes) || 0) + (parseFloat(selectedPago.multa) || 0))}
                      </span>
                    </div>
                  </div>
                </div>
                {selectedPago.comprobante && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><FileText size={16} className="mr-2" />Comprobante</h4>
                    <div className="flex items-center text-sm bg-white p-2 rounded border">
                      <FileText size={16} className="mr-2 text-gray-400" />
                      <span className="font-mono">{selectedPago.comprobante}</span>
                    </div>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-500 space-y-1">
                  <p>📅 Registrado el: {formatDate(selectedPago.created_at)}</p>
                  {selectedPago.updated_at && selectedPago.updated_at !== selectedPago.created_at && (
                    <p>✏️ Última actualización: {formatDate(selectedPago.updated_at)}</p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button onClick={() => setShowPagoModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cerrar
                </button>
                <button onClick={() => { handleEdit(selectedPago); setShowPagoModal(false); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                  <Edit size={16} className="mr-2" />Editar Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}