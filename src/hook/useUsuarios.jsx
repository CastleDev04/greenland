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
        const response = await usuariosService.getAll();
        
        // 🔹 Manejo flexible de la respuesta
        console.log('Respuesta del servicio:', response);
        
        let usuariosArray = [];
        
        if (Array.isArray(response)) {
          // Si la respuesta es directamente un array
          usuariosArray = response;
        } else if (response && Array.isArray(response.data)) {
          // Si la respuesta tiene formato { data: [...] }
          usuariosArray = response.data;
        } else if (response && Array.isArray(response.usuarios)) {
          // Si la respuesta tiene formato { usuarios: [...] }
          usuariosArray = response.usuarios;
        } else if (response && typeof response === 'object') {
          // Si es un objeto, intentar encontrar el array
          const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            usuariosArray = possibleArrays[0];
          }
        }
        
        console.log('Usuarios procesados:', usuariosArray);
        setUsuarios(usuariosArray);
        
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
      const response = await usuariosService.create(usuarioData);
      
      // Extraer el usuario creado
      const newUsuario = response.data || response.usuario || response;
      
      setUsuarios(prev => [...prev, newUsuario]);
      return { success: true, data: newUsuario };
    } catch (err) {
      const errorMessage = err.message || 'Error al crear el usuario';
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
      const response = await usuariosService.update(id, usuarioData);
      
      // Extraer el usuario actualizado
      const updatedUsuario = response.data || response.usuario || response;
      
      setUsuarios(prev => 
        prev.map(usuario => usuario.id === id ? updatedUsuario : usuario)
      );
      return { success: true, data: updatedUsuario };
    } catch (err) {
      const errorMessage = err.message || 'Error al actualizar el usuario';
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
      const errorMessage = err.message || 'Error al eliminar el usuario';
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
      const response = await usuariosService.getById(id);
      const usuario = response.data || response.usuario || response;
      return { success: true, data: usuario };
    } catch (err) {
      const errorMessage = err.message || 'Error al obtener el usuario';
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
      const response = await usuariosService.changePassword(id, passwords);
      const updatedUsuario = response.data || response.usuario || response;
      
      setUsuarios(prev => 
        prev.map(usuario => usuario.id === id ? updatedUsuario : usuario)
      );
      return { success: true, data: updatedUsuario };
    } catch (err) {
      const errorMessage = err.message || 'Error al cambiar la contraseña';
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
      const response = await usuariosService.toggleStatus(id);
      const updatedUsuario = response.data || response.usuario || response;
      
      setUsuarios(prev => 
        prev.map(usuario => usuario.id === id ? updatedUsuario : usuario)
      );
      return { success: true, data: updatedUsuario };
    } catch (err) {
      const errorMessage = err.message || 'Error al cambiar el estado';
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