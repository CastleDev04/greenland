// components/UsuariosForm.jsx
import { useState } from 'react';
import { 
  User, Mail, Lock, Shield, X, Loader2, Eye, EyeOff
} from 'lucide-react';

export default function UsuariosForm({ 
  usuarioData = null,
  onSubmit,
  onCancel,
  isEditing = false,
  isLoading = false,
  title = null
}) {
  const getInitialData = () => {
    if (usuarioData) {
      return {
        nombre: usuarioData.nombre || '',
        email: usuarioData.email || '',
        rol: usuarioData.rol || 'USUARIO',
        password: '',
        password_confirmation: ''
      };
    }
    
    return {
      nombre: '',
      email: '',
      rol: 'USUARIO',
      password: '',
      password_confirmation: ''
    };
  };

  const [formData, setFormData] = useState(getInitialData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const roles = [
    { value: 'ADMIN', label: 'Administrador', description: 'Acceso total al sistema' },
    { value: 'VENDEDOR', label: 'Vendedor', description: 'Gestión de ventas y clientes' },
    { value: 'COBRANZA', label: 'Cobranza', description: 'Gestión de pagos y cobranzas' },
    { value: 'MODERADOR', label: 'Moderador', description: 'Supervisión y reportes' },
    { value: 'USUARIO', label: 'Usuario', description: 'Acceso básico al sistema' },
    { value: 'CLIENTE', label: 'Cliente', description: 'Acceso limitado para clientes' }
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

    // Validaciones básicas
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.rol) newErrors.rol = 'Debe seleccionar un rol';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    // Password validation (solo si no está editando o si está cambiando la contraseña)
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }

      if (!formData.password_confirmation) {
        newErrors.password_confirmation = 'Debe confirmar la contraseña';
      } else if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Las contraseñas no coinciden';
      }
    } else {
      // Si está editando y hay contraseña, validar
      if (formData.password) {
        if (formData.password.length < 8) {
          newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }
        if (formData.password !== formData.password_confirmation) {
          newErrors.password_confirmation = 'Las contraseñas no coinciden';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const dataToSubmit = {
      nombre: formData.nombre.trim(),
      email: formData.email.trim().toLowerCase(),
      rol: formData.rol,
    };

    // Solo incluir password si hay uno (para crear o actualizar)
    if (formData.password) {
      dataToSubmit.password = formData.password;
      dataToSubmit.password_confirmation = formData.password_confirmation;
    }

    await onSubmit(dataToSubmit);
  };

  const formTitle = title || (isEditing ? 'Editar Usuario' : 'Crear Usuario');
  const buttonText = isEditing ? 'Actualizar Usuario' : 'Crear Usuario';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{formTitle}</h2>
              <p className="text-gray-600 mt-1">
                {isEditing 
                  ? 'Modifique la información del usuario' 
                  : 'Complete la información del nuevo usuario'
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
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese el nombre completo"
                  />
                  {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="inline mr-1" size={14} />
                    Email *
                  </label>
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
              </div>
            </div>

            {/* Rol y Permisos */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="mr-2 text-purple-600" size={20} />
                Rol y Permisos
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccione el rol *
                </label>
                <div className="space-y-2">
                  {roles.map((rol) => (
                    <label
                      key={rol.value}
                      className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.rol === rol.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="radio"
                        name="rol"
                        value={rol.value}
                        checked={formData.rol === rol.value}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="mt-1 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {rol.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rol.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.rol && <p className="mt-1 text-sm text-red-600">{errors.rol}</p>}
              </div>
            </div>

            {/* Seguridad */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Lock className="mr-2 text-green-600" size={20} />
                Seguridad
              </h3>
              
              {isEditing && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Nota:</strong> Deje los campos de contraseña vacíos si no desea cambiarla.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña {!isEditing && '*'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed pr-10 ${
                        errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder={isEditing ? 'Dejar vacío para mantener la actual' : 'Mínimo 8 caracteres'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Contraseña {!isEditing && '*'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed pr-10 ${
                        errors.password_confirmation ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Repita la contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswordConfirmation ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
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
}