// src/components/SystemComponents/MediaUploader.jsx
import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image, Video, File, Trash2 } from 'lucide-react';

const MediaUploader = ({ 
  onFileSelect, 
  existingMedia = null,
  onRemoveExisting
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (files.length > 0) {
      // Tomar solo el primer archivo
      const file = files[0];
      setNewFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e.target.files).filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (files.length > 0) {
      // Tomar solo el primer archivo
      const file = files[0];
      setNewFile(file);
      onFileSelect(file);
    }
    e.target.value = ''; // Reset input
  }, [onFileSelect]);

  const removeNewFile = () => {
    setNewFile(null);
    onFileSelect(null);
  };

  const removeExistingMedia = () => {
    if (onRemoveExisting) {
      onRemoveExisting();
    }
  };

  const getFileIcon = (tipo) => {
    switch (tipo) {
      case 'imagen': return <Image size={20} className="text-blue-500" />;
      case 'video': return <Video size={20} className="text-green-500" />;
      default: return <File size={20} className="text-gray-500" />;
    }
  };

  const getFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Área de Dropzone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center">
          <Upload size={48} className="mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Arrastra un archivo aquí o haz clic para seleccionar
          </p>
          <p className="text-sm text-gray-500">
            Soporta: Una imagen (JPG, PNG, GIF) o un video (MP4, MOV, AVI)
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Solo se permite un archivo por publicidad
          </p>
        </div>
      </div>

      {/* Archivo nuevo a subir */}
      {newFile && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
            <Upload size={16} className="mr-2" />
            Archivo nuevo a subir
          </h4>
          <div className="bg-white rounded-lg border border-blue-200 p-4">
            <div className="flex items-start space-x-4">
              {/* Preview */}
              <div className="flex-shrink-0">
                {newFile.type.startsWith('image/') ? (
                  <img
                    src={getFilePreview(newFile)}
                    alt={newFile.name}
                    className="w-20 h-20 object-cover rounded border"
                    onLoad={() => URL.revokeObjectURL(getFilePreview(newFile))}
                  />
                ) : (
                  <div className="w-20 h-20 bg-green-100 rounded border border-green-200 flex items-center justify-center">
                    <Video size={32} className="text-green-600" />
                  </div>
                )}
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {newFile.name}
                </p>
                <div className="text-xs text-gray-500 space-y-1 mt-2">
                  <div className="flex items-center">
                    {newFile.type.startsWith('video/') ? 
                      <Video size={12} className="mr-1 text-green-500" /> : 
                      <Image size={12} className="mr-1 text-blue-500" />
                    }
                    Tipo: {newFile.type.startsWith('video/') ? 'Video' : 'Imagen'}
                  </div>
                  <div>Tamaño: {formatFileSize(newFile.size)}</div>
                  <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                    newFile.type.startsWith('video/') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {newFile.type.startsWith('video/') ? 'media/videos_promos' : 'media/imagenes_promos'}
                  </div>
                </div>
              </div>
              
              {/* Remove Button */}
              <button
                onClick={removeNewFile}
                className="flex-shrink-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                title="Remover archivo"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media existente */}
      {existingMedia && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <File size={16} className="mr-2" />
            Archivo existente
          </h4>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start space-x-4">
              {/* Preview */}
              <div className="flex-shrink-0">
                {existingMedia.tipo_medio === 'imagen' ? (
                  <img
                    src={existingMedia.url_medio}
                    alt={existingMedia.titulo}
                    className="w-20 h-20 object-cover rounded border"
                  />
                ) : (
                  <div className="w-20 h-20 bg-green-100 rounded border border-green-200 flex items-center justify-center">
                    <Video size={32} className="text-green-600" />
                  </div>
                )}
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {existingMedia.titulo}
                </p>
                <div className="text-xs text-gray-500 space-y-1 mt-2">
                  <div className="flex items-center">
                    {getFileIcon(existingMedia.tipo_medio)}
                    <span className="ml-1">Tipo: {existingMedia.tipo_medio}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                    existingMedia.tipo_medio === 'video' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {existingMedia.tipo_medio === 'video' ? 'media/videos_promos' : 'media/imagenes_promos'}
                  </div>
                </div>
              </div>
              
              {/* Remove Button */}
              {onRemoveExisting && (
                <button
                  onClick={removeExistingMedia}
                  className="flex-shrink-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  title="Eliminar archivo"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!newFile && !existingMedia && (
        <div className="text-center py-8 text-gray-500">
          <Image size={48} className="mx-auto mb-2 opacity-50" />
          <p>No hay archivo seleccionado</p>
          <p className="text-sm">Agrega una imagen o video para esta publicidad</p>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;