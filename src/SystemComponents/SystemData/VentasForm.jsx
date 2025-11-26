import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  AlertCircle, DollarSign, Calendar, User, MapPin, CreditCard, 
  X, CheckCircle, Clock, XCircle, FileText, Percent, AlertTriangle 
} from 'lucide-react';

// Mover constantes fuera del componente
const ESTADOS_VENTA = [
  { value: 'pendiente', label: 'Pendiente', icon: Clock, color: 'blue' },
  { value: 'pagado', label: 'Pagado', icon: CheckCircle, color: 'green' },
  { value: 'cancelado', label: 'Cancelado', icon: XCircle, color: 'red' }
];

const VentasForm = ({ onSubmit, onCancel, clientes = [], lotes = [], loading = false, ventaData = null }) => {
  // Estado inicial memoizado
  const initialState = useMemo(() => ({
    cliente_id: '',
    lote_id: '',
    montoTotal: '',
    estado: 'pendiente',
    tipoPago: 'Contado',
    cantidadCuotas: '',
    montoCuota: '',
    fechaInicio: '',
    tasaInteresMoratorio: '',
    multaMoraDiaria: '',
    comprobante: '',
    observaciones: '',
    diaVencimiento: ''
  }), []);

  const [formData, setFormData] = useState(initialState);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const [errors, setErrors] = useState({});
  const [mostrarCamposAvanzados, setMostrarCamposAvanzados] = useState(false);

  // Inicializar formData cuando ventaData cambia
  useEffect(() => {
    if (ventaData) {
      setFormData({
        cliente_id: ventaData.cliente_id?.toString() || ventaData.clienteId?.toString() || '',
        lote_id: ventaData.lote_id?.toString() || ventaData.loteId?.toString() || '',
        montoTotal: ventaData.montoTotal?.toString() || '',
        estado: ventaData.estado || 'pendiente',
        tipoPago: ventaData.tipoPago || 'Contado',
        cantidadCuotas: ventaData.cantidadCuotas?.toString() || '',
        montoCuota: ventaData.montoCuota?.toString() || '',
        fechaInicio: ventaData.fechaInicio || '',
        tasaInteresMoratorio: ventaData.tasaInteresMoratorio?.toString() || '',
        multaMoraDiaria: ventaData.multaMoraDiaria?.toString() || '',
        comprobante: ventaData.comprobante || '',
        observaciones: ventaData.observaciones || '',
        diaVencimiento: ventaData.diaVencimiento?.toString() || ''
      });
    }
  }, [ventaData]);

  // Cargar lote seleccionado
  useEffect(() => {
    if (formData.lote_id) {
      const lote = lotes.find(l => l.id === parseInt(formData.lote_id));
      setLoteSeleccionado(lote || null);
    }
  }, [formData.lote_id, lotes]);

  // Auto-mostrar campos avanzados
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

  // Handlers optimizados
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  const handleInputChange = useCallback((e) => {
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
  }, [errors]);

  const handleLoteChange = useCallback((e) => {
    const lote_id = e.target.value;
    setFormData(prev => {
      const lote = lotes.find(l => l.id === parseInt(lote_id));
      const newData = { ...prev, lote_id };
      
      if (lote && !prev.montoTotal) {
        newData.montoTotal = lote.precioTotal?.toString() || '';
      }
      
      if (lote && prev.cantidadCuotas && newData.montoTotal) {
        const montoCuota = Math.round(parseFloat(newData.montoTotal) / parseInt(prev.cantidadCuotas));
        newData.montoCuota = montoCuota.toString();
      }
      
      return newData;
    });
    
    const lote = lotes.find(l => l.id === parseInt(lote_id));
    setLoteSeleccionado(lote);
  }, [lotes]);

  const handleMontoTotalChange = useCallback((e) => {
    const montoTotal = e.target.value;
    setFormData(prev => {
      const newData = { ...prev, montoTotal };
      
      if (montoTotal && prev.cantidadCuotas) {
        const montoCuota = Math.round(parseFloat(montoTotal) / parseInt(prev.cantidadCuotas));
        newData.montoCuota = montoCuota.toString();
      }
      
      return newData;
    });
  }, []);

  const handleTipoPagoChange = useCallback((e) => {
    const tipoPago = e.target.value;
    setFormData(prev => ({
      ...prev,
      tipoPago,
      cantidadCuotas: tipoPago === 'Contado' ? '' : prev.cantidadCuotas,
      montoCuota: tipoPago === 'Contado' ? '' : prev.montoCuota,
      fechaInicio: tipoPago === 'Contado' ? '' : prev.fechaInicio,
      tasaInteresMoratorio: tipoPago === 'Contado' ? '' : prev.tasaInteresMoratorio,
      multaMoraDiaria: tipoPago === 'Contado' ? '' : prev.multaMoraDiaria,
      diaVencimiento: tipoPago === 'Contado' ? '' : prev.diaVencimiento
    }));
  }, []);

  const handleCuotasChange = useCallback((e) => {
    const cantidadCuotas = e.target.value;
    setFormData(prev => {
      const newData = { ...prev, cantidadCuotas };
      
      if (prev.montoTotal && cantidadCuotas) {
        const montoCuota = Math.round(parseFloat(prev.montoTotal) / parseInt(cantidadCuotas));
        newData.montoCuota = montoCuota.toString();
      }
      
      return newData;
    });
  }, []);

  // 🔥 CORRECCIÓN: Validación sin restricción de fecha pasada
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validaciones básicas
    if (!formData.cliente_id) newErrors.cliente_id = 'Debe seleccionar un cliente';
    if (!formData.lote_id) newErrors.lote_id = 'Debe seleccionar un lote';
    if (!formData.montoTotal || parseFloat(formData.montoTotal) <= 0) {
      newErrors.montoTotal = 'Monto total debe ser mayor a 0';
    }

    // Validaciones específicas de crédito
    if (formData.tipoPago === 'Credito') {
      if (!formData.cantidadCuotas || parseInt(formData.cantidadCuotas) < 1) {
        newErrors.cantidadCuotas = 'Cantidad de cuotas debe ser mayor a 0';
      } else if (parseInt(formData.cantidadCuotas) > 120) {
        newErrors.cantidadCuotas = 'Máximo 120 cuotas permitidas';
      }

      if (!formData.montoCuota || parseFloat(formData.montoCuota) <= 0) {
        newErrors.montoCuota = 'Monto de cuota debe ser mayor a 0';
      }

      if (!formData.fechaInicio) {
        newErrors.fechaInicio = 'La fecha de inicio es requerida para crédito';
      }

      const tasaInteres = parseFloat(formData.tasaInteresMoratorio || 0);
      if (tasaInteres < 0) newErrors.tasaInteresMoratorio = 'La tasa de interés no puede ser negativa';
      if (tasaInteres > 100) newErrors.tasaInteresMoratorio = 'La tasa de interés no puede ser mayor a 100%';

      const multaMora = parseFloat(formData.multaMoraDiaria || 0);
      if (multaMora < 0) newErrors.multaMoraDiaria = 'La multa de mora no puede ser negativa';

      const diaVencimiento = parseInt(formData.diaVencimiento || 0);
      if (diaVencimiento && (diaVencimiento < 1 || diaVencimiento > 31)) {
        newErrors.diaVencimiento = 'El día de vencimiento debe estar entre 1 y 31';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // 🔥 CORRECCIÓN: Handler de submit con estructura correcta
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Construir objeto de datos optimizado
    const ventaDataToSubmit = {
      cliente_id: parseInt(formData.cliente_id),
      lote_id: parseInt(formData.lote_id),
      montoTotal: parseFloat(formData.montoTotal),
      estado: formData.estado,
      tipoPago: formData.tipoPago,
      compradorId: parseInt(formData.cliente_id) // 🔥 AGREGADO: compradorId
    };

    // Agregar campos opcionales solo si tienen valor
    if (formData.comprobante) ventaDataToSubmit.comprobante = formData.comprobante;
    if (formData.observaciones) ventaDataToSubmit.observaciones = formData.observaciones;

    // Campos específicos de crédito
    if (formData.tipoPago === 'Credito') {
      ventaDataToSubmit.cantidadCuotas = parseInt(formData.cantidadCuotas);
      ventaDataToSubmit.montoCuota = parseFloat(formData.montoCuota);
      ventaDataToSubmit.fechaInicio = formData.fechaInicio;

      if (formData.tasaInteresMoratorio) {
        ventaDataToSubmit.tasaInteresMoratorio = parseFloat(formData.tasaInteresMoratorio);
      }
      if (formData.multaMoraDiaria) {
        ventaDataToSubmit.multaMoraDiaria = parseFloat(formData.multaMoraDiaria);
      }
      if (formData.diaVencimiento) {
        ventaDataToSubmit.diaVencimiento = parseInt(formData.diaVencimiento);
      }
    }

    console.log('📤 Datos de venta a enviar:', ventaDataToSubmit);
    onSubmit(ventaDataToSubmit);
  }, [formData, validateForm, onSubmit]);

  // Renderizado del formulario
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
              
              <div className="grid md:grid-cols-2 gap-4">
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
                    {ESTADOS_VENTA.map(estado => (
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
                    name="cliente_id"
                    value={formData.cliente_id}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.cliente_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.apellido} - CI: {cliente.cedula}
                      </option>
                    ))}
                  </select>
                  {errors.cliente_id && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.cliente_id}
                    </p>
                  )}
                </div>

                {formData.cliente_id && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-900 mb-2">Cliente Seleccionado</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Nombre:</strong> {clientes.find(c => c.id === parseInt(formData.cliente_id))?.nombre} {clientes.find(c => c.id === parseInt(formData.cliente_id))?.apellido}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>CI:</strong> {clientes.find(c => c.id === parseInt(formData.cliente_id))?.cedula}
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
                    name="lote_id"
                    value={formData.lote_id}
                    onChange={handleLoteChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.lote_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar lote...</option>
                    {lotes.map(lote => (
                      <option key={lote.id} value={lote.id}>
                        {lote.fraccionamiento} - Manzana {lote.manzana} Lote {lote.lote} - {lote.precioTotal}
                      </option>
                    ))}
                  </select>
                  {errors.lote_id && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.lote_id}
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
                </div>

                {formData.tipoPago === 'Credito' && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
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
                          Fecha Inicio *
                        </label>
                        <input
                          type="date"
                          name="fechaInicio"
                          value={formData.fechaInicio}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.fechaInicio ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.fechaInicio && (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            {errors.fechaInicio}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
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
                          placeholder="Ej: 5"
                        />
                        {errors.diaVencimiento && (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            {errors.diaVencimiento}
                          </p>
                        )}
                      </div>
                    </div>
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