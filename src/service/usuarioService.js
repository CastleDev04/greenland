// services/usuariosService.js
import axios from 'axios';

const API_URL = 'https://api.greenlandpy.com/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para agregar token si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globales
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const usuarioService = {
  // Obtener todos los usuarios
  getAll: async () => {
    try {
      const response = await apiClient.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  // Obtener un usuario por ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener usuario ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo usuario
  create: async (usuarioData) => {
    try {
      const response = await apiClient.post('/usuarios', usuarioData);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  // Actualizar un usuario
  update: async (id, usuarioData) => {
    try {
      const response = await apiClient.put(`/usuarios/${id}`, usuarioData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar usuario ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un usuario
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar usuario ${id}:`, error);
      throw error;
    }
  },

  // Cambiar contraseña
  changePassword: async (id, passwords) => {
    try {
      const response = await apiClient.put(`/usuarios/${id}/password`, passwords);
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar contraseña del usuario ${id}:`, error);
      throw error;
    }
  },

  // Obtener usuarios por rol
  getByRol: async (rol) => {
    try {
      const response = await apiClient.get(`/usuarios/rol/${rol}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener usuarios con rol ${rol}:`, error);
      throw error;
    }
  },

  // Activar/Desactivar usuario (si tienes esta funcionalidad)
  toggleStatus: async (id) => {
    try {
      const response = await apiClient.patch(`/usuarios/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar estado del usuario ${id}:`, error);
      throw error;
    }
  },

  // Verificar si el email ya existe
  checkEmail: async (email) => {
    try {
      const response = await apiClient.post('/usuarios/check-email', { email });
      return response.data;
    } catch (error) {
      console.error('Error al verificar email:', error);
      throw error;
    }
  },
};

export default usuarioService;