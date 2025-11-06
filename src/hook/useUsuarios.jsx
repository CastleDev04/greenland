// hooks/useUsuarios.js
import { useState, useEffect, useCallback } from 'react';
import usuariosService from '../service/usuarioService';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Función para recargar los usuarios
  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await usuariosService.getAll();
        setUsuarios(data);
      } catch (err) {
        setError(err.message || 'Error al cargar los usuarios');
        console.error('Error al cargar usuarios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [refreshKey]);

  // Crear un nuevo usuario
  const createUsuario = async (usuarioData) => {
    setLoading(true);
    setError(null);
    try {
      const newUsuario = await usuariosService.create(usuarioData);
      setUsuarios(prev => [...prev, newUsuario]);
      return { success: true, data: newUsuario };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear el usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un usuario existente
  const updateUsuario = async (id, usuarioData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUsuario = await usuariosService.update(id, usuarioData);
      setUsuarios(prev => 
        prev.map(usuario => usuario.id === id ? updatedUsuario : usuario)
      );
      return { success: true, data: updatedUsuario };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un usuario
  const deleteUsuario = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await usuariosService.delete(id);
      setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Obtener un usuario específico
  const getUsuarioById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const usuario = await usuariosService.getById(id);
      return { success: true, data: usuario };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener el usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const changePassword = async (id, passwords) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUsuario = await usuariosService.changePassword(id, passwords);
      setUsuarios(prev => 
        prev.map(usuario => usuario.id === id ? updatedUsuario : usuario)
      );
      return { success: true, data: updatedUsuario };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cambiar la contraseña';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado del usuario
  const toggleStatus = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUsuario = await usuariosService.toggleStatus(id);
      setUsuarios(prev => 
        prev.map(usuario => usuario.id === id ? updatedUsuario : usuario)
      );
      return { success: true, data: updatedUsuario };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cambiar el estado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    usuarios,
    loading,
    error,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuarioById,
    changePassword,
    toggleStatus,
    refresh,
  };
};