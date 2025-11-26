import { useState, useEffect } from 'react';
import { 
  DollarSign, Calendar, FileText, CreditCard, AlertCircle,
  X, Loader2, User, Building
} from 'lucide-react';

export default function PagosForm({ 
  pagoData = null,
  ventas = [], // Lista de ventas disponibles
  onSubmit,
  onCancel,
  isEditing = false,
  isLoading = false,
  title = null
}) {
  // Mover getInitialData DENTRO del componente, antes del useState
  const getInitialData = () => {
    if (pagoData) {
      // Convertir fecha ISO a formato YYYY-MM-DD para el input date
      let fechaPagoFormatted = '';
      if (pagoData.fechaPago) {
        try {
          const fecha = new Date(pagoData.fechaPago);
          if (!isNaN(fecha.getTime())) {
            fechaPagoFormatted = fecha.toISOString().split('T')[0];
          }
        } catch (error) {
          console.error('Error parsing fechaPago:', error);
        }
      }
      
      return {
        venta_id: pagoData.venta_id?.toString() || '',
        monto: pagoData.monto?.toString() || '',
        tipoPago: pagoData.tipoPago || '',
        comprobante: pagoData.comprobante || '',
        fechaPago: fechaPagoFormatted || new Date().toISOString().split('T')[0],
        interes: pagoData.interes?.toString() || '',
        multa: pagoData.multa?.toString() || ''
      };
    }
    
    return {
      venta_id: '',
      monto: '',
      tipoPago: '',
      comprobante: '',
      fechaPago: new Date().toISOString().split('T')[0],
      interes: '',
      multa: ''
    };
  };

  // Ahora sí declarar formData después de definir getInitialData
  const [formData, setFormData] = useState(getInitialData);
  const [errors, setErrors] = useState({});

  // Reset form cuando pagoData cambia
  useEffect(() => {
    setFormData(getInitialData());
    setErrors({});
  }, [pagoData]);

  const tiposPago = [
    'efectivo',
    'transferencia',
    'cheque',
    'tarjeta',
    'deposito',
    'giro'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Para campos numéricos, permitir solo números y punto decimal
    let processedValue = value;
    if (['monto', 'interes', 'multa'].includes(name)) {
      // Remover caracteres no numéricos excepto punto decimal
      processedValue = value.replace(/[^\d.]/g, '');
      
      // Permitir solo un punto decimal
      const parts = processedValue.split('.');
      if (parts.length > 2) {
        processedValue = parts[0] + '.' + parts.slice(1).join('');
      }
      
      // Limitar a 2 decimales
      if (parts.length === 2 && parts[1].length > 2) {
        processedValue = parts[0] + '.' + parts[1].substring(0, 2);
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones de campos obligatorios
    if (!formData.venta_id) newErrors.venta_id = 'Debe seleccionar una venta';
    
    if (!formData.monto || formData.monto.trim() === '') {
      newErrors.monto = 'El monto es requerido';
    } else if (parseFloat(formData.monto) <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    } else if (isNaN(parseFloat(formData.monto))) {
      newErrors.monto = 'El monto debe ser un número válido';
    }
    
    if (!formData.tipoPago) newErrors.tipoPago = 'Debe seleccionar un tipo de pago';
    if (!formData.fechaPago) newErrors.fechaPago = 'La fecha de pago es requerida';

    // Validación de fecha no futura
    if (formData.fechaPago) {
      const fechaPago = new Date(formData.fechaPago);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaPago > hoy) {
        newErrors.fechaPago = 'La fecha de pago no puede ser futura';
      }
    }

    // Validación de montos numéricos
    if (formData.interes && formData.interes.trim() !== '') {
      if (isNaN(parseFloat(formData.interes)) || parseFloat(formData.interes) < 0) {
        newErrors.interes = 'El interés debe ser un número positivo';
      }
    }
    
    if (formData.multa && formData.multa.trim() !== '') {
      if (isNaN(parseFloat(formData.multa)) || parseFloat(formData.multa) < 0) {
        newErrors.multa = 'La multa debe ser un número positivo';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Preparar datos para enviar
    const dataToSubmit = {
      venta_id: parseInt(formData.venta_id),
      monto: parseFloat(formData.monto),
      tipoPago: formData.tipoPago,
      fechaPago: formData.fechaPago,
      comprobante: formData.comprobante.trim() || null,
      interes: formData.interes && formData.interes.trim() !== '' ? parseFloat(formData.interes) : null,
      multa: formData.multa && formData.multa.trim() !== '' ? parseFloat(formData.multa) : null
    };

    // Limpiar campos null/undefined
    Object.keys(dataToSubmit).forEach(key => {
      if (dataToSubmit[key] === null || dataToSubmit[key] === undefined || dataToSubmit[key] === '') {
        delete dataToSubmit[key];
      }
    });

    try {
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error submitting form:', error);
      // El error se maneja en el componente padre
    }
  };

  const formTitle = title || (isEditing ? 'Editar Pago' : 'Registrar Pago');
  const buttonText = isEditing ? 'Actualizar Pago' : 'Registrar Pago';

  // Calcular el total del pago
  const calcularTotal = () => {
    const monto = parseFloat(formData.monto) || 0;
    const interes = parseFloat(formData.interes) || 0;
    const multa = parseFloat(formData.multa) || 0;
    return monto + interes + multa;
  };

  const formatMoney = (amount) => {
    const numericAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericAmount);
  };

  // Obtener información de la venta seleccionada
  const ventaSeleccionada = ventas.find(v => v.id === parseInt(formData.venta_id));

  // Obtener nombre del cliente de forma segura
  const getClienteNombre = (venta) => {
    if (!venta) return 'Cliente no encontrado';
    
    if (venta.cliente && venta.cliente.nombre) {
      return venta.cliente.nombre;
    }
    if (venta.clienteNombre) {
      return venta.clienteNombre;
    }
    if (venta.cliente_id) {
      return `Cliente #${venta.cliente_id}`;
    }
    
    return 'Cliente no especificado';
  };

  // Obtener información del lote de forma segura
  const getLoteInfo = (venta) => {
    if (!venta) return 'Lote no especificado';
    
    if (venta.lote && venta.lote.numero) {
      return `Lote ${venta.lote.numero}`;
    }
    if (venta.lote_numero) {
      return `Lote ${venta.lote_numero}`;
    }
    if (venta.lote_id) {
      return `Lote #${venta.lote_id}`;
    }
    
    return 'Lote no especificado';
  };

  // Calcular saldo pendiente
  const getSaldoPendiente = (venta) => {
    if (!venta) return 0;
    
    // Diferentes formas en que podría venir el saldo
    if (venta.saldo_pendiente !== undefined) return venta.saldo_pendiente;
    if (venta.saldo !== undefined) return venta.saldo;
    if (venta.montoTotal !== undefined && venta.totalPagado !== undefined) {
      return venta.montoTotal - venta.totalPagado;
    }
    
    return venta.montoTotal || 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-screen overflow-y-auto">
        
        {/* Agregar form tag alrededor de todo */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{formTitle}</h2>
                <p className="text-gray-600 mt-1">
                  {isEditing 
                    ? 'Modifique la información del pago' 
                    : 'Complete la información del pago recibido'
                  }
                </p>
              </div>
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors p-1 rounded hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Información de la Venta */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="mr-2 text-blue-600" size={20} />
                  Información de la Venta
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Venta *
                    </label>
                    <select
                      name="venta_id"
                      value={formData.venta_id}
                      onChange={handleChange}
                      disabled={isLoading || isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors.venta_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccione una venta</option>
                      {ventas.map((venta) => (
                        <option key={venta.id} value={venta.id}>
                          Venta #{venta.id} - {getClienteNombre(venta)} - {formatMoney(venta.montoTotal)}
                        </option>
                      ))}
                    </select>
                    {errors.venta_id && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.venta_id}
                      </p>
                    )}
                  </div>

                  {ventaSeleccionada && (
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Detalles de la Venta Seleccionada</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-start">
                          <User size={14} className="mr-2 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-gray-600 text-xs">Cliente</p>
                            <p className="font-medium">{getClienteNombre(ventaSeleccionada)}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Building size={14} className="mr-2 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-gray-600 text-xs">Lote</p>
                            <p className="font-medium">{getLoteInfo(ventaSeleccionada)}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">Monto Total</p>
                          <p className="font-medium">{formatMoney(ventaSeleccionada.montoTotal)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">Saldo Pendiente</p>
                          <p className={`font-medium ${
                            getSaldoPendiente(ventaSeleccionada) > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatMoney(getSaldoPendiente(ventaSeleccionada))}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del Pago */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <DollarSign className="mr-2 text-green-600" size={20} />
                  Detalles del Pago
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monto del Pago *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        Gs.
                      </span>
                      <input
                        type="text"
                        name="monto"
                        value={formData.monto}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          errors.monto ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.monto && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.monto}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="inline mr-1" size={14} />
                      Fecha de Pago *
                    </label>
                    <input
                      type="date"
                      name="fechaPago"
                      value={formData.fechaPago}
                      onChange={handleChange}
                      disabled={isLoading}
                      max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors.fechaPago ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.fechaPago && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.fechaPago}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <CreditCard className="inline mr-1" size={14} />
                      Tipo de Pago *
                    </label>
                    <select
                      name="tipoPago"
                      value={formData.tipoPago}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors.tipoPago ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccione tipo de pago</option>
                      {tiposPago.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.tipoPago && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.tipoPago}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FileText className="inline mr-1" size={14} />
                      Comprobante (Opcional)
                    </label>
                    <input
                      type="text"
                      name="comprobante"
                      value={formData.comprobante}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Número o nombre del comprobante"
                      maxLength={255}
                    />
                  </div>
                </div>
              </div>

              {/* Cargos Adicionales */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <AlertCircle className="mr-2 text-yellow-600" size={20} />
                  Cargos Adicionales (Opcional)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interés Moratorio
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        Gs.
                      </span>
                      <input
                        type="text"
                        name="interes"
                        value={formData.interes}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          errors.interes ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.interes && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.interes}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Multa por Mora
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        Gs.
                      </span>
                      <input
                        type="text"
                        name="multa"
                        value={formData.multa}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          errors.multa ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.multa && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.multa}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Resumen Total */}
              <div className="bg-gray-800 text-white p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">Total del Pago:</span>
                  <span className="text-2xl font-bold">{formatMoney(calcularTotal())}</span>
                </div>
                
                <div className="mt-2 text-sm text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Monto principal:</span>
                    <span>{formatMoney(formData.monto)}</span>
                  </div>
                  {formData.interes && parseFloat(formData.interes) > 0 && (
                    <div className="flex justify-between">
                      <span>Interés moratorio:</span>
                      <span className="text-yellow-300">{formatMoney(formData.interes)}</span>
                    </div>
                  )}
                  {formData.multa && parseFloat(formData.multa) > 0 && (
                    <div className="flex justify-between">
                      <span>Multa por mora:</span>
                      <span className="text-red-300">{formatMoney(formData.multa)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Procesando...
                    </>
                  ) : (
                    buttonText
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed shadow-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}