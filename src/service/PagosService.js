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
    console.log(`🔄 [DEBUG] Iniciando actualización para venta: ${ventaId}`);

    const pagos = await this.getByVenta(ventaId);
    console.log(`🔍 Pagos obtenidos para venta ${ventaId}:`, pagos);

    const isPagoCompletado = (pago) => {
      if (!pago) return false;
      return Boolean(
        pago.fechaPago ||
        pago.tipoPago ||
        (pago.estado && pago.estado.toLowerCase() === 'pagado')
      );
    };

    const pagosCompletados = pagos.filter(isPagoCompletado);
    const cuotasPagadas = pagosCompletados.length;
    const montoTotalPagado = pagosCompletados.reduce((total, pago) => {
      return total +
        (parseFloat(pago.monto) || 0) +
        (parseFloat(pago.interes) || 0) +
        (parseFloat(pago.multa) || 0);
    }, 0);

    console.log(`📊 Pagos completados: ${cuotasPagadas}, monto total pagado: ${montoTotalPagado}`);

    const ventaResponse = await fetch(`${API_BASE_URL}/ventas/${ventaId}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    const ventaResult = await this.handleResponse(ventaResponse);
    const venta = ventaResult.venta || ventaResult.data || ventaResult;

    if (!venta) {
      throw new Error('Venta no encontrada');
    }

    const montoTotalVenta = parseFloat(venta.montoTotal) || 0;
    const montoPagadoActual = parseFloat(venta.monto_pagado) || 0;
    console.log(`🔍 Venta actual: monto_total=${montoTotalVenta}, monto_pagado=${montoPagadoActual}`);

    let nuevoEstado = venta.estado || 'Pendiente';
    if (venta.estado && venta.estado.toLowerCase() === 'cancelado') {
      nuevoEstado = venta.estado;
    } else if (montoTotalPagado >= montoTotalVenta && montoTotalVenta > 0) {
      nuevoEstado = 'Pagado';
    } else {
      nuevoEstado = 'Pendiente';
    }

    const updateData = {
      estado: nuevoEstado,
      cuotas_pagadas: cuotasPagadas,
      cuotasPagadas,
      monto_pagado: parseFloat(montoTotalPagado.toFixed(2)),
      montoPagado: parseFloat(montoTotalPagado.toFixed(2)),
      montoTotal: venta.montoTotal,
      cantidadCuotas: venta.cantidadCuotas,
      tipoPago: venta.tipoPago,
      cliente_id: venta.cliente_id,
      user_id: venta.user_id
    };

    console.log(`🔄 Actualizando venta #${ventaId} con datos:`, updateData);

    const updateResponse = await fetch(`${API_BASE_URL}/ventas/${ventaId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updateData)
    });

    if (!updateResponse.ok) {
      if (updateResponse.status === 422) {
        const errorText = await updateResponse.text();
        console.error('❌ Error 422 al actualizar venta:', errorText);
        throw new Error(`Error de validación en el backend: ${errorText}`);
      }
      throw new Error(`Error HTTP ${updateResponse.status}`);
    }

    const resultado = await updateResponse.json();
    console.log(`✅ Venta #${ventaId} actualizada exitosamente.`);
    return resultado;
  } catch (error) {
    console.error('❌ Error en actualizarContadorCuotas:', error);
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
      const pagoPayload = { ...pagoData };
      delete pagoPayload.estado; // El backend de pagos no utiliza la columna `estado`

      console.log('💰 [DEBUG C] Creando pago en la API...');
      const response = await fetch(`${API_BASE_URL}/pagos`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(pagoPayload)
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
      const pagoPayload = { ...pagoData };
      delete pagoPayload.estado; // El backend de pagos no utiliza la columna `estado`

      const response = await fetch(`${API_BASE_URL}/pagos/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(pagoPayload)
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