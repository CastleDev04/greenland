const API_BASE_URL = 'https://backend-greenland.onrender.com/api';
const token = localStorage.getItem("token");

class VentasService {
  // Obtener todas las ventas
  async getVentas() {
    try {
      const response = await fetch(`${API_BASE_URL}/ventas`, {
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
      
      // El backend devuelve { message: "...", ventas: [...] }
      // Necesitamos extraer el array de ventas
      console.log('Respuesta del backend:', data);
      
      // Si la respuesta tiene la propiedad 'ventas', devolver esa propiedad
      if (data.ventas && Array.isArray(data.ventas)) {
        return data.ventas;
      }
      
      // Si no, devolver los datos directamente (por si acaso)
      return data || [];
      
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      throw error;
    }
  }


  // Obtener una venta por ID
  async getVentaById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
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
      console.error('Error al obtener venta:', error);
      throw error;
    }
  }

  // Crear nueva venta
  async createVenta(ventaData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ventas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ventaData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear venta:', error);
      throw error;
    }
  }

  // Actualizar venta
  async updateVenta(id, ventaData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ventaData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      throw error;
    }
  }

  // Eliminar venta (cancelar)
  async deleteVenta(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
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
      console.error('Error al eliminar venta:', error);
      throw error;
    }
  }

  // Obtener lotes disponibles
  async getLotesDisponibles() {
    try {
      const response = await fetch(`${API_BASE_URL}/propiedades`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error al obtener lotes:', error);
      throw error;
    }
  }
}

export default new VentasService();