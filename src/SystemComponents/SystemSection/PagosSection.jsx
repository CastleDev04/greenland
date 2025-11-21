import PagoList from '../SystemData/PagoList';
import PagosForm from '../SystemData/PagosForm';
import { usePagos } from '../../hook/usePagos';
import { useVentas } from '../../hook/useVentas';
import { useState } from 'react';

export default function PagosSection({ ventaId = null }) {
  const { pagos, loading, error, createPago, updatePago, deletePago, refresh } = usePagos(ventaId);
  const { ventas, loading: loadingVentas } = useVentas(); // ← OBTENER VENTAS
  const [selectedPago, setSelectedPago] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Filtrar ventas que tienen saldo pendiente (opcional)
  const ventasConSaldo = ventas.filter(venta => {
    // Aquí puedes agregar lógica para filtrar solo ventas con saldo pendiente
    // Por ejemplo: venta.estado === 'pendiente' || venta.saldo > 0
    return true; // Por ahora mostrar todas
  });

  // Preparar ventas para el formulario
  const ventasParaForm = ventasConSaldo.map(venta => ({
    id: venta.id,
    montoTotal: venta.montoTotal || 0,
    clienteNombre: venta.cliente ? 
      `${venta.cliente.nombre || ''} ${venta.cliente.apellido || ''}`.trim() : 
      'Cliente no disponible',
    saldo: calcularSaldo(venta), // Calcular saldo si no viene
    cuotasPagadas: venta.cuotasPagadas || 0,
    cantidadCuotas: venta.cantidadCuotas || 0
  }));

  // Función para calcular saldo
  function calcularSaldo(venta) {
    if (venta.saldo !== undefined) return venta.saldo;
    
    // Calcular saldo aproximado
    if (venta.montoTotal && venta.cuotasPagadas && venta.montoCuota) {
      const totalPagado = venta.cuotasPagadas * venta.montoCuota;
      return Math.max(0, venta.montoTotal - totalPagado);
    }
    
    return venta.montoTotal || 0;
  }

  // Manejar creación o edición
  const handleSubmit = async (formData) => {
    try {
      const result = selectedPago
        ? await updatePago(selectedPago.id, formData)
        : await createPago(formData);

      if (result) {
        refresh();
        setShowForm(false);
        setSelectedPago(null);
      }
    } catch (error) {
      alert(error.message || 'Error al procesar el pago');
    }
  };

  const handleDelete = async (pago) => {
    if (window.confirm("¿Seguro que deseas eliminar este pago?")) {
      try {
        const result = await deletePago(pago.id);
        if (result.success) refresh();
        else alert(result.error);
      } catch (error) {
        alert(error.message || 'Error al eliminar el pago');
      }
    }
  };

  const handleEdit = (pago) => {
    setSelectedPago(pago);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedPago(null);
    setShowForm(true);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Gestión de Pagos</h1>
        <p className="text-gray-600 text-center mt-2">
          Registra y gestiona los pagos de las ventas
        </p>
      </div>

      {loading && <p className="text-gray-500 text-center">Cargando pagos...</p>}
      {error && <p className="text-red-600 text-center bg-red-50 p-3 rounded-lg">{error}</p>}

      {!showForm && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              {ventasParaForm.length > 0 
                ? `${ventasParaForm.length} ventas disponibles para registrar pagos`
                : 'No hay ventas disponibles'
              }
            </div>
            <button
              onClick={handleCreate}
              disabled={ventasParaForm.length === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              <span>+</span>
              Nuevo Pago
            </button>
          </div>

          {ventasParaForm.length === 0 && !loadingVentas && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center mb-6">
              <p className="text-yellow-700">
                No hay ventas disponibles para registrar pagos. 
                <br />
                <span className="text-sm">Asegúrate de tener ventas creadas primero.</span>
              </p>
            </div>
          )}

          <PagoList
            pagos={pagos}
            ventas={ventas} // ← Pasar ventas al listado también
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      {showForm && (
        <PagosForm
          pagoData={selectedPago} // ← Cambié de 'pago' a 'pagoData' para coincidir con tu formulario
          ventas={ventasParaForm} // ← ¡IMPORTANTE! Pasar las ventas al formulario
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedPago(null);
          }}
          isEditing={!!selectedPago}
          isLoading={loading}
          title={selectedPago ? 'Editar Pago' : 'Registrar Nuevo Pago'}
        />
      )}
    </div>
  );
}