// hook/useFraccionamientoForm.js
import { useState, useCallback } from 'react';

export const useFraccionamientoForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoteFormOpen, setIsLoteFormOpen] = useState(false);
  const [editingFraccionamiento, setEditingFraccionamiento] = useState(null);
  const [editingLote, setEditingLote] = useState(null);
  const [selectedFraccionamiento, setSelectedFraccionamiento] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const openCreateForm = useCallback(() => {
    setEditingFraccionamiento(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((fraccionamiento) => {
    setEditingFraccionamiento(fraccionamiento);
    setIsFormOpen(true);
  }, []);

  const openCreateLoteForm = useCallback((fraccionamiento) => {
    setSelectedFraccionamiento(fraccionamiento);
    setEditingLote(null);
    setIsLoteFormOpen(true);
  }, []);

  const openEditLoteForm = useCallback((lote, fraccionamiento) => {
    setSelectedFraccionamiento(fraccionamiento);
    setEditingLote(lote);
    setIsLoteFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setIsLoteFormOpen(false);
    setEditingFraccionamiento(null);
    setEditingLote(null);
    setSelectedFraccionamiento(null);
    setFormLoading(false);
  }, []);

  const handleFormSubmit = useCallback(async (data, submitFunction) => {
    setFormLoading(true);
    try {
      await submitFunction(data);
      closeForm();
    } catch (error) {
      console.error('Error en submit:', error);
      throw error;
    } finally {
      setFormLoading(false);
    }
  }, [closeForm]);

  return {
    isFormOpen,
    isLoteFormOpen,
    editingFraccionamiento,
    editingLote,
    selectedFraccionamiento,
    formLoading,
    openCreateForm,
    openEditForm,
    openCreateLoteForm,
    openEditLoteForm,
    closeForm,
    handleFormSubmit
  };
};