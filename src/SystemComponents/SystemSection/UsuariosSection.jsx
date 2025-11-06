// components/UsuariosContainer.jsx
import { useState } from 'react';
import UsuariosList from '../SystemData/UsuariosList';
import UsuariosForm from '../SystemData/UsuariosForm';
import ChangePasswordModal from '../ChangePasswordModal';
import { useUsuarios } from '../../hook/useUsuarios';

export default function UsuariosContainer() {
  const {
    usuarios,
    loading,
    error,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    changePassword,
    refresh,
  } = useUsuarios();

  const [showForm, setShowForm] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [usuarioToChangePassword, setUsuarioToChangePassword] = useState(null);

  // Abrir formulario para crear
  const handleCreateClick = () => {
    setSelectedUsuario(null);
    setShowForm(true);
  };

  // Abrir formulario para editar
  const handleEditClick = (usuario) => {
    setSelectedUsuario(usuario);
    setShowForm(true);
  };

  // Manejar envío del formulario
  const handleFormSubmit = async (usuarioData) => {
    setFormLoading(true);
    
    try {
      let result;
      
      if (selectedUsuario) {
        // Actualizar usuario existente
        result = await updateUsuario(selectedUsuario.id, usuarioData);
      } else {
        // Crear nuevo usuario
        result = await createUsuario(usuarioData);
      }

      if (result.success) {
        alert(selectedUsuario 
          ? '✅ Usuario actualizado exitosamente' 
          : '✅ Usuario creado exitosamente'
        );
        
        setShowForm(false);
        setSelectedUsuario(null);
        refresh();
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      console.error('Error en handleFormSubmit:', err);
      alert('❌ Error inesperado al procesar el usuario');
    } finally {
      setFormLoading(false);
    }
  };

  // Manejar cancelación del formulario
  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedUsuario(null);
  };

  // Abrir modal de confirmación para eliminar
  const handleDeleteClick = (usuario) => {
    setUsuarioToDelete(usuario);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!usuarioToDelete) return;

    try {
      const result = await deleteUsuario(usuarioToDelete.id);
      
      if (result.success) {
        alert('✅ Usuario eliminado exitosamente');
        setShowDeleteModal(false);
        setUsuarioToDelete(null);
        refresh();
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      alert('❌ Error inesperado al eliminar el usuario');
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUsuarioToDelete(null);
  };

  // Abrir modal para cambiar contraseña
  const handleChangePasswordClick = (usuario) => {
    setUsuarioToChangePassword(usuario);
    setShowPasswordModal(true);
  };

  // Manejar cambio de contraseña
  const handleChangePasswordSubmit = async (passwords) => {
    if (!usuarioToChangePassword) return;

    try {
      const result = await changePassword(usuarioToChangePassword.id, passwords);
      
      if (result.success) {
        alert('✅ Contraseña actualizada exitosamente');
        setShowPasswordModal(false);
        setUsuarioToChangePassword(null);
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      alert('❌ Error inesperado al cambiar la contraseña');
    }
  };

  // Mostrar error si hay
  if (error && !loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
          <button 
            onClick={refresh}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Lista de usuarios */}
      <UsuariosList
        usuarios={usuarios}
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onChangePasswordClick={handleChangePasswordClick}
      />

      {/* Formulario de usuario */}
      {showForm && (
        <UsuariosForm
          usuarioData={selectedUsuario}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isEditing={!!selectedUsuario}
          isLoading={formLoading}
        />
      )}

      {/* Modal de cambio de contraseña */}
      {showPasswordModal && usuarioToChangePassword && (
        <ChangePasswordModal
          usuario={usuarioToChangePassword}
          onSubmit={handleChangePasswordSubmit}
          onCancel={() => {
            setShowPasswordModal(false);
            setUsuarioToChangePassword(null);
          }}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && usuarioToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Está seguro que desea eliminar este usuario?
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm">
                <strong>Nombre:</strong> {usuarioToDelete.nombre}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {usuarioToDelete.email}
              </p>
              <p className="text-sm">
                <strong>Rol:</strong> {usuarioToDelete.rol}
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-6">
              <p className="text-sm text-red-800">
                <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer. Se eliminarán todos los datos asociados a este usuario.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Sí, eliminar
              </button>
              <button
                onClick={handleCancelDelete}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de carga global */}
      {loading && !showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      )}
    </>
  );
}