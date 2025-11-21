import { useState } from 'react';
import { 
  DollarSign, Calendar, FileText, CreditCard, AlertCircle,
  X, Loader2
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
        const fecha = new Date(pagoData.fechaPago);
        fechaPagoFormatted = fecha.toISOString().split('T')[0];
      }
      
      return {
        venta_id: pagoData.venta_id || '',
        monto: pagoData.monto || '',
        tipoPago: pagoData.tipoPago || '',
        comprobante: pagoData.comprobante || '',
        fechaPago: fechaPagoFormatted || new Date().toISOString().split('T')[0],
        interes: pagoData.interes || '',
        multa: pagoData.multa || ''
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    }
    if (!formData.tipoPago) newErrors.tipoPago = 'Debe seleccionar un tipo de pago';
    if (!formData.fechaPago) newErrors.fechaPago = 'La fecha de pago es requerida';

    // Validación de montos numéricos
    if (formData.interes && (isNaN(formData.interes) || parseFloat(formData.interes) < 0)) {
      newErrors.interes = 'El interés debe ser un número positivo';
    }
    if (formData.multa && (isNaN(formData.multa) || parseFloat(formData.multa) < 0)) {
      newErrors.multa = 'La multa debe ser un número positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ← AGREGAR ESTO para prevenir el comportamiento por defecto
    
    if (!validateForm()) {
      return;
    }

    const dataToSubmit = {
      venta_id: parseInt(formData.venta_id),
      monto: parseFloat(formData.monto),
      tipoPago: formData.tipoPago,
      fechaPago: formData.fechaPago,
      comprobante: formData.comprobante.trim() || undefined,
      interes: formData.interes ? parseFloat(formData.interes) : undefined,
      multa: formData.multa ? parseFloat(formData.multa) : undefined
    };

    // Limpiar campos undefined
    Object.keys(dataToSubmit).forEach(key => {
      if (dataToSubmit[key] === undefined || dataToSubmit[key] === '') {
        delete dataToSubmit[key];
      }
    });

    await onSubmit(dataToSubmit);
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
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Obtener información de la venta seleccionada
  const ventaSeleccionada = ventas.find(v => v.id === parseInt(formData.venta_id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-screen overflow-y-auto">
        
        {/* Agregar form tag alrededor de todo */}
        <form onSubmit={handleSubmit}>
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
                type="button" // ← IMPORTANTE: type="button" para que no envíe el form
                onClick={onCancel}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Información de la Venta */}
              <div className="bg-blue-50 p-4 rounded-lg">
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
                          Venta #{venta.id} - {venta.clienteNombre || 'Cliente'} - {formatMoney(venta.montoTotal)}
                        </option>
                      ))}
                    </select>
                    {errors.venta_id && <p className="mt-1 text-sm text-red-600">{errors.venta_id}</p>}
                  </div>

                  {ventaSeleccionada && (
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Detalles de la Venta</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Cliente:</span>
                          <p className="font-medium">{ventaSeleccionada.clienteNombre}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Monto Total:</span>
                          <p className="font-medium">{formatMoney(ventaSeleccionada.montoTotal)}</p>
                        </div>
                        {ventaSeleccionada.saldo !== undefined && (
                          <div>
                            <span className="text-gray-600">Saldo Pendiente:</span>
                            <p className="font-medium text-red-600">{formatMoney(ventaSeleccionada.saldo)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del Pago */}
              <div className="bg-green-50 p-4 rounded-lg">
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
                        type="number"
                        name="monto"
                        value={formData.monto}
                        onChange={handleChange}
                        disabled={isLoading}
                        step="0.01"
                        min="0"
                        className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          errors.monto ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.monto && <p className="mt-1 text-sm text-red-600">{errors.monto}</p>}
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors.fechaPago ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.fechaPago && <p className="mt-1 text-sm text-red-600">{errors.fechaPago}</p>}
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
                    {errors.tipoPago && <p className="mt-1 text-sm text-red-600">{errors.tipoPago}</p>}
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
                    />
                  </div>
                </div>
              </div>

              {/* Cargos Adicionales */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <AlertCircle className="mr-2 text-yellow-600" size={20} />
                  Cargos Adicionales (Opcional)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interés
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        Gs.
                      </span>
                      <input
                        type="number"
                        name="interes"
                        value={formData.interes}
                        onChange={handleChange}
                        disabled={isLoading}
                        step="0.01"
                        min="0"
                        className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          errors.interes ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.interes && <p className="mt-1 text-sm text-red-600">{errors.interes}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Multa
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        Gs.
                      </span>
                      <input
                        type="number"
                        name="multa"
                        value={formData.multa}
                        onChange={handleChange}
                        disabled={isLoading}
                        step="0.01"
                        min="0"
                        className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          errors.multa ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.multa && <p className="mt-1 text-sm text-red-600">{errors.multa}</p>}
                  </div>
                </div>
              </div>

              {/* Resumen Total */}
              {(formData.monto || formData.interes || formData.multa) && (
                <div className="bg-gray-800 text-white p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total del Pago:</span>
                    <span className="text-2xl font-bold">{formatMoney(calcularTotal())}</span>
                  </div>
                  {(formData.interes || formData.multa) && (
                    <div className="mt-2 text-sm text-gray-300 space-y-1">
                      <div className="flex justify-between">
                        <span>Monto principal:</span>
                        <span>{formatMoney(formData.monto)}</span>
                      </div>
                      {formData.interes && (
                        <div className="flex justify-between">
                          <span>Interés:</span>
                          <span>{formatMoney(formData.interes)}</span>
                        </div>
                      )}
                      {formData.multa && (
                        <div className="flex justify-between">
                          <span>Multa:</span>
                          <span>{formatMoney(formData.multa)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit" // ← type="submit" para el botón de enviar
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center justify-center"
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
                  type="button" // ← type="button" para el botón de cancelar
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed"
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