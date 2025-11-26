const API_BASE_URL = 'https://api.greenlandpy.com/api';

const PagosService = {
  getHeaders() {
    const token = localStorage.getItem("token");
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  },

  async handleResponse(response) {
    console.log('🔍 Response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        
        // 🔥 CAPTURAR DETALLES DE ERRORES 422
        if (response.status === 422 && errorData.errors) {
          console.error('❌ Validation errors:', errorData.errors);
          errorMessage = `Error de validación: ${JSON.stringify(errorData.errors)}`;
        }
      } catch {
        // Si no se puede parsear la respuesta, usar el mensaje por defecto
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  // 🔥 VERSIÓN CORREGIDA - ACTUALIZACIÓN NO BLOQUEANTE
  // 🔥 VERSIÓN CORREGIDA - SUMA MONTOS CORRECTAMENTE
async actualizarContadorCuotas(ventaId) {
  try {
    console.log(`🔄 [DEBUG 1] Iniciando actualización para venta: ${ventaId}`);
    
    // 1. Obtener todos los pagos de esta venta
    console.log(`📊 [DEBUG 2] Obteniendo pagos de venta ${ventaId}...`);
    const pagos = await this.getByVenta(ventaId);
    console.log(`📊 [DEBUG 3] Pagos obtenidos:`, pagos);
    
    const cuotasPagadas = pagos.length;
    
    // 🔥 CORRECCIÓN CRÍTICA: Calcular monto total pagado SUMANDO todos los pagos
    const montoTotalPagado = pagos.reduce((total, pago) => {
      const montoPago = parseFloat(pago.monto) || 0;
      console.log(`💰 Sumando pago ${pago.id}: ${montoPago}`);
      return total + montoPago;
    }, 0);
    
    console.log(`📊 [DEBUG 4] Resumen: ${cuotasPagadas} pagos, ${montoTotalPagado} Gs.`);

    // 2. Obtener datos de la venta actual
    console.log(`📋 [DEBUG 5] Obteniendo datos de venta ${ventaId}...`);
    const ventaResponse = await fetch(`${API_BASE_URL}/ventas/${ventaId}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    console.log(`📋 [DEBUG 6] Respuesta venta - Status:`, ventaResponse.status);
    const ventaResult = await this.handleResponse(ventaResponse);
    const venta = ventaResult.venta || ventaResult.data || ventaResult;
    console.log('📋 [DEBUG 7] Datos actuales de venta:', venta);

    if (!venta) {
      throw new Error('Venta no encontrada');
    }

    const totalCuotas = venta.cantidadCuotas || 0;
    const montoTotalVenta = parseFloat(venta.montoTotal) || 0;

    // 🔥 VERIFICACIÓN: Comparar con monto_pagado actual para debug
    const montoPagadoActual = parseFloat(venta.monto_pagado) || 0;
    console.log(`🔍 COMPARACIÓN: Monto pagado actual: ${montoPagadoActual}, Calculado: ${montoTotalPagado}`);

    // 3. Calcular nuevo estado
    let nuevoEstado = venta.estado || 'Pendiente';
    
    if (montoTotalPagado >= montoTotalVenta && montoTotalVenta > 0) {
      nuevoEstado = 'Pagado';
      console.log(`🎯 Cambiando estado a: ${nuevoEstado} (${montoTotalPagado} >= ${montoTotalVenta})`);
    } else if (montoTotalPagado > 0 && nuevoEstado === 'Pendiente') {
      nuevoEstado = 'Pendiente';
      console.log(`🎯 Manteniendo estado: ${nuevoEstado} (pagado parcialmente)`);
    } else if (montoTotalPagado === 0) {
      nuevoEstado = 'Pendiente';
      console.log(`🎯 Estado: ${nuevoEstado} (sin pagos)`);
    }

    // 🔥 CORRECCIÓN: FORMATO COMPATIBLE Y SEGURO
    const updateData = {
      estado: nuevoEstado,
      cuotas_pagadas: cuotasPagadas,
      monto_pagado: montoTotalPagado.toFixed(2), // 🔥 ESTE ES EL MONTO CORRECTO SUMADO
      // Mantener campos críticos para evitar errores de validación
      montoTotal: venta.montoTotal,
      cantidadCuotas: venta.cantidadCuotas,
      tipoPago: venta.tipoPago,
      cliente_id: venta.cliente_id,
      user_id: venta.user_id
    };

    // 🔥 LIMPIAR CAMPOS PROBLEMÁTICOS
    delete updateData.created_at;
    delete updateData.updated_at;
    delete updateData.deleted_at;
    delete updateData.id;

    console.log(`🔄 [DEBUG 8] Datos a enviar en actualización:`, updateData);

    // 4. Actualizar venta con manejo mejorado de errores
    console.log(`🔄 [DEBUG 9] Enviando actualización a la API...`);
    const updateResponse = await fetch(`${API_BASE_URL}/ventas/${ventaId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updateData)
    });

    console.log(`🔄 [DEBUG 10] Respuesta actualización - Status:`, updateResponse.status);
    
    if (!updateResponse.ok) {
      // 🔥 MANEJO DETALLADO DE ERRORES 422
      if (updateResponse.status === 422) {
        const errorText = await updateResponse.text();
        console.error('❌ [DEBUG ERROR 422] Detalles del error:', errorText);
        throw new Error(`Error de validación en el backend: ${errorText}`);
      }
      throw new Error(`Error HTTP ${updateResponse.status}`);
    }

    const resultado = await updateResponse.json();
    console.log(`✅ [DEBUG 11] Venta actualizada exitosamente:`, resultado);
    
    // 🔥 VERIFICACIÓN FINAL
    console.log(`💰 RESUMEN FINAL: ${cuotasPagadas} cuotas, ${montoTotalPagado} Gs. pagados de ${montoTotalVenta} Gs.`);
    
    return resultado;

  } catch (error) {
    console.error(`❌ [DEBUG ERROR] Error en actualizarContadorCuotas:`, error);
    console.error(`❌ [DEBUG ERROR] Stack:`, error.stack);
    throw error;
  }
},

  // Obtener todos los pagos
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const data = await this.handleResponse(response);
      return data.pagos || data.data || data || [];
    } catch (error) {
      console.error('Error al obtener pagos:', error);
      throw error;
    }
  },

  // Obtener pago por ID
  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error al obtener pago ${id}:`, error);
      throw error;
    }
  },

  // Obtener pagos de una venta específica
  async getByVenta(ventaId) {
    try {
      console.log(`🔍 [DEBUG] Obteniendo pagos para venta ${ventaId}...`);
      const response = await fetch(`${API_BASE_URL}/pagos/venta/${ventaId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      console.log(`🔍 [DEBUG] Respuesta pagos - Status:`, response.status);
      const data = await this.handleResponse(response);
      console.log(`🔍 [DEBUG] Datos pagos obtenidos:`, data);
      
      return data.pagos || data.data || data || [];
    } catch (error) {
      console.error(`Error al obtener pagos de venta ${ventaId}:`, error);
      throw error;
    }
  },

  // 🔥🔥🔥 VERSIÓN CORREGIDA - CREATE CON ACTUALIZACIÓN NO BLOQUEANTE
  async create(pagoData) {
    try {
      console.log('💰 [DEBUG A] ===== INICIANDO CREACIÓN DE PAGO =====');
      console.log('💰 [DEBUG B] Datos del pago:', pagoData);
      
      if (!pagoData.venta_id || !pagoData.monto) {
        throw new Error('Datos incompletos para crear pago');
      }
      
      // 1. Crear el pago
      console.log('💰 [DEBUG C] Creando pago en la API...');
      const response = await fetch(`${API_BASE_URL}/pagos`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(pagoData)
      });

      console.log('💰 [DEBUG D] Respuesta crear pago - Status:', response.status);
      const pagoCreado = await this.handleResponse(response);
      console.log('✅ [DEBUG E] Pago creado exitosamente:', pagoCreado);

      // 🔥 OBTENER VENTA_ID DE MÚLTIPLES FUENTES
      const ventaId = pagoCreado.venta_id || 
                     pagoCreado.pago?.venta_id || 
                     pagoCreado.data?.venta_id ||
                     pagoData.venta_id;
      
      console.log('🔍 [DEBUG F] Venta ID detectada:', {
        fromResponse: pagoCreado.venta_id,
        fromPagoObject: pagoCreado.pago?.venta_id,
        fromDataObject: pagoCreado.data?.venta_id,
        fromOriginalData: pagoData.venta_id,
        finalVentaId: ventaId
      });

      // 🔥🔥🔥 ACTUALIZACIÓN NO BLOQUEANTE - NO DETIENE EL FLUJO PRINCIPAL
      if (ventaId) {
        console.log('🔄 [DEBUG G] Venta ID encontrada:', ventaId);
        console.log('🔄 [DEBUG H] Ejecutando actualización NO BLOQUEANTE...');
        
        // Ejecutar en segundo plano sin await
        this.actualizarContadorCuotas(ventaId)
          .then(() => {
            console.log('✅ [DEBUG I] ACTUALIZACIÓN EXITOSA');
          })
          .catch(updateError => {
            console.warn('⚠️ [DEBUG J] Actualización falló (no crítico):', updateError.message);
            // No re-lanzar el error para no interrumpir la creación del pago
            console.log('💡 El pago se creó correctamente, pero la venta no se actualizó automáticamente.');
            console.log('💡 Puede actualizar manualmente la venta más tarde.');
          });
      } else {
        console.warn('⚠️ [DEBUG L] No se pudo determinar venta_id para actualización');
      }

      console.log('💰 [DEBUG N] ===== FINALIZADA CREACIÓN DE PAGO =====');
      return pagoCreado;
    } catch (error) {
      console.error('❌ [DEBUG O] ERROR GENERAL al crear pago:', error);
      throw error;
    }
  },

  // Actualizar pago - VERSIÓN CORREGIDA
  async update(id, pagoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(pagoData)
      });

      const pagoActualizado = await this.handleResponse(response);
      console.log('✅ Pago actualizado:', pagoActualizado);

      // 🔥 ACTUALIZACIÓN NO BLOQUEANTE
      const ventaId = pagoActualizado.venta_id || 
                     pagoActualizado.pago?.venta_id || 
                     pagoActualizado.data?.venta_id ||
                     pagoData.venta_id;

      if (ventaId) {
        this.actualizarContadorCuotas(ventaId)
          .then(() => console.log('✅ Venta actualizada después de editar pago'))
          .catch(err => console.warn('⚠️ Error al actualizar venta (no crítico):', err.message));
      }

      return pagoActualizado;
    } catch (error) {
      console.error(`Error al actualizar pago ${id}:`, error);
      throw error;
    }
  },

  // Eliminar pago - VERSIÓN CORREGIDA
  async delete(id) {
    try {
      const pago = await this.getById(id);
      
      // 🔥 OBTENER VENTA_ID ANTES DE ELIMINAR
      const ventaId = pago.venta_id || pago.pago?.venta_id || pago.data?.venta_id;

      const response = await fetch(`${API_BASE_URL}/pagos/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      const resultado = await this.handleResponse(response);
      console.log('✅ Pago eliminado:', resultado);

      // 🔥 ACTUALIZACIÓN NO BLOQUEANTE
      if (ventaId) {
        this.actualizarContadorCuotas(ventaId)
          .then(() => console.log('✅ Venta actualizada después de eliminar pago'))
          .catch(err => console.warn('⚠️ Error al actualizar venta (no crítico):', err.message));
      }

      return resultado;
    } catch (error) {
      console.error(`Error al eliminar pago ${id}:`, error);
      throw error;
    }
  },

  // Subir comprobante de pago (archivo)
  async uploadComprobante(id, file) {
    try {
      const formData = new FormData();
      formData.append('comprobante', file);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/pagos/${id}/comprobante`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error al subir comprobante para pago ${id}:`, error);
      throw error;
    }
  },

  // 🔥 FUNCIÓN ADICIONAL: Actualización manual de venta
  async actualizarVentaManualmente(ventaId) {
    try {
      console.log('🔄 Ejecutando actualización manual de venta...');
      const resultado = await this.actualizarContadorCuotas(ventaId);
      console.log('✅ Venta actualizada manualmente:', resultado);
      return resultado;
    } catch (error) {
      console.error('❌ Error en actualización manual:', error);
      throw error;
    }
  }
};

export default PagosService;