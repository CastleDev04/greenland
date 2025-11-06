const API_BASE_URL = 'https://api.greenlandpy.com/api';
const token = localStorage.getItem("token");

class PagosService {
  // Obtener todos los pagos
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.pagos || data || [];
    } catch (error) {
      console.error('Error al obtener pagos:', error);
      throw error;
    }
  }

  // Obtener pago por ID
  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error al obtener pago ${id}:`, error);
      throw error;
    }
  }

  // Obtener pagos de una venta específica
  async getByVenta(ventaId) {
    try {
      const response = await fetch(`${API_BASE_URL}/ventas/${ventaId}/pagos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.pagos || data || [];
    } catch (error) {
      console.error(`Error al obtener pagos de venta ${ventaId}:`, error);
      throw error;
    }
  }

  // Crear un nuevo pago
  async create(pagoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pagoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear pago:', error);
      throw error;
    }
  }

  // Actualizar pago
  async update(id, pagoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pagoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error al actualizar pago ${id}:`, error);
      throw error;
    }
  }

  // Eliminar pago
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error(`Error al eliminar pago ${id}:`, error);
      throw error;
    }
  }

  // Subir comprobante de pago (archivo)
  async uploadComprobante(id, file) {
    try {
      const formData = new FormData();
      formData.append('comprobante', file);

      const response = await fetch(`${API_BASE_URL}/pagos/${id}/comprobante`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error al subir comprobante para pago ${id}:`, error);
      throw error;
    }
  }

  // Obtener estadísticas de pagos con filtros opcionales
  async getEstadisticas(filters = {}) {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/pagos/estadisticas?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener estadísticas de pagos:', error);
      throw error;
    }
  }

  // Filtrar pagos
  async filter(filters) {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/pagos?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.pagos || data || [];
    } catch (error) {
      console.error('Error al filtrar pagos:', error);
      throw error;
    }
  }
}

export default new PagosService();
