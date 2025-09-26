import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
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
    error: ventasError, 
    createVenta, 
    updateVenta, 
    deleteVenta,
    refetch 
  } = useVentas();

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
  const [dataCargada, setDataCargada] = useState(false);

  // Cargar datos iniciales UNA SOLA VEZ
  useEffect(() => {
    if (dataCargada) return; // Evitar múltiples ejecuciones

    const loadInitialData = async () => {
      setLoadingData(true);
      try {
        console.log('Cargando datos iniciales...');
        
        // Cargar clientes
        const clientesData = await clientesService.getClientes();
        setClientes(Array.isArray(clientesData) ? clientesData : []);
        
        // Intentar cargar lotes (manejar error silenciosamente)
        try {
          const lotesData = await ventasService.getLotesDisponibles();
          setLotes(Array.isArray(lotesData) ? lotesData : []);
        } catch (lotesError) {
          console.warn('Error cargando lotes:', lotesError);
          setLotes([]);
        }
        
        // Las ventas ya se cargan automáticamente en el hook useVentas
        // NO llamar refetch() aquí para evitar ciclos
        
        setDataCargada(true);
        
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
        showToast('Error al cargar datos iniciales', 'error');
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, [dataCargada, showToast]); // Removí refetch de las dependencias

  // Manejadores de acciones optimizados
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
    showToast(`Vista de venta #${venta.id}`, 'info');
  };

  const handleExportVentas = (ventasFiltradas) => {
    showToast(`Exportando ${ventasFiltradas.length} ventas`, 'info');
  };

  const handleFormSubmitWrapper = async (ventaData) => {
    const submitFunction = editingVenta ? handleUpdateVenta : handleCreateVenta;
    await handleFormSubmit(ventaData, submitFunction);
  };

  // Botón para recargar manualmente si es necesario
  const handleRecargarDatos = async () => {
    setDataCargada(false);
    await refetch();
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

      {/* Mostrar error si existe */}
      {ventasError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Error cargando ventas: {ventasError.message}</p>
          <button 
            onClick={handleRecargarDatos}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <button
          onClick={openCreateForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Venta
        </button>
        
        <button
          onClick={handleRecargarDatos}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Recargar Datos
        </button>
      </div>

      <VentasList
        ventas={ventas || []}
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

export default VentasSection;