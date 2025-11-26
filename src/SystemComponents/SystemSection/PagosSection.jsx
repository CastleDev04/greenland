import PagoList from '../SystemData/PagoList';
import PagosForm from '../SystemData/PagosForm';
import { usePagos } from '../../hook/usePagos';
import { useVentas } from '../../hook/useVentas';
import { useState, useMemo } from 'react';
import { AlertCircle, Plus, Loader2 } from 'lucide-react';

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

  // Preparar ventas para el formulario
  const ventasParaForm = useMemo(() => {
  if (!ventas || !Array.isArray(ventas)) return [];
  
  return ventas
    .filter(venta => {
      if (!venta) return false;
      
      // ✅ CORREGIDO: Filtrar SOLO por estado, no por monto_pagado
      const estado = venta.estado?.toLowerCase();
      const estaPagada = estado === 'pagado' || estado === 'cancelado';
      
      return !estaPagada;
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

  // Función para obtener nombre del cliente
  function getClienteNombre(venta) {
    if (!venta) return 'Cliente no disponible';
    
    if (venta.cliente) {
      if (typeof venta.cliente === 'string') return venta.cliente;
      if (venta.cliente.nombre && venta.cliente.apellido) {
        return `${venta.cliente.nombre} ${venta.cliente.apellido}`.trim();
      }
      if (venta.cliente.nombre) return venta.cliente.nombre;
      if (venta.cliente.razonSocial) return venta.cliente.razonSocial;
    }
    
    if (venta.clienteNombre) return venta.clienteNombre;
    if (venta.cliente_id) return `Cliente #${venta.cliente_id}`;
    
    return 'Cliente no disponible';
  }

  // ✅ CORREGIDO: Función para calcular saldo pendiente usando monto_pagado
  function calcularSaldo(venta) {
    if (!venta) return 0;
    
    // ✅ PRIMERO: Usar monto_pagado si existe (es el más preciso)
    if (venta.monto_pagado !== undefined && venta.monto_pagado !== null) {
      const montoTotal = venta.montoTotal || 0;
      const montoPagado = venta.monto_pagado || 0;
      return Math.max(0, montoTotal - montoPagado);
    }
    
    // ✅ SEGUNDO: Si no, calcular basado en pagos reales
    if (venta.montoTotal && venta.pagos && Array.isArray(venta.pagos)) {
      const totalPagado = venta.pagos.reduce((sum, pago) => sum + (parseFloat(pago.monto) || 0), 0);
      return Math.max(0, venta.montoTotal - totalPagado);
    }
    
    // ✅ TERCERO: Usar saldo_pendiente si viene del backend
    if (venta.saldo_pendiente !== undefined && venta.saldo_pendiente !== null) {
      return venta.saldo_pendiente;
    }
    
    // ✅ CUARTO: Como último recurso, cálculo aproximado por cuotas
    if (venta.montoTotal && venta.cuotas_pagadas !== undefined && venta.cantidadCuotas) {
      const montoPorCuota = venta.montoTotal / venta.cantidadCuotas;
      const totalPagadoAprox = (venta.cuotas_pagadas || 0) * montoPorCuota;
      return Math.max(0, venta.montoTotal - totalPagadoAprox);
    }
    
    return venta.montoTotal || 0;
  }

  // Manejar creación o edición de pago
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let result;
      
      if (selectedPago) {
        // Editar pago existente
        result = await updatePago(selectedPago.id, formData);
      } else {
        // Crear nuevo pago
        result = await createPago(formData);
      }

      if (result && result.success) {
        // Refrescar ambos datos
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

  // Manejar eliminación de pago
  const handleDelete = async (pago) => {
    if (!pago || !pago.id) {
      alert('Pago no válido');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar el pago #${pago.id}? Esta acción no se puede deshacer.`)) {
      try {
        const result = await deletePago(pago.id);
        if (result.success) {
          // Refrescar ambos datos después de eliminar
          await Promise.all([refreshPagos(), refetchVentas()]);
        } else {
          alert(result.error || 'Error al eliminar el pago');
        }
      } catch (error) {
        console.error('Error al eliminar pago:', error);
        alert(error.message || 'Error al eliminar el pago');
      }
    }
  };

  const handleEdit = (pago) => {
    if (!pago) return;
    setSelectedPago(pago);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedPago(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedPago(null);
  };

  // Estados de loading combinados
  const isLoading = loadingPagos || loadingVentas;
  const hasError = errorPagos || errorVentas;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          {ventaId ? `Pagos de la Venta #${ventaId}` : 'Gestión de Pagos'}
        </h1>
        <p className="text-gray-600 text-center mt-2">
          {ventaId 
            ? 'Gestiona los pagos de esta venta específica'
            : 'Registra y gestiona todos los pagos del sistema'
          }
        </p>
      </div>

      {/* Estados de carga */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600 mr-3" />
          <span className="text-gray-600">Cargando datos...</span>
        </div>
      )}

      {/* Estados de error */}
      {hasError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <h3 className="text-red-800 font-semibold">Error al cargar los datos</h3>
          </div>
          {errorPagos && <p className="text-red-700 mt-1">{errorPagos}</p>}
          {errorVentas && <p className="text-red-700 mt-1">{errorVentas}</p>}
          <button
            onClick={() => {
              refreshPagos();
              refetchVentas();
            }}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Contenido principal */}
      {!showForm && !isLoading && !hasError && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="text-sm text-gray-600">
              {ventasParaForm.length > 0 ? (
                <span>
                  <strong>{ventasParaForm.length}</strong> venta{ventasParaForm.length !== 1 ? 's' : ''} disponible{ventasParaForm.length !== 1 ? 's' : ''} para registrar pagos
                </span>
              ) : (
                <span className="text-yellow-600">
                  No hay ventas disponibles para registrar pagos
                </span>
              )}
              {pagos.length > 0 && (
                <span className="ml-4">
                  • <strong>{pagos.length}</strong> pago{pagos.length !== 1 ? 's' : ''} registrado{pagos.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            <button
              onClick={handleCreate}
              disabled={ventasParaForm.length === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors shadow-sm"
            >
              <Plus size={20} />
              Nuevo Pago
            </button>
          </div>

          {/* Advertencia si no hay ventas disponibles */}
          {ventasParaForm.length === 0 && ventas.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="text-yellow-600 mr-2" size={20} />
                <h3 className="text-yellow-800 font-semibold">Todas las ventas están pagadas</h3>
              </div>
              <p className="text-yellow-700 mt-1 text-sm">
                No hay ventas con saldo pendiente. Todas las ventas están completamente pagadas.
              </p>
            </div>
          )}

          {/* Advertencia si no hay ventas en absoluto */}
          {ventas.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="text-blue-600 mr-2" size={20} />
                <h3 className="text-blue-800 font-semibold">No hay ventas registradas</h3>
              </div>
              <p className="text-blue-700 mt-1 text-sm">
                Para registrar pagos, primero debes crear ventas en el sistema.
              </p>
            </div>
          )}

          {/* Lista de pagos */}
          <PagoList
            pagos={pagos}
            ventas={ventas}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateClick={ventasParaForm.length > 0 ? handleCreate : undefined}
            loading={loadingPagos}
          />
        </>
      )}

      {/* Formulario de pago */}
      {showForm && (
        <PagosForm
          pagoData={selectedPago}
          ventas={ventasParaForm}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          isEditing={!!selectedPago}
          isLoading={isSubmitting}
          title={selectedPago ? `Editar Pago #${selectedPago.id}` : 'Registrar Nuevo Pago'}
        />
      )}
    </div>
  );
}