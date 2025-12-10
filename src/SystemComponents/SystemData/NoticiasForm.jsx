// src/components/SystemComponents/NoticiasForm.jsx
import { useState, useEffect } from 'react';
import { 
  X, Loader2, Image, Calendar, FileText, User, Tag
} from 'lucide-react';
import MediaUploader from '../MediaUploader';

const NoticiasForm = ({ 
  noticiaData = null,
  onSubmit,
  onCancel,
  isEditing = false,
  isLoading = false
}) => {
  const getInitialData = () => {
    if (noticiaData) {
      let fechaPublicacionFormatted = '';
      
      if (noticiaData.fecha_publicacion) {
        const fecha = new Date(noticiaData.fecha_publicacion);
        fechaPublicacionFormatted = fecha.toISOString().split('T')[0];
      }
      
      return {
        titulo: noticiaData.titulo || '',
        contenido: noticiaData.contenido || '',
        autor: noticiaData.autor || '',
        categoria: noticiaData.categoria || '',
        activo: noticiaData.activo !== undefined ? noticiaData.activo : true,
        fecha_publicacion: fechaPublicacionFormatted,
        url_imagen: noticiaData.url_imagen || ''
      };
    }
    
    return {
      titulo: '',
      contenido: '',
      autor: '',
      categoria: '',
      activo: true,
      fecha_publicacion: new Date().toISOString().split('T')[0],
      url_imagen: ''
    };
  };

  const [formData, setFormData] = useState(getInitialData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Categorías predefinidas (puedes modificar según tus necesidades)
  const categoriasPredefenidas = [
    'Tecnología',
    'Negocios',
    'Deportes',
    'Entretenimiento',
    'Salud',
    'Ciencia',
    'Política',
    'Cultura',
    'Educación',
    'Economía'
  ];

  // Reset form when noticiaData changes
  useEffect(() => {
    setFormData(getInitialData());
    setSelectedFile(null);
    setErrors({});
  }, [noticiaData]);

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
  };

  const handleRemoveExistingMedia = () => {
    setFormData(prev => ({
      ...prev,
      url_imagen: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) newErrors.titulo = 'El título es requerido';
    if (!formData.contenido.trim()) newErrors.contenido = 'El contenido es requerido';
    if (!formData.autor.trim()) newErrors.autor = 'El autor es requerido';
    if (!formData.categoria.trim()) newErrors.categoria = 'La categoría es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔍 VALIDANDO FORMULARIO DE NOTICIA:');
    console.log('📋 Datos del formulario:', formData);
    console.log('📁 Archivo seleccionado:', selectedFile);

    if (!validateForm()) {
      console.log('❌ Validación fallida, errores:', errors);
      return;
    }

    // Preparar datos para el backend
    const dataToSubmit = {
      titulo: formData.titulo.trim(),
      contenido: formData.contenido.trim(),
      autor: formData.autor.trim(),
      categoria: formData.categoria.trim(),
      activo: formData.activo,
      fecha_publicacion: formData.fecha_publicacion || null,
      url_imagen: formData.url_imagen
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

  const formTitle = isEditing ? 'Editar Noticia' : 'Nueva Noticia';
  const buttonText = isEditing ? 'Actualizar Noticia' : 'Crear Noticia';

  // Preparar existingMedia para el MediaUploader
  const existingMedia = formData.url_imagen ? {
    tipo_medio: 'imagen',
    url_medio: formData.url_imagen,
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
                  ? 'Modifique la información de la noticia' 
                  : 'Complete la información para crear nueva noticia'
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
                    placeholder="Ingrese el título de la noticia"
                  />
                  {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
                  <textarea
                    name="contenido"
                    value={formData.contenido}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.contenido ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Escriba el contenido completo de la noticia..."
                  />
                  {errors.contenido && <p className="mt-1 text-sm text-red-600">{errors.contenido}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="inline mr-1" size={14} />
                    Autor *
                  </label>
                  <input
                    type="text"
                    name="autor"
                    value={formData.autor}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.autor ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Nombre del autor"
                  />
                  {errors.autor && <p className="mt-1 text-sm text-red-600">{errors.autor}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Tag className="inline mr-1" size={14} />
                    Categoría *
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.categoria ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categoriasPredefenidas.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.categoria && <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="text-sm font-medium text-gray-700">Publicar noticia</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    La noticia será visible en el sitio web
                  </p>
                </div>
              </div>
            </div>

            {/* Fecha de Publicación */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="mr-2 text-green-600" size={20} />
                Fecha de Publicación
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Publicación
                  </label>
                  <input
                    type="date"
                    name="fecha_publicacion"
                    value={formData.fecha_publicacion}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Fecha en que se publicará la noticia
                  </p>
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Image className="mr-2 text-purple-600" size={20} />
                Imagen de la Noticia
              </h3>
              
              <MediaUploader
                onFileSelect={handleFileSelect}
                existingMedia={existingMedia}
                onRemoveExisting={handleRemoveExistingMedia}
                acceptedTypes="image/*"
              />
              
              <div className="mt-3 text-xs text-gray-500">
                <p>• Formatos soportados: JPG, PNG, GIF, WEBP</p>
                <p>• Tamaño recomendado: 1200x630 px para mejor visualización</p>
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

export default NoticiasForm;