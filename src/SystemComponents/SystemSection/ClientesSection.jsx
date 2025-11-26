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
    lotes,
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
    console.log('🔍 useEffect ejecutándose (solo una vez)');
    refetch();
  }, []);

  // 🔥 CORREGIDO - Usar clienteData.nombre en lugar de newCliente.nombre
  const handleCreateCliente = async (clienteData) => {
    try {
      await createCliente(clienteData);
      console.log('✅ Cliente creado con datos:', clienteData);
      
      // Recargar datos del servidor
      await refetch();
      
      // 🔥 CORRECCIÓN: Usar clienteData.nombre (del formulario)
      showToast(`Cliente ${clienteData.nombre} creado exitosamente`, 'success');
    } catch (error) {
      console.error('❌ Error al crear cliente:', error);
      showToast(error.message || 'Error al crear cliente', 'error');
    }
  };

  // 🔥 CORREGIDO - Usar clienteData.nombre en lugar de updatedCliente.nombre
  const handleUpdateCliente = async (clienteData) => {
    try {
      await updateCliente(editingCliente.id, clienteData);
      console.log('✅ Cliente actualizado con datos:', clienteData);
      
      // Recargar datos del servidor
      await refetch();
      
      // 🔥 CORRECCIÓN: Usar clienteData.nombre (del formulario)
      showToast(`Cliente ${clienteData.nombre} actualizado correctamente`, 'success');
    } catch (error) {
      console.error('❌ Error al actualizar cliente:', error);
      showToast(error.message || 'Error al actualizar cliente', 'error');
    }
  };

  // ✅ Esta función está bien - usa cliente.nombre que sí existe
  const handleDeleteCliente = async (cliente) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${cliente.nombre} ${cliente.apellido}?`)) return;
    
    try {
      await deleteCliente(cliente.id);
      
      // Recargar datos del servidor
      await refetch();
      
      showToast(`Cliente ${cliente.nombre} eliminado`, 'success');
    } catch (error) {
      console.error('❌ Error al eliminar cliente:', error);
      showToast(error.message || 'Error al eliminar cliente', 'error');
    }
  };

  const handleFormSubmitWrapper = async (clienteData) => {
    const submitFunction = editingCliente ? handleUpdateCliente : handleCreateCliente;
    await handleFormSubmit(clienteData, submitFunction);
  };

  // Función para recarga manual
  const handleManualRefresh = () => {
    console.log('🔄 Recarga manual solicitada');
    refetch();
  };

  if (loading && clientes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando clientes y lotes...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ClienteList
        clientes={clientes}
        lotes={lotes}
        onCreateClick={openCreateForm}
        onEditClick={openEditForm}
        onDeleteClick={handleDeleteCliente}
        onRefresh={handleManualRefresh}
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