import React, { useEffect } from 'react';
import FraccionamientoList from '../SystemData/FraccionamientoList';
import FraccionamientoForm from '../SystemData/FraccionamientoForm';
import Toast from '../SystemData/Toast';
import { useFraccionamientos } from '../../hook/useFraccionamientos';
import { useFraccionamientoForm } from '../../hook/useFraccionamientoForm';
import { useToast } from '../../hook/useToast';

const FraccionamientosSection = () => {
  const { 
    fraccionamientos, 
    loading, 
    error, 
    createFraccionamiento, 
    updateFraccionamiento, 
    deleteFraccionamiento,
    fetchFraccionamientos
  } = useFraccionamientos();

  const {
    isFormOpen,
    editingFraccionamiento,
    formLoading,
    openCreateForm,
    openEditForm,
    closeForm,
    handleFormSubmit
  } = useFraccionamientoForm();

  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    console.log('🔍 Cargando fraccionamientos...');
    fetchFraccionamientos();
  }, []);

  // Crear fraccionamiento
  const handleCreateFraccionamiento = async (fraccionamientoData) => {
    try {
      await createFraccionamiento(fraccionamientoData);
      await fetchFraccionamientos();
      showToast(`Fraccionamiento ${fraccionamientoData.nombre} creado exitosamente`, 'success');
    } catch (error) {
      console.error('❌ Error al crear fraccionamiento:', error);
      showToast(error.message || 'Error al crear fraccionamiento', 'error');
    }
  };

  // Actualizar fraccionamiento
  const handleUpdateFraccionamiento = async (fraccionamientoData) => {
    try {
      await updateFraccionamiento(editingFraccionamiento.id, fraccionamientoData);
      await fetchFraccionamientos();
      showToast(`Fraccionamiento ${fraccionamientoData.nombre} actualizado correctamente`, 'success');
    } catch (error) {
      console.error('❌ Error al actualizar fraccionamiento:', error);
      showToast(error.message || 'Error al actualizar fraccionamiento', 'error');
    }
  };

  // Eliminar fraccionamiento
  const handleDeleteFraccionamiento = async (fraccionamiento) => {
    if (!window.confirm(`¿Estás seguro de eliminar el fraccionamiento "${fraccionamiento.nombre}"?`)) return;
    
    try {
      await deleteFraccionamiento(fraccionamiento.id);
      await fetchFraccionamientos();
      showToast(`Fraccionamiento ${fraccionamiento.nombre} eliminado`, 'success');
    } catch (error) {
      console.error('❌ Error al eliminar fraccionamiento:', error);
      showToast(error.message || 'Error al eliminar fraccionamiento', 'error');
    }
  };

  // Wrapper para el submit del formulario
  const handleFormSubmitWrapper = async (fraccionamientoData) => {
    const submitFunction = editingFraccionamiento ? handleUpdateFraccionamiento : handleCreateFraccionamiento;
    await handleFormSubmit(fraccionamientoData, submitFunction);
  };

  // Ver lotes (placeholder - puedes conectar con tu sistema de lotes)
  const handleViewLotes = (fraccionamiento) => {
    console.log('Ver lotes de:', fraccionamiento);
    // Aquí puedes abrir el modal de lotes o navegar a la sección de lotes
    showToast(`Funcionalidad de lotes para "${fraccionamiento.nombre}" en desarrollo`, 'info');
  };

  if (loading && fraccionamientos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando fraccionamientos...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <FraccionamientoList
        fraccionamientos={fraccionamientos}
        onCreateClick={openCreateForm}
        onEditClick={openEditForm}
        onDeleteClick={handleDeleteFraccionamiento}
        onViewLotesClick={handleViewLotes}
      />
      
      {isFormOpen && (
        <FraccionamientoForm
          fraccionamientoData={editingFraccionamiento}
          onSubmit={handleFormSubmitWrapper}
          onCancel={closeForm}
          isEditing={!!editingFraccionamiento}
          isLoading={formLoading}
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

export default FraccionamientosSection;