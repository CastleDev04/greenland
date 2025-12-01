// src/components/SystemComponents/PromocionesForm.jsx
import { useState, useEffect } from 'react';
import { 
  X, Loader2, Image, Video, Calendar, FileText,
  Eye, EyeOff
} from 'lucide-react';
import MediaUploader from '../MediaUploader';

const PromocionesForm = ({ 
  promocionData = null,
  onSubmit,
  onCancel,
  isEditing = false,
  isLoading = false
}) => {
  const getInitialData = () => {
    if (promocionData) {
      let fechaInicioFormatted = '';
      let fechaFinFormatted = '';
      
      if (promocionData.fecha_inicio) {
        const fecha = new Date(promocionData.fecha_inicio);
        fechaInicioFormatted = fecha.toISOString().split('T')[0];
      }
      if (promocionData.fecha_fin) {
        const fecha = new Date(promocionData.fecha_fin);
        fechaFinFormatted = fecha.toISOString().split('T')[0];
      }
      
      return {
        titulo: promocionData.titulo || '',
        descripcion: promocionData.descripcion || '',
        activo: promocionData.activo !== undefined ? promocionData.activo : true,
        fecha_inicio: fechaInicioFormatted,
        fecha_fin: fechaFinFormatted,
        tipo_medio: promocionData.tipo_medio || 'imagen',
        url_medio: promocionData.url_medio || ''
      };
    }
    
    return {
      titulo: '',
      descripcion: '',
      activo: true,
      fecha_inicio: '',
      fecha_fin: '',
      tipo_medio: 'imagen',
      url_medio: ''
    };
  };

  const [formData, setFormData] = useState(getInitialData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Reset form when promocionData changes
  useEffect(() => {
    setFormData(getInitialData());
    setSelectedFile(null);
    setErrors({});
  }, [promocionData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    
    if (file) {
      // Actualizar tipo_medio automáticamente basado en el tipo de archivo
      const tipo_medio = file.type.startsWith('video/') ? 'video' : 'imagen';
      setFormData(prev => ({
        ...prev,
        tipo_medio: tipo_medio
      }));
    }
  };

  const handleRemoveExistingMedia = () => {
    setFormData(prev => ({
      ...prev,
      url_medio: '',
      tipo_medio: 'imagen'
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) newErrors.titulo = 'El título es requerido';
    
    if (formData.fecha_inicio && formData.fecha_fin) {
      const inicio = new Date(formData.fecha_inicio);
      const fin = new Date(formData.fecha_fin);
      if (fin < inicio) {
        newErrors.fecha_fin = 'La fecha fin no puede ser anterior a la fecha inicio';
      }
    }

    // Validar que haya un archivo o URL si es creación nueva
    if (!isEditing && !selectedFile && !formData.url_medio) {
      newErrors.media = 'Debe agregar una imagen o video';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔍 VALIDANDO FORMULARIO DE PUBLICIDAD:');
    console.log('📋 Datos del formulario:', formData);
    console.log('📁 Archivo seleccionado:', selectedFile);

    if (!validateForm()) {
      console.log('❌ Validación fallida, errores:', errors);
      return;
    }

    // Preparar datos para el backend
    const dataToSubmit = {
      titulo: formData.titulo.trim(),
      descripcion: formData.descripcion.trim() || null,
      activo: formData.activo,
      fecha_inicio: formData.fecha_inicio || null,
      fecha_fin: formData.fecha_fin || null,
      tipo_medio: formData.tipo_medio,
      url_medio: formData.url_medio // Se actualizará después de subir el archivo si hay uno nuevo
    };

    // Limpiar campos null/undefined
    Object.keys(dataToSubmit).forEach(key => {
      if (dataToSubmit[key] === null || dataToSubmit[key] === undefined) {
        delete dataToSubmit[key];
      }
    });

    console.log('📤 Datos a enviar al servidor:', dataToSubmit);

    await onSubmit(dataToSubmit, selectedFile);
  };

  const formTitle = isEditing ? 'Editar Publicidad' : 'Nueva Publicidad';
  const buttonText = isEditing ? 'Actualizar Publicidad' : 'Crear Publicidad';

  // Preparar existingMedia para el MediaUploader
  const existingMedia = formData.url_medio ? {
    tipo_medio: formData.tipo_medio,
    url_medio: formData.url_medio,
    titulo: formData.titulo
  } : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{formTitle}</h2>
              <p className="text-gray-600 mt-1">
                {isEditing 
                  ? 'Modifique la información de la publicidad' 
                  : 'Complete la información para crear nueva publicidad'
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="mr-2 text-blue-600" size={20} />
                Información Básica
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.titulo ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese el título de la publicidad"
                  />
                  {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Describa los detalles de la publicidad..."
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="text-sm font-medium text-gray-700">Activo</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    La publicidad se mostrará en el sitio web
                  </p>
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="mr-2 text-green-600" size={20} />
                Configuración de Fechas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.fecha_fin ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.fecha_fin && <p className="mt-1 text-sm text-red-600">{errors.fecha_fin}</p>}
                </div>
              </div>
            </div>

            {/* Media Uploader */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Image className="mr-2 text-purple-600" size={20} />
                Imagen o Video
              </h3>
              
              <MediaUploader
                onFileSelect={handleFileSelect}
                existingMedia={existingMedia}
                onRemoveExisting={handleRemoveExistingMedia}
              />
              
              {errors.media && (
                <p className="mt-2 text-sm text-red-600">{errors.media}</p>
              )}
              
              <div className="mt-3 text-xs text-gray-500">
                <p>• Formatos soportados: JPG, PNG, GIF, MP4, MOV, AVI</p>
                <p>• Solo se permite un archivo por publicidad</p>
                <p>• Puedes arrastrar un archivo o hacer clic para seleccionar</p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromocionesForm;