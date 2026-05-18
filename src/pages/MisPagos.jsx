import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function MisPagos() {
  const [cedula, setCedula] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cedulaTrimmed = cedula.trim();

    if (!cedulaTrimmed) {
      setError('Por favor ingrese su número de cédula');
      return;
    }

    if (cedulaTrimmed.length < 3) {
      setError('La cédula debe tener al menos 3 caracteres');
      return;
    }

    setError('');
    navigate(`/cedula/${encodeURIComponent(cedulaTrimmed)}`);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Card principal */}
          <div className="rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-12 sm:px-10">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Mis Pagos
              </h1>
              <p className="mt-3 text-emerald-100">
                Consulta el estado de tus pagos y cuotas pendientes
              </p>
            </div>

            {/* Contenido */}
            <div className="px-8 py-12 sm:px-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input */}
                <div>
                  <label htmlFor="cedula" className="block text-sm font-semibold text-gray-700 mb-3">
                    Número de Cédula *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cedula"
                      value={cedula}
                      onChange={(e) => {
                        setCedula(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Ej: 2321486 o 123456789"
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-5 py-4 text-base placeholder-gray-400 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                    <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Mensaje de ayuda */}
                  <p className="mt-2 text-sm text-gray-500">
                    Ingresa tu número de cédula para ver tus pagos y estado de cuotas
                  </p>
                </div>

                {/* Mensaje de error */}
                {error && (
                  <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                )}

                {/* Botón */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl active:scale-95"
                >
                  Consultar mis pagos
                </button>
              </form>

              {/* Información adicional */}
              <div className="mt-10 space-y-4 border-t border-gray-200 pt-8">
                <h3 className="text-sm font-semibold text-gray-900">¿Qué verás aquí?</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span>Estado de tus pagos (pagado, pendiente, vencido)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span>Detalle de cuotas y montos adeudados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span>Fechas de vencimiento de pagos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span>Desglose de intereses y multas por mora</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Nota de privacidad */}
          <div className="mt-8 rounded-lg bg-blue-50 p-4 text-center text-xs text-blue-700 border border-blue-200">
            Tu información es privada y segura. Solo verás los pagos asociados a tu cédula.
          </div>
        </div>
      </div>
  );
}
