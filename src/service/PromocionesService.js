// src/services/PromocionesService.js

const API_URL = 'https://api.greenlandpy.com/api';

const PromocionesService = {
  getHeaders() {
    const token = localStorage.getItem("token");
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  },

  async handleResponse(response) {
    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;

        if (response.status === 422 && errorData.errors) {
          console.error('❌ Validation errors:', errorData.errors);
          errorMessage = `Error de validación: ${JSON.stringify(errorData.errors)}`;
        }
      } catch {
        // Si no se puede parsear, usar mensaje por defecto
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  // Obtener todas las publicidades
  async getAll() {
    const response = await fetch(`${API_URL}/publicidad`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return await this.handleResponse(response);
  },

  // Obtener solo las activas
  async getActivas() {
    const response = await fetch(`${API_URL}/publicidad-activas`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return await this.handleResponse(response);
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/publicidad/${id}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return await this.handleResponse(response);
  },

  async create(publicidadData) {
    const response = await fetch(`${API_URL}/publicidad`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(publicidadData)
    });
    return await this.handleResponse(response);
  },

  async update(id, publicidadData) {
    const response = await fetch(`${API_URL}/publicidad/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(publicidadData)
    });
    return await this.handleResponse(response);
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/publicidad/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return await this.handleResponse(response);
  },

  // Métodos de compatibilidad (mantener para no romper código existente)
  getPromociones() {
    return this.getAll();
  },
  createPromocion(publicidadData) {
    return this.create(publicidadData);
  },
  updatePromocion(id, publicidadData) {
    return this.update(id, publicidadData);
  },
  deletePromocion(id) {
    return this.delete(id);
  }
};

export default PromocionesService;