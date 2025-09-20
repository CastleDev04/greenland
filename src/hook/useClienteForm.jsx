import { useState } from 'react';

export const useClienteForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const openCreateForm = () => {
    setEditingCliente(null);
    setIsFormOpen(true);
  };

  const openEditForm = (cliente) => {
    setEditingCliente(cliente);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCliente(null);
    setFormLoading(false);
  };

  const handleFormSubmit = async (clienteData, onSubmit) => {
    setFormLoading(true);
    try {
      await onSubmit(clienteData);
      closeForm();
    } catch (error) {
      console.log(error)
    } finally {
      setFormLoading(false);
    }
  };

  return {
    isFormOpen,
    editingCliente,
    formLoading,
    openCreateForm,
    openEditForm,
    closeForm,
    handleFormSubmit,
    setFormLoading
  };
};