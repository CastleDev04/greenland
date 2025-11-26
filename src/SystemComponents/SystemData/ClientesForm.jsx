import { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, FileText, Building, Globe,
  X, Loader2  // Agregar estos
} from 'lucide-react';


export default function ClientesForm({ 
  clienteData = null,
  onSubmit,
  onCancel,
  isEditing = false,
  isLoading = false,
  title = null
}) {
  const getInitialData = () => {
  if (clienteData) {
    // Convertir fecha ISO a formato YYYY-MM-DD para el input date
    let fechaNacimientoFormatted = '';
    if (clienteData.fechaNacimiento) {
      const fecha = new Date(clienteData.fechaNacimiento);
      fechaNacimientoFormatted = fecha.toISOString().split('T')[0];
    }
    
    return {
      nombre: clienteData.nombre || '',
      apellido: clienteData.apellido || '',
      cedula: clienteData.cedula || '',
      ruc: clienteData.ruc || '',
      estadoCivil: clienteData.estadoCivil || '',
      profesion: clienteData.profesion || '',
      nacionalidad: clienteData.nacionalidad || '',
      fechaNacimiento: fechaNacimientoFormatted,
      email: clienteData.email || '',
      telefono: clienteData.telefono || '',
      direccion: clienteData.direccion || ''
    };
  }
  
  return {
    nombre: '',
    apellido: '',
    cedula: '',
    ruc: '',
    estadoCivil: '',
    profesion: '',
    nacionalidad: '',
    fechaNacimiento: '',
    email: '',
    telefono: '',
    direccion: ''
  };
};

  const [formData, setFormData] = useState(getInitialData);
  const [errors, setErrors] = useState({});

  const estadosCiviles = [
    'Soltero/a',
    'Casado/a',
    'Divorciado/a',
    'Viudo/a',
    'Unión de hecho'
  ];

  const nacionalidades = [
    'Paraguaya',
    'Argentina',
    'Brasileña',
    'Boliviana',
    'Uruguaya',
    'Chilena',
    'Peruana',
    'Colombiana',
    'Venezolana',
    'Ecuatoriana',
    'Otra'
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

  // Validaciones básicas de campos obligatorios
  if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
  if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
  if (!formData.cedula.trim()) newErrors.cedula = 'La cédula es requerida';
  if (!formData.email.trim()) newErrors.email = 'El email es requerido';

  // Email validation (menos estricto)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email)) {
    newErrors.email = 'Formato de email inválido';
  }

  // Cédula validation (MUCHO MÁS FLEXIBLE)
  if (formData.cedula && formData.cedula.trim().length < 3) {
    newErrors.cedula = 'La cédula debe tener al menos 3 caracteres';
  }

  // RUC validation (opcional, más flexible)
  if (formData.ruc && formData.ruc.trim().length < 3) {
    newErrors.ruc = 'El RUC debe tener al menos 3 caracteres';
  }

  // Teléfono validation (opcional, más flexible)
  if (formData.telefono && formData.telefono.replace(/\D/g, '').length < 6) {
    newErrors.telefono = 'El teléfono debe tener al menos 6 dígitos';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// AGREGA ESTA FUNCIÓN PARA DEBUGGEAR
// REEMPLAZA la función handleSubmit en tu ClientesForm.jsx
const handleSubmit = async () => {
  console.log('🔍 VALIDANDO FORMULARIO:');
  console.log('📋 Datos del formulario:', formData);
  console.log('✅ Campos obligatorios llenos:', {
    nombre: !!formData.nombre.trim(),
    apellido: !!formData.apellido.trim(),
    cedula: !!formData.cedula.trim(),
    email: !!formData.email.trim()
  });

  if (!validateForm()) {
    console.log('❌ Validación fallida, errores:', errors);
    return;
  }

  // FORMATO CORREGIDO para coincidir con el ejemplo
  const dataToSubmit = {
    nombre: formData.nombre.trim(),
    apellido: formData.apellido.trim(),
    cedula: formData.cedula.trim(),
    // Campos opcionales - convertir vacíos a null/undefined
    ruc: formData.ruc.trim() || undefined,
    estadoCivil: formData.estadoCivil.trim() || undefined,
    profesion: formData.profesion.trim() || undefined,
    nacionalidad: formData.nacionalidad.trim() || undefined,
    // Fecha en formato correcto (con timezone)
    fechaNacimiento: formData.fechaNacimiento ? 
      new Date(formData.fechaNacimiento).toISOString() : undefined,
    email: formData.email.trim(),
    telefono: formData.telefono.trim() || undefined,
    direccion: formData.direccion.trim() || undefined
  };

  // Limpiar campos undefined para que no se envíen
  Object.keys(dataToSubmit).forEach(key => {
    if (dataToSubmit[key] === undefined) {
      delete dataToSubmit[key];
    }
  });

  console.log('📤 Datos a enviar al servidor (formato corregido):', dataToSubmit);
  console.log('📤 JSON stringificado:', JSON.stringify(dataToSubmit, null, 2));

  await onSubmit(dataToSubmit);
};
  

  const formTitle = title || (isEditing ? 'Editar Cliente' : 'Registro de Cliente');
  const buttonText = isEditing ? 'Actualizar Cliente' : 'Registrar Cliente';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{formTitle}</h2>
              <p className="text-gray-600 mt-1">
                {isEditing 
                  ? 'Modifique la información del cliente' 
                  : 'Complete la información del cliente para la compra de lote'
                }
              </p>
            </div>
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Información Personal */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="mr-2 text-blue-600" size={20} />
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese el nombre"
                  />
                  {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.apellido ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese el apellido"
                  />
                  {errors.apellido && <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cédula *</label>
                  <input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.cedula ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="ej: 1.234.567"
                  />
                  {errors.cedula && <p className="mt-1 text-sm text-red-600">{errors.cedula}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RUC (Opcional)</label>
                  <input
                    type="text"
                    name="ruc"
                    value={formData.ruc}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.ruc ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="ej: 1.234.567-8"
                  />
                  {errors.ruc && <p className="mt-1 text-sm text-red-600">{errors.ruc}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
                  <select
                    name="estadoCivil"
                    value={formData.estadoCivil}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Seleccione estado civil</option>
                    {estadosCiviles.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline mr-1" size={14} />
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Información Profesional */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Building className="mr-2 text-green-600" size={20} />
                Información Profesional
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profesión</label>
                  <input
                    type="text"
                    name="profesion"
                    value={formData.profesion}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Ingrese la profesión"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Globe className="inline mr-1" size={14} />
                    Nacionalidad
                  </label>
                  <select
                    name="nacionalidad"
                    value={formData.nacionalidad}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Seleccione nacionalidad</option>
                    {nacionalidades.map((nacionalidad) => (
                      <option key={nacionalidad} value={nacionalidad}>{nacionalidad}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Mail className="mr-2 text-purple-600" size={20} />
                Información de Contacto
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="ejemplo@email.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="inline mr-1" size={14} />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.telefono ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="ej: +595 21 123456"
                  />
                  {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="inline mr-1" size={14} />
                    Dirección
                  </label>
                  <textarea
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Ingrese la dirección completa"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
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
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
