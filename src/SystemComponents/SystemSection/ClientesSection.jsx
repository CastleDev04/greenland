import React, { useEffect } from 'react';
import ClienteList from '../SystemData/ClienteList';
import ClientesForm from '../SystemData/ClientesForm';
import Toast from '../SystemData/Toast';
import { useClientes } from '../../hook/useClientes';
import { useClienteForm } from '../../hook/useClienteForm';
import { useToast } from '../../hook/useToast';

const ClientesSection = () => {
  const { 
    clientes, 
    loading, 
    error, 
    createCliente, 
    updateCliente, 
    deleteCliente,
    refetch
  } = useClientes();

  const {
    isFormOpen,
    editingCliente,
    formLoading,
    openCreateForm,
    openEditForm,
    closeForm,
    handleFormSubmit
  } = useClienteForm();

  const { toast, showToast, hideToast } = useToast();

  // CORRECCIÓN: useEffect con dependencias vacías para ejecutar solo una vez
  useEffect(() => {
    console.log('🔍 useEffect ejecutándose (solo una vez)');
    refetch();
  }, []); // ← Array de dependencias VACÍO

  const handleCreateCliente = async (clienteData) => {
    try {
      const newCliente = await createCliente(clienteData);
      showToast(`Cliente ${newCliente.nombre} creado exitosamente`, 'success');
      // No llamar refetch aquí porque createCliente ya actualiza el estado local
    } catch (error) {
      showToast(error.message || 'Error al crear cliente', 'error');
    }
  };

  const handleUpdateCliente = async (clienteData) => {
    try {
      const updatedCliente = await updateCliente(editingCliente.id, clienteData);
      showToast(`Cliente ${updatedCliente.nombre} actualizado`, 'success');
      // No llamar refetch aquí porque updateCliente ya actualiza el estado local
    } catch (error) {
      showToast(error.message || 'Error al actualizar cliente', 'error');
    }
  };

  const handleDeleteCliente = async (cliente) => {
    if (!window.confirm(`¿Eliminar a ${cliente.nombre}?`)) return;
    
    try {
      await deleteCliente(cliente.id);
      showToast(`Cliente ${cliente.nombre} eliminado`, 'success');
      // No llamar refetch aquí porque deleteCliente ya actualiza el estado local
    } catch (error) {
      showToast(error.message || 'Error al eliminar cliente', 'error');
    }
  };

  const handleFormSubmitWrapper = async (clienteData) => {
    const submitFunction = editingCliente ? handleUpdateCliente : handleCreateCliente;
    await handleFormSubmit(clienteData, submitFunction);
  };

  // Función para recargar manualmente si es necesario
  const handleManualRefresh = () => {
    console.log('🔄 Recarga manual solicitada');
    refetch();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando clientes...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ClienteList
        clientes={clientes}
        loading={loading}
        error={error}
        onCreateClick={openCreateForm}
        onEditClick={openEditForm}
        onDeleteClick={handleDeleteCliente}
        onRefresh={handleManualRefresh} // ← Recarga manual, no automática
      />
      
      {isFormOpen && (
        <ClientesForm
          clienteData={editingCliente}
          onSubmit={handleFormSubmitWrapper}
          onCancel={closeForm}
          isEditing={!!editingCliente}
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

export default ClientesSection;