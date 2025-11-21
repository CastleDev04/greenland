// hook/useVentaForm.js
import { useState } from 'react';

export const useVentaForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Abrir formulario para crear nueva venta
  const openCreateForm = () => {
    setEditingVenta(null);
    setIsFormOpen(true);
  };

  // Abrir formulario para editar venta existente
  const openEditForm = (venta) => {
    setEditingVenta(venta);
    setIsFormOpen(true);
  };

  // Cerrar formulario
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingVenta(null);
    setFormLoading(false);
  };

  // Manejar envío del formulario
  const handleFormSubmit = async (ventaData, submitFunction) => {
    setFormLoading(true);
    
    try {
      // submitFunction es createVenta o updateVenta
      await submitFunction(ventaData);
      
      // Cerrar formulario después de éxito
      closeForm();
      
      return { success: true };
    } catch (error) {
      console.error('Error en handleFormSubmit:', error);
      return { success: false, error: error.message };
    } finally {
      setFormLoading(false);
    }
  };

  return {
    isFormOpen,
    editingVenta,
    formLoading,
    openCreateForm,
    openEditForm,
    closeForm,
    handleFormSubmit
  };
};