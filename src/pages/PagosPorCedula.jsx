import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, AlertCircle, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import ventasService from '../service/VentasService';
import pagosService from '../service/PagosService';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return 'Fecha inválida';
  }
};

const formatMoney = (amount) => {
  if (!amount && amount !== 0) return 'Gs. 0';
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(parseFloat(amount) || 0);
};

const getTipoPagoColor = (tipo) => {
  if (!tipo) return 'bg-gray-100 text-gray-700';
  switch (tipo.toLowerCase()) {
    case 'efectivo':
      return 'bg-green-100 text-green-800';
    case 'transferencia':
      return 'bg-blue-100 text-blue-800';
    case 'cheque':
      return 'bg-purple-100 text-purple-800';
    case 'tarjeta':
      return 'bg-orange-100 text-orange-800';
    case 'deposito':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getPagoStatus = (pago) => {
  if (!pago) return 'pendiente';
  if (pago.fechaPago || pago.tipoPago || (pago.estado && pago.estado.toLowerCase() === 'pagado')) {
    return 'pagado';
  }
  if (pago.dias_atraso && parseInt(pago.dias_atraso, 10) > 0) return 'vencido';
  if (!pago.fecha_vencimiento) return 'pendiente';

  const vencimiento = new Date(pago.fecha_vencimiento);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return vencimiento < hoy ? 'vencido' : 'pendiente';
};

function PagoCard({ pago, index }) {
  const status = getPagoStatus(pago);
  const totalPago = (parseFloat(pago.monto) || 0) + (parseFloat(pago.interes) || 0) + (parseFloat(pago.multa) || 0);

  const statusConfig = {
    pagado: { icon: CheckCircle2, bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Pagado' },
    vencido: { icon: AlertTriangle, bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Vencido' },
    pendiente: { icon: Clock, bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200', label: 'Pendiente' }
  };

  const config = statusConfig[status] || statusConfig.pendiente;
  const StatusIcon = config.icon;

  return (
    <div className={`rounded-lg border-2 ${config.borderColor} ${config.bgColor} p-5 transition hover:shadow-md`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Pago #{index}</span>
              {pago.numero_cuota && (
                <span className="inline-block rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-800">
                  Cuota {pago.numero_cuota}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon className="h-5 w-5" />
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${config.textColor}`}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600">Fecha de vencimiento</p>
            <p className="font-semibold text-gray-900">{formatDate(pago.fecha_vencimiento)}</p>
          </div>
          {pago.fechaPago && (
            <div>
              <p className="text-gray-600">Fecha de pago</p>
              <p className="font-semibold text-green-900">{formatDate(pago.fechaPago)}</p>
            </div>
          )}
        </div>

        {/* Montos */}
        <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-500 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Monto principal</span>
            <span className="font-semibold text-gray-900">{formatMoney(pago.monto)}</span>
          </div>
          {parseFloat(pago.interes) > 0 && (
            <div className="flex justify-between text-yellow-700">
              <span>Interés moratorio</span>
              <span className="font-medium">+ {formatMoney(pago.interes)}</span>
            </div>
          )}
          {parseFloat(pago.multa) > 0 && (
            <div className="flex justify-between text-red-700">
              <span>Multa por mora</span>
              <span className="font-medium">+ {formatMoney(pago.multa)}</span>
            </div>
          )}
          {pago.dias_atraso > 0 && (
            <div className="flex justify-between text-red-700 text-xs">
              <span>Días de atraso</span>
              <span className="font-medium">{pago.dias_atraso} días</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-emerald-700">{formatMoney(totalPago)}</span>
          </div>
        </div>

        {/* Tipo de pago */}
        {pago.tipoPago && (
          <div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getTipoPagoColor(pago.tipoPago)}`}>
              {pago.tipoPago}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PagosPorCedula() {
  const { cedula } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    const obtenerPagos = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Obtener cliente por cédula
        const clienteData = await ventasService.getClienteByCedula(cedula);

        if (!clienteData) {
          setError(`No se encontró cliente con cédula: ${cedula}`);
          setLoading(false);
          return;
        }

        setCliente(clienteData);

        // 2. Obtener ventas del cliente
        const allVentas = await ventasService.getVentas();
        const ventasCliente = allVentas.filter(v => v.cliente_id === clienteData.id);

        if (ventasCliente.length === 0) {
          setPagos([]);
          setLoading(false);
          return;
        }

        // 3. Obtener pagos de cada venta
        const allPagos = [];
        for (const venta of ventasCliente) {
          try {
            const pagosList = await pagosService.getByVenta(venta.id);
            allPagos.push(...pagosList);
          } catch (err) {
            console.warn(`No se pudieron obtener pagos para venta ${venta.id}:`, err);
          }
        }

        // Ordenar pagos ascendentes por fecha
        allPagos.sort((a, b) => {
          const dateA = new Date(a.fecha_vencimiento || 0);
          const dateB = new Date(b.fecha_vencimiento || 0);
          return dateA - dateB;
        });

        setPagos(allPagos);
      } catch (err) {
        console.error('Error obteniendo pagos:', err);
        setError(err.message || 'Error al cargar los pagos');
      } finally {
        setLoading(false);
      }
    };

    obtenerPagos();
  }, [cedula]);

  const pagoPagados = pagos.filter(p => getPagoStatus(p) === 'pagado').length;
  const pagoPendientes = pagos.filter(p => getPagoStatus(p) === 'pendiente').length;
  const pagoVencidos = pagos.filter(p => getPagoStatus(p) === 'vencido').length;

  const totalDeuda = pagos
    .filter(p => getPagoStatus(p) !== 'pagado')
    .reduce((total, p) => total + (parseFloat(p.monto) || 0) + (parseFloat(p.interes) || 0) + (parseFloat(p.multa) || 0), 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <button
              onClick={() => navigate('/mis-pagos')}
              className="mb-6 flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/30"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </button>

            <h1 className="text-4xl font-bold text-white">
              {cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cargando...'}
            </h1>
            <p className="mt-2 text-emerald-100">Cédula: {cedula}</p>
          </div>
        </div>

        {/* Contenido */}
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="h-8 w-8 animate-spin text-emerald-500" />
              <span className="ml-3 text-gray-600">Cargando pagos...</span>
            </div>
          ) : error ? (
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Error al cargar pagos</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/mis-pagos')}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Intentar nuevamente
              </button>
            </div>
          ) : (
            <>
              {/* Estadísticas */}
              {pagos.length > 0 && (
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
                    <p className="text-sm text-gray-600">Total de pagos</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{pagos.length}</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-6 shadow-sm ring-1 ring-green-100">
                    <p className="text-sm text-green-600">Pagos completados</p>
                    <p className="mt-1 text-3xl font-bold text-green-900">{pagoPagados}</p>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-6 shadow-sm ring-1 ring-yellow-100">
                    <p className="text-sm text-yellow-600">Pagos pendientes</p>
                    <p className="mt-1 text-3xl font-bold text-yellow-900">{pagoPendientes}</p>
                  </div>
                  <div className="rounded-lg bg-red-50 p-6 shadow-sm ring-1 ring-red-100">
                    <p className="text-sm text-red-600">Total deuda</p>
                    <p className="mt-1 text-2xl font-bold text-red-900">{formatMoney(totalDeuda)}</p>
                  </div>
                </div>
              )}

              {/* Lista de pagos */}
              {pagos.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                  <p className="text-gray-600">No hay pagos registrados para esta cédula</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Detalle de pagos ({pagos.length})</h2>
                  {pagos.map((pago, index) => (
                    <PagoCard key={pago.id || index} pago={pago} index={index + 1} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
