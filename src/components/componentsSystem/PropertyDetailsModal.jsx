
import { Eye, Edit, Trash2, Plus, X, MapPin, Home, DollarSign, Settings } from 'lucide-react';



const PropertyDetailsModal = ({ property, onClose }) => {
  if (!property) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Detalles de la Propiedad</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información General */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Home className="text-blue-600" size={20} />
              <h3 className="text-lg font-semibold">Información General</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Fraccionamiento:</span>
                <p className="mt-1">{property.fraccionamiento}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Distrito:</span>
                <p className="mt-1">{property.distrito}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Loteamiento:</span>
                <p className="mt-1">{property.loteamiento}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Superficie:</span>
                <p className="mt-1">{property.superficie} m²</p>
              </div>
            </div>
          </div>

          {/* Datos Catastrales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Datos Catastrales</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Finca:</span>
                <p className="mt-1">{property.finca}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Padrón:</span>
                <p className="mt-1">{property.padron}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Cuenta Catastral:</span>
                <p className="mt-1">{property.cuentaCatastral}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Manzana - Lote:</span>
                <p className="mt-1">{property.manzana} - {property.lote}</p>
              </div>
            </div>
          </div>

          {/* Información Comercial */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="text-green-600" size={20} />
              <h3 className="text-lg font-semibold">Información Comercial</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Precio Total:</span>
                <p className="mt-1 text-xl font-bold text-green-600">
                  {formatCurrency(property.precioTotal)}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Modalidad de Pago:</span>
                <p className="mt-1">{property.modalidadPago}</p>
              </div>
              {property.cuotas && (
                <>
                  <div>
                    <span className="font-medium text-gray-600">Cuotas:</span>
                    <p className="mt-1">{property.cuotas}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Monto por Cuota:</span>
                    <p className="mt-1">{formatCurrency(property.montoCuota)}</p>
                  </div>
                </>
              )}
              <div>
                <span className="font-medium text-gray-600">Estado de Venta:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                  property.estadoVenta === "Disponible"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}>
                  {property.estadoVenta}
                </span>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="text-red-600" size={20} />
              <h3 className="text-lg font-semibold">Ubicación</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Latitud:</span>
                <p className="mt-1">{property.latitud}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Longitud:</span>
                <p className="mt-1">{property.longitud}</p>
              </div>
            </div>
          </div>

          {/* Linderos */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold">Linderos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Norte ({property.linderoNorteMedida}m):</span>
                <p className="mt-1">{property.linderoNorteCon}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Sur ({property.linderoSurMedida}m):</span>
                <p className="mt-1">{property.linderoSurCon}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Este ({property.linderoEsteMedida}m):</span>
                <p className="mt-1">{property.linderoEsteCon}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Oeste ({property.linderoOesteMedida}m):</span>
                <p className="mt-1">{property.linderoOesteCon}</p>
              </div>
            </div>
          </div>

          {/* Servicios e Infraestructura */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="text-purple-600" size={20} />
              <h3 className="text-lg font-semibold">Servicios</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${property.aguaPotable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Agua Potable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${property.energiaElectrica ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Energía Eléctrica</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${property.calle ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Calle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${property.seguridad ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Seguridad</span>
              </div>
            </div>
          </div>

          {/* Estado del Terreno */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estado del Terreno</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${property.entregado ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Entregado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${property.amojonado ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Amojonado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${property.limpio ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Limpio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${property.tieneConstruccion ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Tiene Construcción</span>
              </div>
            </div>
          </div>

          {/* Beneficios Comunes */}
          {property.beneficiosComunes && property.beneficiosComunes.length > 0 && (
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold">Beneficios Comunes</h3>
              <div className="flex flex-wrap gap-2">
                {property.beneficiosComunes.map((beneficio, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {beneficio}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Restricciones */}
          {property.restriccionConstrucion && property.restriccionConstrucion.length > 0 && (
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold">Restricciones de Construcción</h3>
              <div className="flex flex-wrap gap-2">
                {property.restriccionConstrucion.map((restriccion, index) => (
                  <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    {restriccion}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Expensas */}
          {property.requiereExpensas && (
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold">Expensas</h3>
              <div className="text-sm">
                <span className="font-medium text-gray-600">Monto mensual:</span>
                <p className="mt-1 text-lg font-bold text-orange-600">
                  {formatCurrency(property.expensas)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;