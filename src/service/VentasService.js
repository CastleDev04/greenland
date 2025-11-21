const API_BASE_URL = 'https://api.greenlandpy.com/api';

class VentasService {
  // 🔹 Método para obtener el token dinámicamente
  getToken() {
    return localStorage.getItem("token");
  }

  // Obtener todas las ventas
  async getVentas() {
    try {
      const token = this.getToken();
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
      const token = this.getToken();
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

  // Crear nueva venta - CORREGIDO
  async createVenta(ventaData) {
    try {
      const token = this.getToken();
      
      console.log('📤 Creando venta con datos:', JSON.stringify(ventaData, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/ventas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ventaData)
      });

      console.log('📡 Estado respuesta:', response.status);
      console.log('📡 URL respuesta:', response.url);

      // SOLUCIÓN: Leer la respuesta UNA sola vez como texto primero
      const responseText = await response.text();
      console.log('📄 Respuesta completa del servidor:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonError) {
        console.log('❌ No se pudo parsear como JSON, usando texto plano');
        responseData = { message: responseText };
      }

      if (!response.ok) {
        const errorMessage = responseData.message || 
                           responseData.error || 
                           responseData.exception ||
                           `Error ${response.status}: ${response.statusText}`;
        
        console.log('❌ Error del servidor:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('✅ Venta creada exitosamente:', responseData);
      return responseData;

    } catch (error) {
      console.error('❌ Error completo al crear venta:', error);
      throw error;
    }
  }

  // Actualizar venta - CORREGIDO
  async updateVenta(id, ventaData) {
    try {
      const token = this.getToken();
      
      console.log(`📤 Actualizando venta #${id} con datos:`, JSON.stringify(ventaData, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ventaData)
      });

      // Leer respuesta como texto primero
      const responseText = await response.text();
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonError) {
        responseData = { message: responseText };
      }

      if (!response.ok) {
        const errorMessage = responseData.message || 
                           responseData.error || 
                           `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      console.log('✅ Venta actualizada:', responseData);
      return responseData;
    } catch (error) {
      console.error(`❌ Error al actualizar venta #${id}:`, error);
      throw error;
    }
  }

  // Eliminar venta (cancelar) - CORREGIDO
  async deleteVenta(id) {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Leer respuesta como texto primero
      const responseText = await response.text();
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonError) {
        responseData = { message: responseText };
      }

      if (!response.ok) {
        const errorMessage = responseData.message || 
                           responseData.error || 
                           `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
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
      const token = this.getToken();
      const response = await fetch(`${API_BASE_URL}/lotes`, {
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
      console.log('Lotes disponibles:', data);
      return data;
    } catch (error) {
      console.error('Error al obtener lotes:', error);
      throw error;
    }
  }

  // 🔹 Método auxiliar para convertir camelCase a snake_case
  toSnakeCase(obj) {
    const newObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        newObj[snakeKey] = obj[key];
      }
    }
    return newObj;
  }
}

export default new VentasService();