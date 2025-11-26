import { useState } from 'react';

export const useVentaForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const openCreateForm = () => {
    setEditingVenta(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (venta) => {
    setEditingVenta(venta);
    setFormError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingVenta(null);
    setFormLoading(false);
    setFormError(null);
  };

  const handleFormSubmit = async (ventaData, submitFunction) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      console.log('📤 Enviando formulario de venta...');

      const result = await submitFunction(ventaData);
      console.log('✅ Formulario procesado exitosamente');
      closeForm();
      
      return { success: true, data: result };
      
    } catch (error) {
      console.error('❌ Error en el formulario:', error);
      const errorMessage = error.message || 'Error al procesar el formulario';
      setFormError(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setFormLoading(false);
    }
  };

  return {
    isFormOpen,
    editingVenta,
    formLoading,
    formError,
    openCreateForm,
    openEditForm,
    closeForm,
    handleFormSubmit,
    clearError: () => setFormError(null)
  };
};