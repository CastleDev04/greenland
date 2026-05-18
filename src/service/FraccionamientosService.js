// services/FraccionamientosService.js
const API_BASE_URL = 'https://api.greenlandpy.com/api';

const FraccionamientosService = {
  getHeaders() {
    const token = localStorage.getItem("token");
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  },

  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        if (response.status === 422 && errorData.errors) {
          console.error('Validation errors:', errorData.errors);
          errorMessage = `Error de validación: ${JSON.stringify(errorData.errors)}`;
        }
      } catch {
        // Si no se puede parsear la respuesta, usar el mensaje por defecto
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  // ========== FRACCIONAMIENTOS ==========
  
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/fraccionamientos`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await this.handleResponse(response);
      return data.fraccionamientos || data.data || data || [];
    } catch (error) {
      console.error('Error al obtener fraccionamientos:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/fraccionamientos/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error al obtener fraccionamiento ${id}:`, error);
      throw error;
    }
  },

  async create(fraccionamientoData) {
    try {
      console.log('🏘️ Creando fraccionamiento:', fraccionamientoData);
      const response = await fetch(`${API_BASE_URL}/fraccionamientos`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(fraccionamientoData)
      });
      const resultado = await this.handleResponse(response);
      console.log('✅ Fraccionamiento creado:', resultado);
      return resultado.fraccionamiento || resultado.data || resultado;
    } catch (error) {
      console.error('Error al crear fraccionamiento:', error);
      throw error;
    }
  },

  async update(id, fraccionamientoData) {
    try {
      console.log(`🏘️ Actualizando fraccionamiento ${id}:`, fraccionamientoData);
      const response = await fetch(`${API_BASE_URL}/fraccionamientos/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(fraccionamientoData)
      });
      const resultado = await this.handleResponse(response);
      console.log('✅ Fraccionamiento actualizado:', resultado);
      return resultado.fraccionamiento || resultado.data || resultado;
    } catch (error) {
      console.error(`Error al actualizar fraccionamiento ${id}:`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/fraccionamientos/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error al eliminar fraccionamiento ${id}:`, error);
      throw error;
    }
  },

  // ========== LOTES ==========

  async getLotesByFraccionamiento(fraccionamientoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/fraccionamientos/${fraccionamientoId}/lotes`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await this.handleResponse(response);
      return data.lotes || data.data || data || [];
    } catch (error) {
      console.error(`Error al obtener lotes del fraccionamiento ${fraccionamientoId}:`, error);
      return [];
    }
  },

  async getAllLotes() {
    try {
      const response = await fetch(`${API_BASE_URL}/lotes`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await this.handleResponse(response);
      return data.lotes || data.data || data || [];
    } catch (error) {
      console.error('Error al obtener todos los lotes:', error);
      return [];
    }
  },

  async getLoteById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/lotes/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error al obtener lote ${id}:`, error);
      throw error;
    }
  },

  async createLote(loteData) {
    try {
      console.log('📍 Creando lote:', loteData);
      const response = await fetch(`${API_BASE_URL}/lotes`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(loteData)
      });
      const resultado = await this.handleResponse(response);
      console.log('✅ Lote creado:', resultado);
      return resultado.lote || resultado.data || resultado;
    } catch (error) {
      console.error('Error al crear lote:', error);
      throw error;
    }
  },

  async updateLote(id, loteData) {
    try {
      console.log(`📍 Actualizando lote ${id}:`, loteData);
      const response = await fetch(`${API_BASE_URL}/lotes/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(loteData)
      });
      const resultado = await this.handleResponse(response);
      console.log('✅ Lote actualizado:', resultado);
      return resultado.lote || resultado.data || resultado;
    } catch (error) {
      console.error(`Error al actualizar lote ${id}:`, error);
      throw error;
    }
  },

  async deleteLote(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/lotes/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error al eliminar lote ${id}:`, error);
      throw error;
    }
  },

  // ========== ESTADÍSTICAS ==========

  async getEstadisticas() {
    try {
      const response = await fetch(`${API_BASE_URL}/fraccionamientos/estadisticas`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
};

export default FraccionamientosService;