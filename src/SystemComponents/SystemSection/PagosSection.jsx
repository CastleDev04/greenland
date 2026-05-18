import PagosList from '../SystemData/PagoList';
import PagosForm from '../SystemData/PagosForm';
import VentasPagosDetalle from './VentasPagosDetalle';
import { usePagos } from '../../hook/usePagos';
import { useVentas } from '../../hook/useVentas';
import { useState, useEffect, useMemo } from 'react';
import { AlertCircle, Plus, Loader2, ArrowLeft } from 'lucide-react';

export default function PagosSection({ ventaId = null }) {
  const {
    pagos,
    loading: loadingPagos,
    error: errorPagos,
    createPago,
    updatePago,
    deletePago,
    refresh: refreshPagos
  } = usePagos(ventaId);

  const {
    ventas,
    loading: loadingVentas,
    error: errorVentas,
    refetch: refetchVentas
  } = useVentas();

  const [selectedPago, setSelectedPago] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nueva vista: detalle de pagos por venta seleccionada
  const [ventaSeleccionadaId, setVentaSeleccionadaId] = useState(ventaId || null);

  const ventasParaForm = useMemo(() => {
    if (!ventas || !Array.isArray(ventas)) return [];
    return ventas
      .filter(venta => {
        if (!venta) return false;
        const estado = venta.estado?.toLowerCase();
        return estado !== 'pagado' && estado !== 'cancelado';
      })
      .map(venta => ({
        id: venta.id,
        montoTotal: venta.montoTotal || 0,
        clienteNombre: getClienteNombre(venta),
        saldo: calcularSaldo(venta),
        cuotasPagadas: venta.cuotas_pagadas || venta.cuotasPagadas || 0,
        cantidadCuotas: venta.cantidadCuotas || 1,
        montoCuota: venta.montoCuota || 0,
        estado: venta.estado || 'pendiente',
        cliente: venta.cliente || null,
        lote: venta.lote || null,
        fechaInicio: venta.fechaInicio,
        diaVencimiento: venta.diaVencimiento,
        tasaInteresMoratorio: venta.tasaInteresMoratorio || 0,
        multaMoraDiaria: venta.multaMoraDiaria || 0,
        monto_pagado: venta.monto_pagado || 0
      }));
  }, [ventas]);

  function getClienteNombre(venta) {
    if (!venta) return 'Cliente no disponible';
    if (venta.cliente) {
      if (typeof venta.cliente === 'string') return venta.cliente;
      if (venta.cliente.nombre && venta.cliente.apellido)
        return `${venta.cliente.nombre} ${venta.cliente.apellido}`.trim();
      if (venta.cliente.nombre) return venta.cliente.nombre;
      if (venta.cliente.razonSocial) return venta.cliente.razonSocial;
    }
    if (venta.clienteNombre) return venta.clienteNombre;
    if (venta.cliente_id) return `Cliente #${venta.cliente_id}`;
    return 'Cliente no disponible';
  }

  function calcularSaldo(venta) {
    if (!venta) return 0;
    if (venta.monto_pagado !== undefined && venta.monto_pagado !== null) {
      return Math.max(0, (venta.montoTotal || 0) - (venta.monto_pagado || 0));
    }
    if (venta.montoTotal && venta.pagos && Array.isArray(venta.pagos)) {
      const totalPagado = venta.pagos.reduce((sum, p) => sum + (parseFloat(p.monto) || 0), 0);
      return Math.max(0, venta.montoTotal - totalPagado);
    }
    if (venta.saldo_pendiente !== undefined && venta.saldo_pendiente !== null)
      return venta.saldo_pendiente;
    if (venta.montoTotal && venta.cuotas_pagadas !== undefined && venta.cantidadCuotas) {
      const montoPorCuota = venta.montoTotal / venta.cantidadCuotas;
      return Math.max(0, venta.montoTotal - (venta.cuotas_pagadas || 0) * montoPorCuota);
    }
    return venta.montoTotal || 0;
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const result = selectedPago
        ? await updatePago(selectedPago.id, formData)
        : await createPago(formData);

      if (result && result.success) {
        await Promise.all([refreshPagos(), refetchVentas()]);
        setShowForm(false);
        setSelectedPago(null);
      } else {
        throw new Error(result?.error || 'Error desconocido al procesar el pago');
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      alert(error.message || 'Error al procesar el pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (pago) => {
    if (!pago || !pago.id) { alert('Pago no válido'); return; }
    if (window.confirm(`¿Eliminar el pago #${pago.id}? Esta acción no se puede deshacer.`)) {
      try {
        const result = await deletePago(pago.id);
        if (result.success) {
          await Promise.all([refreshPagos(), refetchVentas()]);
        } else {
          alert(result.error || 'Error al eliminar el pago');
        }
      } catch (error) {
        alert(error.message || 'Error al eliminar el pago');
      }
    }
  };

  const handleEdit = (pago) => { if (!pago) return; setSelectedPago(pago); setShowForm(true); };
  const handleCreate = (preselectedVentaId = null) => {
    setSelectedPago(null);
    // Si viene de una venta específica, pre-seleccionarla en el form
    if (preselectedVentaId) {
      setSelectedPago({ venta_id: preselectedVentaId });
    }
    setShowForm(true);
  };
  const handleCancelForm = () => { setShowForm(false); setSelectedPago(null); };

  // Mantener la selección cuando se pasa ventaId como prop
  useEffect(() => {
    if (ventaId !== null && ventaId !== undefined) {
      setVentaSeleccionadaId(Number(ventaId));
    }
  }, [ventaId]);

  // Navegar al detalle de pagos de una venta
  const handleVerPagosVenta = (venta) => setVentaSeleccionadaId(venta.id);
  const handleVolverAVentas = () => setVentaSeleccionadaId(null);

  const isLoading = loadingPagos || loadingVentas;
  const hasError = errorPagos || errorVentas;

  // ── RENDER: detalle de pagos por venta ──────────────────────────────────────
  if (ventaSeleccionadaId !== null) {
    const venta = ventas.find(v => v.id === ventaSeleccionadaId);
    const pagosDeVenta = pagos.filter(p => p.venta_id === ventaSeleccionadaId);

    if (!venta && !isLoading) {
      return (
        <div className="p-4 max-w-7xl mx-auto text-center text-gray-600">
          <p className="text-lg font-semibold">Venta no encontrada</p>
          <p className="mt-2">Es posible que la venta no exista o que no se haya cargado aún.</p>
          <button
            onClick={handleVolverAVentas}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a la lista de ventas
          </button>
        </div>
      );
    }

    return (
      <div className="p-4 max-w-7xl mx-auto">
        <button
          onClick={handleVolverAVentas}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Volver a ventas</span>
        </button>

        <VentasPagosDetalle
          venta={venta}
          pagos={pagosDeVenta}
          onNuevoPago={() => handleCreate(ventaSeleccionadaId)}
          onEditarPago={handleEdit}
          onEliminarPago={handleDelete}
          loading={loadingPagos}
        />

        {showForm && (
          <PagosForm
            pagoData={selectedPago}
            ventas={ventasParaForm}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
            isEditing={!!(selectedPago && selectedPago.id)}
            isLoading={isSubmitting}
            title={selectedPago?.id ? `Editar Pago #${selectedPago.id}` : 'Registrar Nuevo Pago'}
          />
        )}
      </div>
    );
  }

  // ── RENDER: vista principal (lista de ventas) ────────────────────────────────
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          {ventaId ? `Pagos de la Venta #${ventaId}` : 'Gestión de Pagos'}
        </h1>
        <p className="text-gray-600 text-center mt-2">
          {ventaId
            ? 'Gestiona los pagos de esta venta específica'
            : 'Selecciona una venta para ver y gestionar sus pagos'}
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600 mr-3" />
          <span className="text-gray-600">Cargando datos...</span>
        </div>
      )}

      {hasError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <h3 className="text-red-800 font-semibold">Error al cargar los datos</h3>
          </div>
          {errorPagos && <p className="text-red-700 mt-1">{errorPagos}</p>}
          {errorVentas && <p>{errorVentas instanceof Error ? errorVentas.message : errorVentas}</p>}
          <button
            onClick={() => { refreshPagos(); refetchVentas(); }}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {!showForm && !isLoading && !hasError && (
        <>
          {/* Usar PagosList en modo "por ventas" */}
          <PagosList
            pagos={pagos}
            ventas={ventas}
            onVerPagosVenta={handleVerPagosVenta}
            onEditClick={handleEdit}
            onDeleteClick={handleDelete}
            onCreateClick={ventasParaForm.length > 0 ? () => handleCreate() : undefined}
            loading={loadingPagos}
            modoVentas={true}
          />
        </>
      )}

      {showForm && (
        <PagosForm
          pagoData={selectedPago}
          ventas={ventasParaForm}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          isEditing={!!(selectedPago && selectedPago.id)}
          isLoading={isSubmitting}
          title={selectedPago?.id ? `Editar Pago #${selectedPago.id}` : 'Registrar Nuevo Pago'}
        />
      )}
    </div>
  );
}