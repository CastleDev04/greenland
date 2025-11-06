import PagoList from '../SystemData/PagoList';
import PagosForm from '../SystemData/PagosForm';
import { usePagos } from '../../hook/usePagos';
import { useState } from 'react';

export default function PagosSection({ ventaId = null }) {
  const { pagos, loading, error, createPago, updatePago, deletePago, refresh } = usePagos(ventaId);
  const [selectedPago, setSelectedPago] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Manejar creación o edición
  const handleSubmit = async (formData) => {
    const result = selectedPago
      ? await updatePago(selectedPago.id, formData)
      : await createPago(formData);

    if (result.success) {
      refresh();
      setShowForm(false);
      setSelectedPago(null);
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este pago?")) {
      const result = await deletePago(id);
      if (result.success) refresh();
      else alert(result.error);
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
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">Gestión de Pagos</h1>

      {loading && <p className="text-gray-500 text-center">Cargando pagos...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {!showForm && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              + Nuevo Pago
            </button>
          </div>

          <PagoList
            pagos={pagos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      {showForm && (
        <PagosForm
          pago={selectedPago}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedPago(null);
          }}
        />
      )}
    </div>
  );
}