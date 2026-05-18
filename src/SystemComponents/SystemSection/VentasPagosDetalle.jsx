import { useState, useMemo } from 'react';
import {
  DollarSign, Calendar, FileText, CreditCard,
  Edit, Trash2, Eye, Plus, User, Building,
  TrendingUp, AlertCircle, CheckCircle2, Clock,
  ChevronDown, ChevronUp, ReceiptText, X
} from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try { return new Date(dateString).toLocaleDateString('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return 'Fecha inválida'; }
};

const formatMoney = (amount) => {
  if (!amount && amount !== 0) return 'Gs. 0';
  return new Intl.NumberFormat('es-PY', {
    style: 'currency', currency: 'PYG',
    minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(parseFloat(amount) || 0);
};

const getTipoPagoColor = (tipo) => {
  if (!tipo) return 'bg-gray-100 text-gray-700 border-gray-200';
  switch (tipo.toLowerCase()) {
    case 'efectivo': return 'bg-green-100 text-green-800 border-green-200';
    case 'transferencia': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cheque': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'tarjeta': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'deposito': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'giro': return 'bg-pink-100 text-pink-800 border-pink-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const isPagoCompletado = (pago) => {
  if (!pago) return false;
  return Boolean(
    pago.fechaPago ||
    pago.tipoPago ||
    (pago.estado && pago.estado.toLowerCase() === 'pagado')
  );
};

const getPagoLabel = (pago) => {
  if (!pago) return 'Pago';
  if (isPagoCompletado(pago)) return 'Pago registrado';
  if (pago.numero_cuota) return `Cuota pendiente ${pago.numero_cuota}`;
  return 'Pago pendiente';
};

const isPagoVencido = (pago) => {
  if (!pago || pago.fechaPago) return false;
  if (pago.dias_atraso && parseInt(pago.dias_atraso, 10) > 0) return true;
  if (!pago.fecha_vencimiento) return false;
  const vencimiento = new Date(pago.fecha_vencimiento);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return vencimiento < hoy;
};

const getPagoStatus = (pago) => {
  if (!pago) return 'pendiente';
  if (isPagoCompletado(pago)) return 'pagado';
  if (isPagoVencido(pago)) return 'vencido';
  return 'pendiente';
};

// ── Modal de detalle de un pago ────────────────────────────────────────────────
function PagoDetalleModal({ pago, onClose, onEdit }) {
  if (!pago) return null;
  const totalPago = (parseFloat(pago.monto) || 0) + (parseFloat(pago.interes) || 0) + (parseFloat(pago.multa) || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ReceiptText size={20} className="text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">Detalle del Pago #{pago.id}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Fechas y tipo */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Fecha de pago</p>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-blue-500" />
                <p className="font-semibold text-gray-800 text-sm">{formatDate(pago.fechaPago)}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tipo de pago</p>
              <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${getTipoPagoColor(pago.tipoPago)}`}>
                {pago.tipoPago || 'No especificado'}
              </span>
            </div>
          </div>

          {/* Desglose de montos */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <DollarSign size={15} className="text-blue-600" />
              Desglose de montos
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monto principal</span>
                <span className="font-semibold text-gray-800">{formatMoney(pago.monto)}</span>
              </div>
              {parseFloat(pago.interes) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-yellow-700">Interés moratorio</span>
                  <span className="font-medium text-yellow-700">+ {formatMoney(pago.interes)}</span>
                </div>
              )}
              {parseFloat(pago.multa) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-700">Multa por mora</span>
                  <span className="font-medium text-red-700">+ {formatMoney(pago.multa)}</span>
                </div>
              )}
              {pago.dias_atraso > 0 && (
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs text-red-500">Días de atraso</span>
                  <span className="text-xs font-medium text-red-500">{pago.dias_atraso} días</span>
                </div>
              )}
              <div className="border-t border-blue-200 pt-2 mt-1 flex justify-between items-center">
                <span className="font-bold text-gray-800">Total pagado</span>
                <span className="text-xl font-bold text-blue-700">{formatMoney(totalPago)}</span>
              </div>
            </div>
          </div>

          {/* Comprobante */}
          {pago.comprobante && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <FileText size={16} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Comprobante</p>
                <p className="font-mono text-sm font-medium text-gray-800">{pago.comprobante}</p>
              </div>
            </div>
          )}

          {/* Cuota */}
          {pago.numero_cuota && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard size={14} className="text-gray-400" />
              <span>Cuota N° <strong>{pago.numero_cuota}</strong></span>
            </div>
          )}

          {/* Metadatos */}
          <div className="text-xs text-gray-400 space-y-0.5 pt-1 border-t border-gray-100">
            {pago.created_at && <p>📅 Registrado: {formatDate(pago.created_at)}</p>}
            {pago.updated_at && pago.updated_at !== pago.created_at && (
              <p>✏️ Actualizado: {formatDate(pago.updated_at)}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Cerrar
          </button>
          <button onClick={() => { onEdit(pago); onClose(); }}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <Edit size={15} />
            Editar pago
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function VentasPagosDetalle({
  venta,
  pagos = [],
  onNuevoPago,
  onEditarPago,
  onEliminarPago,
  loading = false,
}) {
  const [pagoDetalle, setPagoDetalle] = useState(null);
  const [expandirInfo, setExpandirInfo] = useState(false);

  const stats = useMemo(() => {
    const pagosCompletados = pagos.filter(isPagoCompletado);
    const pagosPendientes = pagos.filter(pago => !isPagoCompletado(pago));
    const pagosVencidos = pagosPendientes.filter(isPagoVencido);

    const totalPagadoPrincipal = pagosCompletados.reduce((s, p) => s + (parseFloat(p.monto) || 0), 0);
    const totalPagadoConCargos = pagosCompletados.reduce(
      (s, p) => s + (parseFloat(p.monto) || 0) + (parseFloat(p.interes) || 0) + (parseFloat(p.multa) || 0),
      0
    );

    const totalInteresesPagados = pagosCompletados.reduce((s, p) => s + (parseFloat(p.interes) || 0), 0);
    const totalMultasPagadas = pagosCompletados.reduce((s, p) => s + (parseFloat(p.multa) || 0), 0);
    const totalInteresesPendientes = pagosPendientes.reduce((s, p) => s + (parseFloat(p.interes) || 0), 0);
    const totalMultasPendientes = pagosPendientes.reduce((s, p) => s + (parseFloat(p.multa) || 0), 0);

    const montoTotal = venta?.montoTotal || 0;
    const principalPendiente = Math.max(0, montoTotal - totalPagadoPrincipal);
    const saldo = Math.max(0, principalPendiente + totalInteresesPendientes + totalMultasPendientes);
    const porcentaje = montoTotal > 0 ? Math.min(100, Math.round((totalPagadoPrincipal / montoTotal) * 100)) : 0;

    return {
      totalPagado: venta?.monto_pagado !== undefined && venta?.monto_pagado !== null
        ? parseFloat(venta.monto_pagado) || totalPagadoConCargos
        : totalPagadoConCargos,
      totalPagadoPrincipal,
      totalIntereses: totalInteresesPagados + totalInteresesPendientes,
      totalMultas: totalMultasPagadas + totalMultasPendientes,
      totalInteresesPendientes,
      totalMultasPendientes,
      saldo,
      porcentaje,
      pagosCompletadosCount: pagosCompletados.length,
      cuotasPendientesCount: pagosPendientes.length,
      cuotasVencidasCount: pagosVencidos.length
    };
  }, [pagos, venta]);

  const getClienteNombre = (v) => {
    if (!v) return 'Cliente';
    if (v.cliente?.nombre && v.cliente?.apellido) return `${v.cliente.nombre} ${v.cliente.apellido}`;
    if (v.cliente?.nombre) return v.cliente.nombre;
    if (v.clienteNombre) return v.clienteNombre;
    return `Cliente #${v.cliente_id || ''}`;
  };

  const getLoteInfo = (v) => {
    if (!v) return '—';
    if (v.lote?.numero) return `Lote ${v.lote.numero}`;
    if (v.lote_numero) return `Lote ${v.lote_numero}`;
    return '—';
  };

  const estadoColor = {
    pagado: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle2, iconColor: 'text-green-600' },
    cancelado: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: AlertCircle, iconColor: 'text-gray-500' },
    pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: Clock, iconColor: 'text-yellow-600' },
    activo: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: TrendingUp, iconColor: 'text-blue-600' },
  }[venta?.estado?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: Clock, iconColor: 'text-gray-500' };

  const EstadoIcon = estadoColor.icon;

  if (!venta) {
    return (
      <div className="text-center py-16 text-gray-500">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p className="font-medium">Venta no encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Encabezado de la venta ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-200 text-sm font-medium">Venta #{venta.id}</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${estadoColor.bg} ${estadoColor.text} ${estadoColor.border}`}>
                  <EstadoIcon size={11} className={estadoColor.iconColor} />
                  {venta.estado || 'pendiente'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User size={18} className="text-blue-200" />
                {getClienteNombre(venta)}
              </h2>
              <p className="text-blue-200 text-sm flex items-center gap-1.5 mt-0.5">
                <Building size={13} />
                {getLoteInfo(venta)}
                {venta.fechaInicio && (
                  <span className="ml-2 flex items-center gap-1">
                    <Calendar size={13} />
                    Inicio: {formatDate(venta.fechaInicio)}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={onNuevoPago}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 font-semibold text-sm rounded-lg hover:bg-blue-50 transition-colors shadow-sm flex-shrink-0"
            >
              <Plus size={17} />
              Nuevo pago
            </button>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progreso de pago</span>
            <span className="font-bold text-gray-800">{stats.porcentaje}% pagado</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-700"
              style={{
                width: `${stats.porcentaje}%`,
                background: stats.porcentaje >= 100 ? '#16a34a' : stats.porcentaje >= 60 ? '#2563eb' : '#f59e0b'
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1.5">
            <span>Pagado: <span className="font-semibold text-green-700">{formatMoney(stats.totalPagado)}</span></span>
            <span>Total: <span className="font-semibold text-gray-800">{formatMoney(venta.montoTotal)}</span></span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
          {[
            { label: 'Monto total', value: formatMoney(venta.montoTotal), color: 'text-gray-800' },
            { label: 'Total pagado', value: formatMoney(stats.totalPagado), color: 'text-green-700' },
            { label: 'Saldo real', value: formatMoney(stats.saldo), color: stats.saldo > 0 ? 'text-red-600' : 'text-green-600' },
            { label: 'N° de pagos', value: stats.pagosCompletadosCount, color: 'text-blue-700' },
            ...(stats.cuotasPendientesCount > 0 ? [{ label: 'Cuotas pendientes', value: stats.cuotasPendientesCount, color: 'text-yellow-700' }] : []),
            ...(stats.cuotasVencidasCount > 0 ? [{ label: 'Cuotas vencidas', value: stats.cuotasVencidasCount, color: 'text-red-700' }] : []),
          ].map(({ label, value, color }) => (
            <div key={label} className="p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`text-base font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Info adicional colapsable */}
        {(venta.cantidadCuotas || venta.montoCuota || venta.diaVencimiento) && (
          <div className="border-t border-gray-100">
            <button
              onClick={() => setExpandirInfo(!expandirInfo)}
              className="w-full flex items-center justify-between px-6 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">Información de cuotas</span>
              {expandirInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {expandirInfo && (
              <div className="px-6 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {venta.cantidadCuotas && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total cuotas</p>
                    <p className="font-bold text-gray-800">{venta.cantidadCuotas}</p>
                  </div>
                )}
                {venta.montoCuota && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Valor cuota</p>
                    <p className="font-bold text-gray-800">{formatMoney(venta.montoCuota)}</p>
                  </div>
                )}
                {venta.diaVencimiento && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Día de vencimiento</p>
                    <p className="font-bold text-gray-800">Día {venta.diaVencimiento}</p>
                  </div>
                )}
                {venta.tasaInteresMoratorio > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-xs text-yellow-600">Interés moratorio</p>
                    <p className="font-bold text-yellow-800">{venta.tasaInteresMoratorio}%</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Cargos adicionales acumulados ─────────────────────────────────────── */}
      {(stats.totalIntereses > 0 || stats.totalMultas > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {stats.totalIntereses > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={15} className="text-yellow-600" />
                <p className="text-xs font-medium text-yellow-700">Intereses acumulados</p>
              </div>
              <p className="text-lg font-bold text-yellow-800">{formatMoney(stats.totalIntereses)}</p>
            </div>
          )}
          {stats.totalMultas > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={15} className="text-red-600" />
                <p className="text-xs font-medium text-red-700">Multas acumuladas</p>
              </div>
              <p className="text-lg font-bold text-red-800">{formatMoney(stats.totalMultas)}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Historial de pagos ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <ReceiptText size={18} className="text-blue-600" />
            Historial de pagos
            {pagos.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {pagos.length}
              </span>
            )}
          </h3>
          <button
            onClick={onNuevoPago}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            <Plus size={15} />
            Agregar pago
          </button>
        </div>

        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-2 text-sm text-gray-600">Cargando pagos...</p>
          </div>
        )}

        {!loading && pagos.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-10 w-10 text-gray-200 mb-3" />
            <p className="font-medium text-gray-700">Sin pagos registrados</p>
            <p className="text-sm text-gray-500 mt-1">Esta venta aún no tiene pagos.</p>
            <button
              onClick={onNuevoPago}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium mx-auto"
            >
              <Plus size={16} />
              Registrar primer pago
            </button>
          </div>
        )}

        {!loading && pagos.length > 0 && (
          <div className="divide-y divide-gray-50">
            {[...pagos].sort((a, b) => new Date(a.fechaPago || a.fecha_vencimiento || 0) - new Date(b.fechaPago || b.fecha_vencimiento || 0)).map((pago, idx) => {
              const totalPago = (parseFloat(pago.monto) || 0) + (parseFloat(pago.interes) || 0) + (parseFloat(pago.multa) || 0);
              const tieneExtras = pago.interes > 0 || pago.multa > 0;
              const pagoStatus = getPagoStatus(pago);
              const tipoLabel = pago.tipoPago || getPagoLabel(pago);
              const fechaLabel = pago.fechaPago ? formatDate(pago.fechaPago) : (pago.fecha_vencimiento ? `Vence ${formatDate(pago.fecha_vencimiento)}` : 'Pendiente');
              const statusBadge = {
                pagado: 'bg-green-100 text-green-800 border-green-200',
                vencido: 'bg-red-100 text-red-800 border-red-200',
                pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200'
              }[pagoStatus] || 'bg-gray-100 text-gray-700 border-gray-200';

              return (
                <div key={pago.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  {/* Número secuencial */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 mt-0.5">
                    {idx + 1}
                  </div>

                  {/* Info principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">{formatMoney(totalPago)}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${getTipoPagoColor(pago.tipoPago)}`}>
                        {tipoLabel}
                      </span>
                      {tieneExtras && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-yellow-700 bg-yellow-50 rounded-full border border-yellow-200">
                          <AlertCircle size={10} />
                          Con cargos
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${statusBadge}`}>
                        {pagoStatus === 'vencido' ? 'Vencida' : pagoStatus === 'pagado' ? 'Pagado' : 'Pendiente'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {fechaLabel}
                      </span>
                      {pago.comprobante && (
                        <span className="flex items-center gap-1">
                          <FileText size={11} />
                          {pago.comprobante}
                        </span>
                      )}
                      {pago.numero_cuota && (
                        <span className="flex items-center gap-1">
                          <CreditCard size={11} />
                          Cuota {pago.numero_cuota}
                        </span>
                      )}
                    </div>
                    {tieneExtras && (
                      <div className="flex flex-wrap gap-3 mt-1 text-xs">
                        {pago.interes > 0 && (
                          <span className="text-yellow-600">Interés: {formatMoney(pago.interes)}</span>
                        )}
                        {pago.multa > 0 && (
                          <span className="text-red-600">Multa: {formatMoney(pago.multa)}</span>
                        )}
                        <span className="text-gray-500">Base: {formatMoney(pago.monto)}</span>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setPagoDetalle(pago)}
                      className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver detalle"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => onEditarPago(pago)}
                      className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => onEliminarPago(pago)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Total al pie */}
        {pagos.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Total recaudado en {pagos.length} pago{pagos.length !== 1 ? 's' : ''}</span>
            <span className="text-lg font-bold text-blue-700">{formatMoney(stats.totalPagado)}</span>
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {pagoDetalle && (
        <PagoDetalleModal
          pago={pagoDetalle}
          onClose={() => setPagoDetalle(null)}
          onEdit={(p) => { onEditarPago(p); setPagoDetalle(null); }}
        />
      )}
    </div>
  );
}