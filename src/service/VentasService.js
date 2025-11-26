const API_BASE_URL = 'https://api.greenlandpy.com/api';

class VentasService {
  getToken() {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.warn('No se pudo obtener el token:', error);
      return null;
    }
  }

  getHeaders() {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async handleResponse(response) {
    console.log('🔍 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      const errorMessage = errorData.message || 
                          errorData.error || 
                          `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  }

  // ✅ CORREGIDO: Método para actualizar estado del lote
  async actualizarEstadoLote(loteId, tipoPago, ventaId, compradorId) {
    try {
      console.log(`🔄 Actualizando estado lote #${loteId} por tipo pago: ${tipoPago}, comprador: ${compradorId}`);
      
      // Determinar estado según tipo de pago
      let estadoLote = 'Disponible';
      if (tipoPago === 'Contado') {
        estadoLote = 'Vendido';
      } else if (tipoPago === 'Credito') {
        estadoLote = 'Reservado';
      }

      const loteData = {
        estadoVenta: estadoLote,
        venta_id: ventaId || null,
        compradorId: compradorId || null
      };

      console.log('📍 Datos lote a actualizar:', loteData);

      const response = await fetch(`${API_BASE_URL}/lotes/${loteId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(loteData)
      });

      const data = await this.handleResponse(response);
      console.log(`✅ Estado lote #${loteId} actualizado a: ${estadoLote}, comprador: ${compradorId}`);
      
      return data;

    } catch (error) {
      console.error(`❌ Error al actualizar estado del lote #${loteId}:`, error);
      return { success: false, error: error.message };
    }
  }

  // ✅ CORREGIDO: Método para liberar lote
  async liberarLote(loteId) {
    try {
      console.log(`🔄 Liberando lote #${loteId}`);
      
      const loteData = {
        estadoVenta: 'Disponible',
        venta_id: null,
        compradorId: null
      };

      const response = await fetch(`${API_BASE_URL}/lotes/${loteId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(loteData)
      });

      const data = await this.handleResponse(response);
      console.log(`✅ Lote #${loteId} liberado a disponible`);
      
      return data;

    } catch (error) {
      console.error(`❌ Error al liberar lote #${loteId}:`, error);
      return { success: false, error: error.message };
    }
  }

  // ✅ OBTENER VENTAS
  async getVentas() {
    try {
      console.log('🔄 Obteniendo ventas...');
      
      const response = await fetch(`${API_BASE_URL}/ventas`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const data = await this.handleResponse(response);
      console.log(`✅ ${data.ventas?.length || data.length || 0} ventas obtenidas`);
      
      return data.ventas || data || [];
      
    } catch (error) {
      console.error('❌ Error al obtener ventas:', error);
      throw error;
    }
  }

  // ✅ OBTENER VENTA POR ID
  async getVentaById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const data = await this.handleResponse(response);
      return data.venta || data;

    } catch (error) {
      console.error(`Error al obtener venta ${id}:`, error);
      throw error;
    }
  }

  // ✅ CREAR VENTA - CORREGIDO
  async createVenta(ventaData) {
    try {
      console.log('📤 Creando venta:', ventaData);

      // 1. Crear la venta
      const response = await fetch(`${API_BASE_URL}/ventas`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(ventaData)
      });

      const data = await this.handleResponse(response);
      console.log('✅ Venta creada:', data);

      // 2. Actualizar estado del lote
      if (data.success && data.venta) {
        await this.actualizarEstadoLote(
          data.venta.lote_id, 
          ventaData.tipoPago, 
          data.venta.id,
          ventaData.compradorId
        );
      }

      return data;

    } catch (error) {
      console.error('❌ Error al crear venta:', error);
      throw error;
    }
  }

  // ✅ ACTUALIZAR VENTA - CORREGIDO
  async updateVenta(id, ventaData) {
    try {
      console.log(`📤 Actualizando venta #${id}:`, ventaData);

      // 1. Actualizar la venta
      const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(ventaData)
      });

      const data = await this.handleResponse(response);
      console.log('✅ Venta actualizada:', data);

      // 2. Actualizar estado del lote si cambia el tipo de pago
      if (data.success && data.venta && ventaData.tipoPago) {
        await this.actualizarEstadoLote(
          data.venta.lote_id, 
          ventaData.tipoPago, 
          id,
          ventaData.compradorId
        );
      }

      return data;

    } catch (error) {
      console.error(`Error al actualizar venta #${id}:`, error);
      throw error;
    }
  }

  // ✅ ELIMINAR VENTA - CORREGIDO
  async deleteVenta(id) {
    try {
      // 1. Obtener info de la venta para saber qué lote liberar
      const ventaInfo = await this.getVentaById(id);
      
      // 2. Eliminar la venta
      const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      await this.handleResponse(response);

      // 3. Liberar el lote
      if (ventaInfo.lote_id) {
        await this.liberarLote(ventaInfo.lote_id);
      }

      return { success: true };

    } catch (error) {
      console.error(`Error al eliminar venta #${id}:`, error);
      throw error;
    }
  }

  // ✅ OBTENER VENTAS ACTIVAS
  async getVentasActivas() {
    try {
      const response = await fetch(`${API_BASE_URL}/ventas-activas`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const data = await this.handleResponse(response);
      return data.ventas || data || [];

    } catch (error) {
      console.log('⚠️ Endpoint ventas-activas no disponible, filtrando manualmente...');
      const todasVentas = await this.getVentas();
      return todasVentas.filter(venta => 
        venta.estado === 'pendiente' || venta.estado === 'Pendiente'
      );
    }
  }

  // ✅ OBTENER LOTES DISPONIBLES
  async getLotesDisponibles() {
    try {
      const response = await fetch(`${API_BASE_URL}/lotes`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const data = await this.handleResponse(response);
      return data.lotes || data || [];

    } catch (error) {
      console.error('Error al obtener lotes:', error);
      throw error;
    }
  }

  // ✅ SIMULAR VENTA
  simularVenta(ventaData) {
    try {
      const { montoTotal, tipoPago, cantidadCuotas, fechaInicio, diaVencimiento } = ventaData;
      
      let montoCuota = montoTotal;
      let calendarioPagos = [];

      if (tipoPago === 'Credito' && cantidadCuotas) {
        montoCuota = montoTotal / cantidadCuotas;
        
        if (fechaInicio && diaVencimiento) {
          const fechaBase = new Date(fechaInicio);
          
          for (let i = 0; i < cantidadCuotas; i++) {
            const fechaPago = new Date(fechaBase);
            fechaPago.setMonth(fechaBase.getMonth() + i);
            
            const dia = Math.min(diaVencimiento, new Date(
              fechaPago.getFullYear(), 
              fechaPago.getMonth() + 1, 
              0
            ).getDate());
            
            fechaPago.setDate(dia);
            
            calendarioPagos.push({
              cuota: i + 1,
              fecha: fechaPago.toISOString().split('T')[0],
              monto: montoCuota
            });
          }
        }
      }

      return {
        montoCuota: Math.round(montoCuota * 100) / 100,
        calendarioPagos,
        fechaPrimerPago: calendarioPagos[0]?.fecha || fechaInicio
      };

    } catch (error) {
      console.error('Error en simulación de venta:', error);
      throw error;
    }
  }
}

export default new VentasService();