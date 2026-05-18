// components/SystemData/FraccionamientoForm.jsx
import { useState } from 'react';
import { 
  Building, MapPin, Home, DollarSign, FileText, X, Loader2
} from 'lucide-react';

export default function FraccionamientoForm({ 
  fraccionamientoData = null,
  onSubmit,
  onCancel,
  isEditing = false,
  isLoading = false,
  title = null
}) {
  const getInitialData = () => {
    if (fraccionamientoData) {
      return {
        nombre: fraccionamientoData.nombre || '',
        ubicacion: fraccionamientoData.ubicacion || '',
        cantidad_lotes: fraccionamientoData.cantidad_lotes || '',
        precio_venta: fraccionamientoData.precio_venta || '',
        descripcion: fraccionamientoData.descripcion || '',
        estado: fraccionamientoData.estado || 'Activo'
      };
    }
    
    return {
      nombre: '',
      ubicacion: '',
      cantidad_lotes: '',
      precio_venta: '',
      descripcion: '',
      estado: 'Activo'
    };
  };

  const [formData, setFormData] = useState(getInitialData);
  const [errors, setErrors] = useState({});

  const estados = [
    'Activo',
    'En desarrollo',
    'Finalizado',
    'Cancelado'
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

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.ubicacion.trim()) newErrors.ubicacion = 'La ubicación es requerida';
    
    if (formData.cantidad_lotes && formData.cantidad_lotes <= 0) {
      newErrors.cantidad_lotes = 'La cantidad debe ser mayor a 0';
    }
    
    if (formData.precio_venta && formData.precio_venta <= 0) {
      newErrors.precio_venta = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log('❌ Validación fallida:', errors);
      return;
    }

    const dataToSubmit = {
      nombre: formData.nombre.trim(),
      ubicacion: formData.ubicacion.trim(),
      cantidad_lotes: formData.cantidad_lotes ? parseInt(formData.cantidad_lotes) : 0,
      precio_venta: formData.precio_venta ? parseFloat(formData.precio_venta) : 0,
      descripcion: formData.descripcion.trim() || undefined,
      estado: formData.estado
    };

    // Limpiar campos undefined
    Object.keys(dataToSubmit).forEach(key => {
      if (dataToSubmit[key] === undefined) {
        delete dataToSubmit[key];
      }
    });

    console.log('📤 Datos a enviar:', dataToSubmit);
    await onSubmit(dataToSubmit);
  };

  const formTitle = title || (isEditing ? 'Editar Fraccionamiento' : 'Registro de Fraccionamiento');
  const buttonText = isEditing ? 'Actualizar Fraccionamiento' : 'Registrar Fraccionamiento';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{formTitle}</h2>
              <p className="text-gray-600 mt-1">
                {isEditing 
                  ? 'Modifique la información del fraccionamiento' 
                  : 'Complete la información del nuevo fraccionamiento'
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
            {/* Información Básica */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Building className="mr-2 text-blue-600" size={20} />
                Información Básica
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Fraccionamiento *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 ${
                      errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Parque del Este"
                  />
                  {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="inline mr-1" size={14} />
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 ${
                      errors.ubicacion ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Dirección completa"
                  />
                  {errors.ubicacion && <p className="mt-1 text-sm text-red-600">{errors.ubicacion}</p>}
                </div>

                
              </div>
            </div>

            {/* Información de Lotes */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Home className="mr-2 text-green-600" size={20} />
                Información de Lotes
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad de Lotes
                  </label>
                  <input
                    type="number"
                    name="cantidad_lotes"
                    value={formData.cantidad_lotes}
                    onChange={handleChange}
                    disabled={isLoading}
                    min="0"
                    step="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 ${
                      errors.cantidad_lotes ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.cantidad_lotes && <p className="mt-1 text-sm text-red-600">{errors.cantidad_lotes}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <DollarSign className="inline mr-1" size={14} />
                    Precio por Lote (Gs.)
                  </label>
                  <input
                    type="number"
                    name="precio_venta"
                    value={formData.precio_venta}
                    onChange={handleChange}
                    disabled={isLoading}
                    min="0"
                    step="100000"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 ${
                      errors.precio_venta ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.precio_venta && <p className="mt-1 text-sm text-red-600">{errors.precio_venta}</p>}
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="mr-2 text-purple-600" size={20} />
                Descripción
              </h3>
              
              <div>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none disabled:bg-gray-100"
                  placeholder="Descripción adicional del fraccionamiento..."
                />
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
}