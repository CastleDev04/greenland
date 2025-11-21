import { useState, useEffect } from 'react';
import { AlertCircle, DollarSign, Calendar, User, MapPin, CreditCard, X, CheckCircle, Clock, XCircle, FileText, Percent, AlertTriangle } from 'lucide-react';

const VentasForm = ({ onSubmit, onCancel, clientes = [], lotes = [], loading = false, ventaData = null }) => {
  
  const [formData, setFormData] = useState(ventaData ? {
    cliente_id: ventaData.clienteId?.toString() || ventaData.cliente_id?.toString() || '',
    lote_id: ventaData.loteId?.toString() || ventaData.lote_id?.toString() || '',
    montoTotal: ventaData.montoTotal?.toString() || '',
    estado: ventaData.estado || 'pendiente',
    tipoPago: ventaData.tipoPago || 'Contado',
    cantidadCuotas: ventaData.cantidadCuotas?.toString() || '',
    montoCuota: ventaData.montoCuota?.toString() || '',
    cuotasPagadas: ventaData.cuotasPagadas?.toString() || '0',
    fechaInicio: ventaData.fechaInicioPagos || ventaData.fechaInicio || '', // ← CAMBIADO
    tasaInteresMoratorio: ventaData.tasaInteresMoratorio?.toString() || '',
    multaMoraDiaria: ventaData.multaMoraDiaria?.toString() || '',
    comprobante: ventaData.comprobante || '',
    observaciones: ventaData.observaciones || '',
    fechaUltimoPago: ventaData.fechaUltimoPago || '',
    fechaProximoPago: ventaData.fechaVencimientoProximaCuota || ventaData.fechaProximoPago || '', // ← CAMBIADO
    diaVencimiento: ventaData.diaVencimiento?.toString() || '' // ← AGREGADO
  } : {
    clienteId: '',
    loteId: '',
    montoTotal: '',
    estado: 'pendiente', // ← Cambiado a minúscula
    tipoPago: 'Contado',
    cantidadCuotas: '',
    montoCuota: '',
    cuotasPagadas: '0',
    fechaInicio: '', // ← CAMBIADO
    tasaInteresMoratorio: '',
    multaMoraDiaria: '',
    comprobante: '',
    observaciones: '',
    fechaUltimoPago: '',
    fechaProximoPago: '', // ← CAMBIADO
    diaVencimiento: '' // ← AGREGADO
  });

  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const [errors, setErrors] = useState({});
  const [mostrarCamposAvanzados, setMostrarCamposAvanzados] = useState(false);

  // Estados disponibles - corregidos a minúscula
  const estadosVenta = [
    { value: 'pendiente', label: 'Pendiente', icon: Clock, color: 'blue' },
    { value: 'pagado', label: 'Pagado', icon: CheckCircle, color: 'green' },
    { value: 'cancelado', label: 'Cancelado', icon: XCircle, color: 'red' }
  ];

  // Cargar lote seleccionado si estamos editando
  useEffect(() => {
    if (ventaData && ventaData.loteId) {
      const lote = lotes.find(l => l.id === parseInt(ventaData.loteId));
      setLoteSeleccionado(lote);
    }
  }, [ventaData, lotes]);

  // Auto-mostrar campos avanzados si hay datos
  useEffect(() => {
    if (ventaData && (
      ventaData.tasaInteresMoratorio || 
      ventaData.multaMoraDiaria || 
      ventaData.comprobante || 
      ventaData.observaciones
    )) {
      setMostrarCamposAvanzados(true);
    }
  }, [ventaData]);

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
    
    // Auto-llenar montoTotal si no está especificado manualmente
    if (lote && !formData.montoTotal) {
      setFormData(prev => ({ ...prev, montoTotal: lote.precioTotal.toString() }));
    }
    
    // Recalcular monto por cuota si hay cantidad de cuotas
    if (lote && formData.cantidadCuotas && formData.montoTotal) {
      const montoCuota = Math.round(parseFloat(formData.montoTotal) / parseInt(formData.cantidadCuotas));
      setFormData(prev => ({ ...prev, montoCuota: montoCuota.toString() }));
    }
  };

  const handleMontoTotalChange = (e) => {
    const montoTotal = e.target.value;
    setFormData(prev => ({ ...prev, montoTotal }));
    
    // Recalcular monto por cuota si hay cantidad de cuotas
    if (montoTotal && formData.cantidadCuotas) {
      const montoCuota = Math.round(parseFloat(montoTotal) / parseInt(formData.cantidadCuotas));
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
      fechaInicio: tipoPago === 'Contado' ? '' : prev.fechaInicio, // ← CAMBIADO
      tasaInteresMoratorio: tipoPago === 'Contado' ? '' : prev.tasaInteresMoratorio,
      multaMoraDiaria: tipoPago === 'Contado' ? '' : prev.multaMoraDiaria,
      fechaProximoPago: tipoPago === 'Contado' ? '' : prev.fechaProximoPago, // ← CAMBIADO
      diaVencimiento: tipoPago === 'Contado' ? '' : prev.diaVencimiento // ← AGREGADO
    }));
  };

  const handleCuotasChange = (e) => {
    const cantidadCuotas = e.target.value;
    setFormData(prev => ({ ...prev, cantidadCuotas }));
    
    // Recalcular monto por cuota basado en el monto total
    if (formData.montoTotal && cantidadCuotas) {
      const montoCuota = Math.round(parseFloat(formData.montoTotal) / parseInt(cantidadCuotas));
      setFormData(prev => ({ ...prev, montoCuota: montoCuota.toString() }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clienteId) {
      newErrors.clienteId = 'Debe seleccionar un cliente';
    }

    if (!formData.loteId) {
      newErrors.loteId = 'Debe seleccionar un lote';
    }

    if (!formData.montoTotal || parseFloat(formData.montoTotal) <= 0) {
      newErrors.montoTotal = 'Monto total debe ser mayor a 0';
    }

    if (!formData.estado) {
      newErrors.estado = 'Debe seleccionar un estado';
    }

    if (!formData.tipoPago) {
      newErrors.tipoPago = 'Debe seleccionar tipo de pago';
    }

    if (!formData.cuotasPagadas || parseInt(formData.cuotasPagadas) < 0) {
      newErrors.cuotasPagadas = 'Cuotas pagadas debe ser 0 o mayor';
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

      if (parseInt(formData.cuotasPagadas) > parseInt(formData.cantidadCuotas)) {
        newErrors.cuotasPagadas = 'Cuotas pagadas no puede ser mayor que cantidad de cuotas';
      }

      // Validar tasa de interés moratorio
      if (formData.tasaInteresMoratorio && parseFloat(formData.tasaInteresMoratorio) < 0) {
        newErrors.tasaInteresMoratorio = 'La tasa de interés no puede ser negativa';
      }

      if (formData.tasaInteresMoratorio && parseFloat(formData.tasaInteresMoratorio) > 100) {
        newErrors.tasaInteresMoratorio = 'La tasa de interés no puede ser mayor a 100%';
      }

      // Validar multa de mora
      if (formData.multaMoraDiaria && parseFloat(formData.multaMoraDiaria) < 0) {
        newErrors.multaMoraDiaria = 'La multa de mora no puede ser negativa';
      }

      // Validar día de vencimiento
      if (formData.diaVencimiento && (parseInt(formData.diaVencimiento) < 1 || parseInt(formData.diaVencimiento) > 31)) {
        newErrors.diaVencimiento = 'El día de vencimiento debe estar entre 1 y 31';
      }

      // Validar coherencia entre monto total y cuotas
      if (formData.cantidadCuotas && formData.montoCuota && formData.montoTotal) {
        const totalCalculado = parseInt(formData.cantidadCuotas) * parseFloat(formData.montoCuota);
        const diferencia = Math.abs(totalCalculado - parseFloat(formData.montoTotal));
        
        if (diferencia > parseFloat(formData.montoTotal) * 0.05) {
          newErrors.montoCuota = 'El total de cuotas no coincide con el monto total';
        }
      }
    } else {
      // Si es contado, cuotas pagadas debe ser 0 o 1
      if (parseInt(formData.cuotasPagadas) > 1) {
        newErrors.cuotasPagadas = 'Para pago al contado, cuotas pagadas debe ser 0 o 1';
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

    // Construir objeto base con nombres CORRECTOS
    const ventaDataToSubmit = {
      cliente_id: parseInt(formData.clienteId),
      lote_id: parseInt(formData.loteId),
      montoTotal: parseFloat(formData.montoTotal),
      estado: formData.estado,
      tipoPago: formData.tipoPago,
      cuotasPagadas: parseInt(formData.cuotasPagadas)
    };

    // Agregar campos opcionales solo si tienen valor
    if (formData.comprobante) {
      ventaDataToSubmit.comprobante = formData.comprobante;
    }

    if (formData.observaciones) {
      ventaDataToSubmit.observaciones = formData.observaciones;
    }

    if (formData.fechaUltimoPago) {
      ventaDataToSubmit.fechaUltimoPago = formData.fechaUltimoPago;
    }

    // Campos específicos de crédito
    if (formData.tipoPago === 'Credito') {
      ventaDataToSubmit.cantidadCuotas = parseInt(formData.cantidadCuotas);
      ventaDataToSubmit.montoCuota = parseFloat(formData.montoCuota);
      
      if (formData.fechaInicio) {
        ventaDataToSubmit.fechaInicio = formData.fechaInicio; // ← CAMBIADO
      }

      if (formData.tasaInteresMoratorio) {
        ventaDataToSubmit.tasaInteresMoratorio = parseFloat(formData.tasaInteresMoratorio);
      }

      if (formData.multaMoraDiaria) {
        ventaDataToSubmit.multaMoraDiaria = parseFloat(formData.multaMoraDiaria);
      }

      if (formData.fechaProximoPago) {
        ventaDataToSubmit.fechaProximoPago = formData.fechaProximoPago; // ← CAMBIADO
      }

      if (formData.diaVencimiento) {
        ventaDataToSubmit.diaVencimiento = parseInt(formData.diaVencimiento); // ← AGREGADO
      }
    }

    console.log('📤 DATOS FINALES PARA ENVIAR:', JSON.stringify(ventaDataToSubmit, null, 2));

    onSubmit(ventaDataToSubmit);
  };

  const clienteSeleccionado = clientes.find(c => c.id === parseInt(formData.clienteId));
  const estadoSeleccionado = estadosVenta.find(e => e.value === formData.estado);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
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
            
            {/* Sección Estado y Monto */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="mr-2 text-purple-600" size={24} />
                Estado y Monto de la Venta
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado de la Venta *
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.estado ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {estadosVenta.map(estado => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </select>
                  {errors.estado && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.estado}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto Total *
                  </label>
                  <input
                    type="number"
                    name="montoTotal"
                    value={formData.montoTotal}
                    onChange={handleMontoTotalChange}
                    min="0"
                    step="1000"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.montoTotal ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Monto en Gs."
                  />
                  {errors.montoTotal && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.montoTotal}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuotas Pagadas *
                  </label>
                  <input
                    type="number"
                    name="cuotasPagadas"
                    value={formData.cuotasPagadas}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.cuotasPagadas ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Número de cuotas pagadas"
                  />
                  {errors.cuotasPagadas && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.cuotasPagadas}
                    </p>
                  )}
                </div>

                {estadoSeleccionado && (
                  <div className="col-span-3 bg-white p-4 rounded-lg border">
                    <div className="flex items-center">
                      <estadoSeleccionado.icon 
                        className={`mr-2 text-${estadoSeleccionado.color}-600`} 
                        size={20} 
                      />
                      <span className={`font-medium text-${estadoSeleccionado.color}-600`}>
                        Estado: {estadoSeleccionado.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                    Lote *
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
                    {lotes.map(lote => (
                      <option key={lote.id} value={lote.id}>
                        {lote.fraccionamiento} - Manzana {lote.manzana} Lote {lote.lote} - {lote.precioTotal}
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
                      Precio Base: {loteSeleccionado.precioTotal}
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
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                    {/* Campos básicos de crédito */}
                    <div className="grid md:grid-cols-3 gap-4">
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
                          Fecha Inicio
                        </label>
                        <input
                          type="date"
                          name="fechaInicio"
                          value={formData.fechaInicio}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Campos de mora y penalidades */}
                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="col-span-3">
                        <div className="flex items-center mb-3">
                          <AlertTriangle className="text-orange-600 mr-2" size={20} />
                          <h3 className="font-medium text-gray-900">Penalidades por Mora</h3>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tasa Interés Moratorio (%)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="tasaInteresMoratorio"
                            value={formData.tasaInteresMoratorio}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            step="0.01"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                              errors.tasaInteresMoratorio ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ej: 2.5"
                          />
                          <Percent className="absolute right-3 top-3 text-gray-400" size={20} />
                        </div>
                        {errors.tasaInteresMoratorio && (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            {errors.tasaInteresMoratorio}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Interés mensual por mora
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Multa Mora Diaria (Gs.)
                        </label>
                        <input
                          type="number"
                          name="multaMoraDiaria"
                          value={formData.multaMoraDiaria}
                          onChange={handleInputChange}
                          min="0"
                          step="1000"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                            errors.multaMoraDiaria ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Ej: 5000"
                        />
                        {errors.multaMoraDiaria && (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            {errors.multaMoraDiaria}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Multa por día de retraso
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Día de Vencimiento
                        </label>
                        <input
                          type="number"
                          name="diaVencimiento"
                          value={formData.diaVencimiento}
                          onChange={handleInputChange}
                          min="1"
                          max="31"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                            errors.diaVencimiento ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Ej: 5 (día del mes)"
                        />
                        {errors.diaVencimiento && (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            {errors.diaVencimiento}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Día del mes para pagos
                        </p>
                      </div>
                    </div>

                    {/* Campos adicionales de crédito */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Próximo Pago
                        </label>
                        <input
                          type="date"
                          name="fechaProximoPago"
                          value={formData.fechaProximoPago}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Fecha del próximo vencimiento
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Último Pago
                        </label>
                        <input
                          type="date"
                          name="fechaUltimoPago"
                          value={formData.fechaUltimoPago}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Fecha del último pago recibido
                        </p>
                      </div>
                    </div>

                    {/* Resumen de crédito */}
                    {formData.cantidadCuotas && formData.montoCuota && formData.montoTotal && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-medium text-gray-900 mb-2">Resumen del Crédito</h4>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Total Cuotas:</span>
                            <p className="font-bold">
                              Gs. {(parseInt(formData.cantidadCuotas) * parseFloat(formData.montoCuota)).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Monto Total:</span>
                            <p className="font-bold">Gs. {parseFloat(formData.montoTotal).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Diferencia:</span>
                            <p className={`font-bold ${
                              Math.abs((parseInt(formData.cantidadCuotas) * parseFloat(formData.montoCuota)) - parseFloat(formData.montoTotal)) > parseFloat(formData.montoTotal) * 0.05 
                                ? 'text-red-600' 
                                : 'text-green-600'
                            }`}>
                              Gs. {(
                                (parseInt(formData.cantidadCuotas) * parseFloat(formData.montoCuota)) - parseFloat(formData.montoTotal)
                              ).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Progreso:</span>
                            <p className="font-bold text-blue-600">
                              {formData.cuotasPagadas}/{formData.cantidadCuotas} cuotas
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {formData.tipoPago === 'Contado' && formData.montoTotal && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Pago al Contado</h4>
                    <p className="text-2xl font-bold text-green-600">
                      Gs. {parseFloat(formData.montoTotal).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Pago único por la totalidad
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Campos Adicionales */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FileText className="mr-2 text-gray-600" size={24} />
                  Información Adicional
                </h2>
                <button
                  type="button"
                  onClick={() => setMostrarCamposAvanzados(!mostrarCamposAvanzados)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {mostrarCamposAvanzados ? 'Ocultar campos' : 'Mostrar más campos'}
                </button>
              </div>

              {mostrarCamposAvanzados && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Comprobante
                      </label>
                      <input
                        type="text"
                        name="comprobante"
                        value={formData.comprobante}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: COMP-2024-001"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Número de factura o recibo
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observaciones
                      </label>
                      <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Notas adicionales sobre esta venta..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Información adicional, acuerdos especiales, etc.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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