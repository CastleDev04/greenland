const API_BASE_URL = 'https://api.greenlandpy.com/api';
import clientesService from './ClientesService';

class VentasService {

  // ─── AUTENTICACIÓN ───────────────────────────────────────────────────────────

  getToken() {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.warn('No se pudo obtener el token:', error);
      return null;
    }
  }

  getHeaders() {
    const token = this.getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  normalizeTipoPago(tipoPago) {
    const raw = (tipoPago || '').toString().trim();
    const normalized = raw
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();

    if ([
      'credito',
      'credit',
      'financiado',
      'financiado',
      'al credito',
      'al cred',
      'crédito',
      'creditos'
    ].includes(normalized)) {
      return 'Credito';
    }

    if ([
      'contado',
      'contada',
      'al contado',
      'al contada',
      ''
    ].includes(normalized)) {
      return 'Contado';
    }

    return null;
  }

  isCreditoTipoPago(tipoPago) {
    return this.normalizeTipoPago(tipoPago) === 'Credito';
  }

  // ─── MANEJO DE RESPUESTAS / ERRORES ──────────────────────────────────────────

  async handleResponse(response) {
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      // Detalle de errores de validación 422
      if (response.status === 422 && errorData.errors) {
        const mensajes = Object.entries(errorData.errors)
          .map(([campo, errores]) => {
            const lista = Array.isArray(errores) ? errores.join(', ') : errores;
            return `${campo}: ${lista}`;
          })
          .join('\n');
        throw new Error(`Validación fallida:\n${mensajes}`);
      }

      const errorMessage =
        errorData.message ||
        errorData.error ||
        `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // ─── LOTES ──────────────────────────────────────────────────────────────────

  async actualizarEstadoLote(loteId, tipoPago, ventaId, compradorId) {
    try {
      const tipoPagoVenta = this.normalizeTipoPago(tipoPago);
      let estadoLote = 'Disponible';
      if (tipoPagoVenta === 'Contado') estadoLote = 'Vendido';
      else if (tipoPagoVenta === 'Credito') estadoLote = 'Reservado';

      const response = await fetch(`${API_BASE_URL}/lotes/${loteId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          estadoVenta: estadoLote,
          venta_id: ventaId || null,
          compradorId: compradorId || null
        })
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error al actualizar estado del lote #${loteId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async liberarLote(loteId) {
    try {
      const response = await fetch(`${API_BASE_URL}/lotes/${loteId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ estadoVenta: 'Disponible', venta_id: null, compradorId: null })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error al liberar lote #${loteId}:`, error);
      return { success: false, error: error.message };
    }
  }

  // ─── VENTAS ─────────────────────────────────────────────────────────────────

  async getVentas() {
    try {
      const response = await fetch(`${API_BASE_URL}/ventas`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await this.handleResponse(response);
      return data.ventas || data || [];
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      throw error;
    }
  }

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

  async getVentasActivas() {
    try {
      const response = await fetch(`${API_BASE_URL}/ventas-activas`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await this.handleResponse(response);
      return data.ventas || data || [];
    } catch {
      // Fallback: filtrar manualmente si el endpoint no existe
      const todasVentas = await this.getVentas();
      return todasVentas.filter(v =>
        v.estado === 'pendiente' || v.estado === 'Pendiente'
      );
    }
  }

  async createVenta(ventaData) {
    try {
      // 1️⃣ OBTENER O CREAR CLIENTE
      if (!ventaData.cliente) {
        throw new Error('Datos del cliente son requeridos');
      }
      const cliente = await this.getOrCreateCliente(ventaData.cliente);

      // 2️⃣ VALIDAR CAMPOS REQUERIDOS
      const camposRequeridos = ['lote_id', 'montoTotal', 'tipoPago', 'fechaInicio'];
      for (const campo of camposRequeridos) {
        if (!ventaData[campo]) {
          throw new Error(`Campo requerido vacío: ${campo}`);
        }
      }

      // 3️⃣ PREPARAR DATOS
      // 🔧 CORRECCIÓN IMPORTANTE: Normalizar tipoPago de forma robusta
      // El backend REQUIERE exactamente: "Contado" o "Credito"

      const tipoPagoVenta = this.normalizeTipoPago(ventaData.tipoPago);
      if (!tipoPagoVenta) {
        throw new Error(`Tipo de pago no válido: "${ventaData.tipoPago}". Valores aceptados: Contado o Credito`);
      }

      const datosVenta = {
        cliente_id: cliente.id,
        lote_id: parseInt(ventaData.lote_id),
        montoTotal: parseFloat(ventaData.montoTotal),
        tipoPago: tipoPagoVenta,  // Ahora SIEMPRE es "Contado" o "Credito"
        estado: ventaData.estado || 'pendiente',
        fechaInicio: ventaData.fechaInicio,
        cantidadCuotas: ventaData.cantidadCuotas ? parseInt(ventaData.cantidadCuotas) : 1,
        montoCuota: ventaData.montoCuota
          ? parseFloat(ventaData.montoCuota)
          : parseFloat(ventaData.montoTotal),
        diaVencimiento: ventaData.diaVencimiento ? parseInt(ventaData.diaVencimiento) : 5,
        tasaInteresMoratorio: ventaData.tasaInteresMoratorio
          ? parseFloat(ventaData.tasaInteresMoratorio)
          : 0.20,
        multaMoraDiaria: ventaData.multaMoraDiaria
          ? parseFloat(ventaData.multaMoraDiaria)
          : 5000
      };

      // Eliminar claves con valor null o undefined
      Object.keys(datosVenta).forEach(key => {
        if (datosVenta[key] === null || datosVenta[key] === undefined) {
          delete datosVenta[key];
        }
      });

      // 4️⃣ CREAR LA VENTA
      const responseVenta = await fetch(`${API_BASE_URL}/ventas`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(datosVenta)
      });
      const dataVenta = await this.handleResponse(responseVenta);
      const ventaCreada = dataVenta.venta || dataVenta;

      // 5️⃣ ACTUALIZAR ESTADO DEL LOTE
      const tipoPagoVentaCreada = this.normalizeTipoPago(
        ventaCreada?.tipoPago || ventaCreada?.tipo_pago || datosVenta.tipoPago
      );

      if (ventaCreada?.id) {
        await this.actualizarEstadoLote(
          ventaCreada.lote_id,
          tipoPagoVentaCreada,
          ventaCreada.id,
          cliente.id
        );
      }

      // 6️⃣ GENERAR CUOTAS PENDIENTES SI ES CRÉDITO
      // ✅ CORRECCIÓN #1: Usar ?? 1 para fallback en parseo
      const cantidadCuotasVentaCreada = parseInt(
        ventaCreada?.cantidadCuotas ?? 
        ventaCreada?.cantidad_cuotas ?? 
        datosVenta.cantidadCuotas ?? 
        1, // Fallback a 1 cuota si todo falla
        10
      );

      // ✅ CORRECCIÓN #2: Usar fallback a hoy si no hay fecha
      const fechaInicioVentaCreada = 
        ventaCreada?.fechaInicio || 
        ventaCreada?.fecha_inicio || 
        datosVenta.fechaInicio ||
        new Date().toISOString().split('T')[0]; // Fallback a hoy

      const esCredito = this.isCreditoTipoPago(tipoPagoVentaCreada);
      let cuotasGeneradas = 0;

      // ✅ CORRECCIÓN #3: Cambiar > 1 a >= 1 para permitir 1 cuota
      if (ventaCreada && esCredito && cantidadCuotasVentaCreada >= 1) {
        try {
          console.log(`📝 Generando ${cantidadCuotasVentaCreada} cuotas para venta #${ventaCreada.id}`);
          cuotasGeneradas = await this.generatePaymentRecords(
            ventaCreada.id,
            parseFloat(ventaCreada.montoTotal || datosVenta.montoTotal),
            cantidadCuotasVentaCreada,
            parseInt(ventaCreada.diaVencimiento || ventaCreada.dia_vencimiento || datosVenta.diaVencimiento, 10),
            parseFloat(ventaCreada.tasaInteresMoratorio || ventaCreada.tasa_interes_moratorio || datosVenta.tasaInteresMoratorio),
            parseFloat(ventaCreada.multaMoraDiaria || ventaCreada.multa_mora_diaria || datosVenta.multaMoraDiaria),
            fechaInicioVentaCreada
          );
          console.log(`✅ ${cuotasGeneradas} cuotas generadas exitosamente`);
        } catch (errorCuotas) {
          // ✅ CORRECCIÓN #4: Usar console.error y throw en lugar de console.warn
          console.error(`🔴 ERROR CRÍTICO generando cuotas para venta #${ventaCreada.id}:`, errorCuotas);
          throw new Error(`Venta creada pero falló generación de cuotas: ${errorCuotas.message}`);
        }
      } else {
        console.log(`📌 Venta de ${esCredito ? 'crédito' : 'contado'} - Cuotas: ${cantidadCuotasVentaCreada}`);
      }

      return { success: true, venta: ventaCreada, cliente, cuotasGeneradas };

    } catch (error) {
      console.error('Error al crear venta:', error);
      throw error;
    }
  }

  async updateVenta(id, ventaData) {
    try {
      let cliente_id = ventaData.cliente_id;

      if (ventaData.cliente && typeof ventaData.cliente === 'object') {
        const cliente = await this.getOrCreateCliente(ventaData.cliente);
        cliente_id = cliente.id;
      }

      const datosActualizacion = { ...ventaData, cliente_id, cliente: undefined };

      if ('tipoPago' in datosActualizacion) {
        const tipoPagoVenta = this.normalizeTipoPago(datosActualizacion.tipoPago);
        if (!tipoPagoVenta) {
          throw new Error(`Tipo de pago no válido: "${datosActualizacion.tipoPago}". Valores aceptados: Contado o Credito`);
        }
        datosActualizacion.tipoPago = tipoPagoVenta;
      }

      const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(datosActualizacion)
      });
      const dataVenta = await this.handleResponse(response);
      const ventaActualizada = dataVenta.venta || dataVenta;

      if (ventaActualizada?.tipoPago) {
        await this.actualizarEstadoLote(
          ventaActualizada.lote_id,
          ventaActualizada.tipoPago,
          id,
          cliente_id
        );
      }

      return { success: true, venta: ventaActualizada };
    } catch (error) {
      console.error(`Error al actualizar venta #${id}:`, error);
      throw error;
    }
  }

  async deleteVenta(id) {
    try {
      const ventaInfo = await this.getVentaById(id);

      const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      await this.handleResponse(response);

      if (ventaInfo.lote_id) {
        await this.liberarLote(ventaInfo.lote_id);
      }

      return { success: true };
    } catch (error) {
      console.error(`Error al eliminar venta #${id}:`, error);
      throw error;
    }
  }

  // ─── LOTES DISPONIBLES ──────────────────────────────────────────────────────

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

  // ─── CLIENTES ──────────────────────────────────────────────────────────────

  async getClienteByCedula(cedula) {
    try {
      // Intento 1: endpoint específico
      try {
        const response = await fetch(`${API_BASE_URL}/clientes/cedula/${cedula}`, {
          method: 'GET',
          headers: this.getHeaders()
        });
        if (response.ok) {
          const data = await this.handleResponse(response);
          return data.cliente || data;
        }
      } catch {
        // Endpoint no disponible; continuar con fallback
      }

      // Intento 2: filtrar del listado completo
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await this.handleResponse(response);
      const clientes = data.clientes || data || [];

      return clientes.find(
        c => c.cedula && String(c.cedula).trim() === String(cedula).trim()
      ) || null;

    } catch (error) {
      console.warn(`Error al buscar cliente por cédula: ${error.message}`);
      return null;
    }
  }

  async getOrCreateCliente(clienteData) {
    try {
      if (!clienteData?.cedula) {
        throw new Error('La cédula del cliente es requerida');
      }

      // Reusar cliente existente si ya tiene ID
      let cliente = await this.getClienteByCedula(clienteData.cedula);

      if (!cliente) {
        const nuevoCliente = {
          nombre: clienteData.nombre || '',
          apellido: clienteData.apellido || '',
          cedula: clienteData.cedula,
          email: clienteData.email || '',
          telefono: clienteData.telefono || '',
          direccion: clienteData.direccion || '',
          ciudad: clienteData.ciudad || '',
          estadoCivil: clienteData.estadoCivil || null,
          nacionalidad: clienteData.nacionalidad || 'Paraguaya',
          fechaNacimiento: clienteData.fechaNacimiento || null,
          profesion: clienteData.profesion || null,
          ruc: clienteData.ruc || null
        };

        const response = await clientesService.createCliente(nuevoCliente);
        cliente = response.cliente || response;
      }

      return cliente;
    } catch (error) {
      throw new Error(`Error al procesar cliente: ${error.message}`);
    }
  }


  // ─── CUOTAS ─────────────────────────────────────────────────────────────────

  /**
   * Crea registros de cuotas con estado 'pendiente' en POST /pagos.
   * Sin fechaPago ni tipoPago — el cobrador los completa al registrar cada pago.
   * La última cuota absorbe la diferencia de redondeo para que la suma sea exacta.
   */
  async generatePaymentRecords(
  ventaId,
  montoTotal,
  cantidadCuotas,
  diaVencimiento,
  tasaInteres,
  multaDiaria,
  fechaInicio
) {

  if (!fechaInicio || !cantidadCuotas || cantidadCuotas <= 0 || isNaN(cantidadCuotas)) {
    throw new Error(
      `Datos insuficientes para generar cuotas: fechaInicio=${fechaInicio}, cantidadCuotas=${cantidadCuotas}`
    );
  }

  const fechaBase = new Date(fechaInicio);

  const montoPorCuota = Math.floor(montoTotal / cantidadCuotas);

  const ultimaCuota =
    montoTotal - (montoPorCuota * (cantidadCuotas - 1));

  let creadas = 0;

  for (let i = 1; i <= cantidadCuotas; i++) {

    // ✅ Crear fecha limpia
    const year = fechaBase.getFullYear();
    const month = fechaBase.getMonth() + i;

    // Crear fecha provisional
    const fechaVencimiento = new Date(year, month, 1);

    // Obtener último día del mes
    const ultimoDiaMes = new Date(
      fechaVencimiento.getFullYear(),
      fechaVencimiento.getMonth() + 1,
      0
    ).getDate();

    // Ajustar día
    fechaVencimiento.setDate(
      Math.min(diaVencimiento, ultimoDiaMes)
    );

    const montoCuota =
      i === cantidadCuotas
        ? ultimaCuota
        : montoPorCuota;

    const cuota = {
      venta_id: ventaId,
      numero_cuota: i,
      monto_original: montoCuota,
      monto: montoCuota,
      fecha_vencimiento: fechaVencimiento
        .toISOString()
        .split('T')[0],

      dias_atraso: 0,
      tasa_interes_moratorio: tasaInteres,
      multa_mora_diaria: multaDiaria,
      estado: 'pendiente',

      // ✅ IMPORTANTE
      fechaPago: null,
      tipoPago: null
    };

    console.log(
      `📌 Creando cuota ${i}/${cantidadCuotas}`,
      cuota
    );

    try {

      const response = await fetch(`${API_BASE_URL}/pagos`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(cuota)
      });

      await this.handleResponse(response);

      creadas++;

    } catch (error) {

      console.error(
        `❌ Error creando cuota ${i}:`,
        error.message
      );
    }
  }

  console.log(`✅ Total cuotas creadas: ${creadas}`);

  return creadas;
}

}

export default new VentasService();