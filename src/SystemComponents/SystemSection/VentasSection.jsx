import React, { useState, useEffect } from 'react';
import VentasForm from '../SystemData/VentasForm';
import VentasList from '../SystemData/VentasList';
import Toast from '../SystemData/Toast';
import { useVentas } from '../../hook/useVentas.jsx';
import { useVentaForm } from '../../hook/useVentaForm.js';
import { useToast } from '../../hook/useToast';
import ventasService from '../../service/VentasService';
import clientesService from '../../service/ClientesService';

const VentasSection = () => {
  const { 
    ventas, 
    loading, 
    error, 
    createVenta, 
    updateVenta, 
    deleteVenta,
    refetch 
  } = useVentas();
  error;
  const {
    isFormOpen,
    editingVenta,
    formLoading,
    openCreateForm,
    openEditForm,
    closeForm,
    handleFormSubmit
  } = useVentaForm();

  const { toast, showToast, hideToast } = useToast();

  const [clientes, setClientes] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingData(true);
      try {
        const [clientesData, lotesData] = await Promise.all([
          clientesService.getClientes(),
          ventasService.getLotesDisponibles()
        ]);
        setClientes(clientesData);
        setLotes(lotesData);
        await refetch();
      } catch (error) {
        showToast('Error al cargar datos iniciales', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, [refetch, showToast]);

  // Manejadores de acciones
  const handleCreateVenta = async (ventaData) => {
    try {
      const newVenta = await createVenta(ventaData);
      showToast(`Venta creada exitosamente - ID: ${newVenta.id}`, 'success');
      return newVenta;
    } catch (error) {
      showToast(error.message || 'Error al crear venta', 'error');
      throw error;
    }
  };

  const handleUpdateVenta = async (ventaData) => {
    try {
      const updatedVenta = await updateVenta(editingVenta.id, ventaData);
      showToast(`Venta actualizada exitosamente`, 'success');
      return updatedVenta;
    } catch (error) {
      showToast(error.message || 'Error al actualizar venta', 'error');
      throw error;
    }
  };

  const handleDeleteVenta = async (venta) => {
    if (!window.confirm(`¿Está seguro de cancelar la venta #${venta.id}?`)) {
      return;
    }

    try {
      await deleteVenta(venta.id);
      showToast(`Venta cancelada exitosamente`, 'success');
    } catch (error) {
      showToast(error.message || 'Error al cancelar venta', 'error');
    }
  };

  const handleViewVenta = (venta) => {
    // Implementar vista detallada de venta
    console.log('Ver venta:', venta);
    showToast(`Vista de venta #${venta.id}`, 'info');
  };

  const handleExportVentas = (ventasFiltradas) => {
    // Implementar exportación
    console.log('Exportar ventas:', ventasFiltradas);
    showToast(`Exportando ${ventasFiltradas.length} ventas`, 'info');
  };

  const handleFormSubmitWrapper = async (ventaData) => {
    const submitFunction = editingVenta ? handleUpdateVenta : handleCreateVenta;
    await handleFormSubmit(ventaData, submitFunction);
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sistema de Ventas</h1>
        <p className="text-gray-600 mt-2">Gestión integral de ventas de lotes</p>
      </div>

      <div className="mb-6">
        <button
          onClick={openCreateForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nueva Venta
        </button>
      </div>

      <VentasList
        ventas={ventas}
        loading={loading}
        onView={handleViewVenta}
        onEdit={openEditForm}
        onDelete={handleDeleteVenta}
        onExport={handleExportVentas}
      />

      {isFormOpen && (
        <VentasForm
          onSubmit={handleFormSubmitWrapper}
          onCancel={closeForm}
          clientes={clientes}
          lotes={lotes}
          loading={formLoading}
          ventaData={editingVenta}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

// Icono Plus para el botón
const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default VentasSection;