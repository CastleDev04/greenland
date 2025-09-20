import { useState } from 'react';

export const useVentaForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const openCreateForm = () => {
    setEditingVenta(null);
    setIsFormOpen(true);
  };

  const openEditForm = (venta) => {
    setEditingVenta(venta);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingVenta(null);
    setFormLoading(false);
  };

  const handleFormSubmit = async (ventaData, onSubmit) => {
    setFormLoading(true);
    try {
      await onSubmit(ventaData);
      closeForm();
    } catch (error) {
      console.error('Error en el formulario de venta:', error);
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