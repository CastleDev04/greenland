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

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCreateCliente = async (clienteData) => {
    try {
      const newCliente = await createCliente(clienteData);
      showToast(`Cliente ${newCliente.nombre} creado exitosamente`, 'success');
    } catch (error) {
      showToast(error.message || 'Error al crear cliente', 'error');
    }
  };

  const handleUpdateCliente = async (clienteData) => {
    try {
      const updatedCliente = await updateCliente(editingCliente.id, clienteData);
      showToast(`Cliente ${updatedCliente.nombre} actualizado`, 'success');
    } catch (error) {
      showToast(error.message || 'Error al actualizar cliente', 'error');
    }
  };

  const handleDeleteCliente = async (cliente) => {
    if (!window.confirm(`¿Eliminar a ${cliente.nombre}?`)) return;
    
    try {
      await deleteCliente(cliente.id);
      showToast(`Cliente ${cliente.nombre} eliminado`, 'success');
    } catch (error) {
      showToast(error.message || 'Error al eliminar cliente', 'error');
    }
  };

  const handleFormSubmitWrapper = async (clienteData) => {
    const submitFunction = editingCliente ? handleUpdateCliente : handleCreateCliente;
    await handleFormSubmit(clienteData, submitFunction);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        onRefresh={refetch}
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