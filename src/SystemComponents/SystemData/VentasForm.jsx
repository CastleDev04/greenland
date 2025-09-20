import { useState, useEffect } from 'react';
import { AlertCircle, DollarSign, Calendar, User, MapPin, CreditCard, X } from 'lucide-react';

const VentasForm = ({ onSubmit, onCancel, clientes = [], lotes = [], loading = false, ventaData = null }) => {
  
  const [formData, setFormData] = useState(ventaData ? {
    clienteId: ventaData.clienteId.toString(),
    loteId: ventaData.loteId.toString(),
    tipoPago: ventaData.tipoPago,
    cantidadCuotas: ventaData.cantidadCuotas?.toString() || '',
    montoCuota: ventaData.montoCuota?.toString() || '',
    fechaInicioPagos: ventaData.fechaInicioPagos || ''
  } : {
    clienteId: '',
    loteId: '',
    tipoPago: 'Contado',
    cantidadCuotas: '',
    montoCuota: '',
    fechaInicioPagos: ''
  });

  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const [errors, setErrors] = useState({});

  // Cargar lote seleccionado si estamos editando
  useEffect(() => {
    if (ventaData && ventaData.loteId) {
      const lote = lotes.find(l => l.id === parseInt(ventaData.loteId));
      setLoteSeleccionado(lote);
    }
  }, [ventaData, lotes]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleInputChange = (e) => {
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

  const handleLoteChange = (e) => {
    const loteId = e.target.value;
    setFormData(prev => ({ ...prev, loteId }));
    
    const lote = lotes.find(l => l.id === parseInt(loteId));
    setLoteSeleccionado(lote);
    
    if (lote && formData.cantidadCuotas) {
      const montoCuota = Math.round(lote.precioTotal / parseInt(formData.cantidadCuotas));
      setFormData(prev => ({ ...prev, montoCuota: montoCuota.toString() }));
    }
  };

  const handleTipoPagoChange = (e) => {
    const tipoPago = e.target.value;
    setFormData(prev => ({
      ...prev,
      tipoPago,
      cantidadCuotas: tipoPago === 'Contado' ? '' : prev.cantidadCuotas,
      montoCuota: tipoPago === 'Contado' ? '' : prev.montoCuota,
      fechaInicioPagos: tipoPago === 'Contado' ? '' : prev.fechaInicioPagos
    }));
  };

  const handleCuotasChange = (e) => {
    const cantidadCuotas = e.target.value;
    setFormData(prev => ({ ...prev, cantidadCuotas }));
    
    if (loteSeleccionado && cantidadCuotas) {
      const montoCuota = Math.round(loteSeleccionado.precioTotal / parseInt(cantidadCuotas));
      setFormData(prev => ({ ...prev, montoCuota: montoCuota.toString() }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clienteId) {
      newErrors.clienteId = 'Debe seleccionar un cliente';
    }

    if (!formData.loteId) {
      newErrors.loteId = 'Debe seleccionar un lote';
    }

    if (!formData.tipoPago) {
      newErrors.tipoPago = 'Debe seleccionar tipo de pago';
    }

    if (formData.tipoPago === 'Credito') {
      if (!formData.cantidadCuotas || parseInt(formData.cantidadCuotas) < 1) {
        newErrors.cantidadCuotas = 'Cantidad de cuotas debe ser mayor a 0';
      }

      if (parseInt(formData.cantidadCuotas) > 120) {
        newErrors.cantidadCuotas = 'Máximo 120 cuotas permitidas';
      }

      if (!formData.montoCuota || parseFloat(formData.montoCuota) <= 0) {
        newErrors.montoCuota = 'Monto de cuota debe ser mayor a 0';
      }

      if (!formData.fechaInicioPagos) {
        newErrors.fechaInicioPagos = 'Debe especificar fecha de inicio de pagos';
      }

      if (loteSeleccionado && formData.cantidadCuotas && formData.montoCuota) {
        const totalCalculado = parseInt(formData.cantidadCuotas) * parseFloat(formData.montoCuota);
        const diferencia = Math.abs(totalCalculado - loteSeleccionado.precioTotal);
        
        if (diferencia > loteSeleccionado.precioTotal * 0.05) {
          newErrors.montoCuota = 'El total de cuotas no coincide con el precio del lote';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const ventaDataToSubmit = {
      clienteId: parseInt(formData.clienteId),
      loteId: parseInt(formData.loteId),
      montoTotal: loteSeleccionado.precioTotal,
      tipoPago: formData.tipoPago,
      cantidadCuotas: formData.tipoPago === 'Credito' ? parseInt(formData.cantidadCuotas) : null,
      montoCuota: formData.tipoPago === 'Credito' ? parseFloat(formData.montoCuota) : null,
      fechaInicioPagos: formData.fechaInicioPagos || null
    };

    onSubmit(ventaDataToSubmit);
  };

  const clienteSeleccionado = clientes.find(c => c.id === parseInt(formData.clienteId));

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {ventaData ? 'Editar Venta' : 'Nueva Venta'}
          </h2>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sección Cliente */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="mr-2 text-blue-600" size={24} />
                Información del Cliente
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <select
                    name="clienteId"
                    value={formData.clienteId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.clienteId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.apellido} - CI: {cliente.cedula}
                      </option>
                    ))}
                  </select>
                  {errors.clienteId && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.clienteId}
                    </p>
                  )}
                </div>

                {clienteSeleccionado && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-900 mb-2">Cliente Seleccionado</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Nombre:</strong> {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>CI:</strong> {clienteSeleccionado.cedula}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sección Lote */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="mr-2 text-green-600" size={24} />
                Información del Lote
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lote Disponible *
                  </label>
                  <select
                    name="loteId"
                    value={formData.loteId}
                    onChange={handleLoteChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.loteId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar lote...</option>
                    {lotes.filter(lote => lote.estadoVenta === 'Disponible').map(lote => (
                      <option key={lote.id} value={lote.id}>
                        {lote.fraccionamiento} - Manzana {lote.manzana} Lote {lote.lote} - {formatCurrency(lote.precioTotal)}
                      </option>
                    ))}
                  </select>
                  {errors.loteId && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.loteId}
                    </p>
                  )}
                </div>

                {loteSeleccionado && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-900 mb-2">Lote Seleccionado</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Ubicación:</strong> {loteSeleccionado.fraccionamiento}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Manzana-Lote:</strong> {loteSeleccionado.manzana}-{loteSeleccionado.lote}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Superficie:</strong> {loteSeleccionado.superficie} m²
                    </p>
                    <p className="text-lg font-bold text-green-600 mt-2">
                      {formatCurrency(loteSeleccionado.precioTotal)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sección Pago */}
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="mr-2 text-yellow-600" size={24} />
                Modalidad de Pago
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Pago *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="tipoPago"
                        value="Contado"
                        checked={formData.tipoPago === 'Contado'}
                        onChange={handleTipoPagoChange}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-lg border-2 text-center transition-all ${
                        formData.tipoPago === 'Contado' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <DollarSign className="mx-auto mb-2 text-green-600" size={24} />
                        <span className="font-medium">Contado</span>
                      </div>
                    </label>

                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="tipoPago"
                        value="Credito"
                        checked={formData.tipoPago === 'Credito'}
                        onChange={handleTipoPagoChange}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-lg border-2 text-center transition-all ${
                        formData.tipoPago === 'Credito' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <Calendar className="mx-auto mb-2 text-blue-600" size={24} />
                        <span className="font-medium">Crédito</span>
                      </div>
                    </label>
                  </div>
                  {errors.tipoPago && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.tipoPago}
                    </p>
                  )}
                </div>

                {formData.tipoPago === 'Credito' && (
                  <div className="grid md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cantidad de Cuotas *
                      </label>
                      <input
                        type="number"
                        name="cantidadCuotas"
                        value={formData.cantidadCuotas}
                        onChange={handleCuotasChange}
                        min="1"
                        max="120"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.cantidadCuotas ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ej: 12"
                      />
                      {errors.cantidadCuotas && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.cantidadCuotas}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto por Cuota *
                      </label>
                      <input
                        type="number"
                        name="montoCuota"
                        value={formData.montoCuota}
                        onChange={handleInputChange}
                        min="0"
                        step="1000"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.montoCuota ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Monto en Gs."
                      />
                      {errors.montoCuota && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.montoCuota}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha Inicio Pagos *
                      </label>
                      <input
                        type="date"
                        name="fechaInicioPagos"
                        value={formData.fechaInicioPagos}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.fechaInicioPagos ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.fechaInicioPagos && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.fechaInicioPagos}
                        </p>
                      )}
                    </div>

                    {/* Resumen de crédito */}
                    {formData.cantidadCuotas && formData.montoCuota && loteSeleccionado && (
                      <div className="col-span-3 bg-white p-4 rounded-lg border">
                        <h4 className="font-medium text-gray-900 mb-2">Resumen del Crédito</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Total Cuotas:</span>
                            <p className="font-bold">
                              {formatCurrency(parseInt(formData.cantidadCuotas) * parseFloat(formData.montoCuota))}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Precio Lote:</span>
                            <p className="font-bold">{formatCurrency(loteSeleccionado.precioTotal)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Diferencia:</span>
                            <p className={`font-bold ${
                              Math.abs((parseInt(formData.cantidadCuotas) * parseFloat(formData.montoCuota)) - loteSeleccionado.precioTotal) > loteSeleccionado.precioTotal * 0.05 
                                ? 'text-red-600' 
                                : 'text-green-600'
                            }`}>
                              {formatCurrency(
                                (parseInt(formData.cantidadCuotas) * parseFloat(formData.montoCuota)) - loteSeleccionado.precioTotal
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {formData.tipoPago === 'Contado' && loteSeleccionado && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Pago al Contado</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(loteSeleccionado.precioTotal)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Pago único por la totalidad del lote
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Procesando...' : (ventaData ? 'Actualizar Venta' : 'Crear Venta')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VentasForm;