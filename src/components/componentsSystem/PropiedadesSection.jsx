import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Plus, X, MapPin, Home, DollarSign, Settings } from 'lucide-react';

import PropertyDetailsModal from "./PropertyDetailsModal"
import PropertyForm from "./PropertyForm"

// Componente Principal
const PropiedadesSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [propiedades, setPropiedades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [operando, setOperando] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // 🔥 CORRECCIÓN: URL base sin slash final duplicado
  const API_BASE_URL = 'https://api.greenlandpy.com/api';

  useEffect(() => {
    loadPropiedades();
  }, []);

  const loadPropiedades = async () => {
    try {
      setCargando(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/lotes`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setPropiedades(data);
    } catch (error) {
      console.error('Error loading propiedades:', error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleView = (id) => {
    const prop = propiedades.find(p => p.id === id);
    setViewingProperty(prop);
    setShowDetails(true);
  };

  const handleEdit = (id) => {
    const prop = propiedades.find(p => p.id === id);
    setEditingProperty(prop);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta propiedad?')) {
      return;
    }

    try {
      setOperando(true);
      const res = await fetch(`${API_BASE_URL}/lotes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`, 
        },
      });
      
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      
      setPropiedades(propiedades.filter(prop => prop.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      alert(`Error al eliminar: ${error.message}`);
    } finally {
      setOperando(false);
    }
  };

  const handleAdd = () => {
    setEditingProperty(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setOperando(true);
      
      if (editingProperty) {
        // Actualizar
        const res = await fetch(`${API_BASE_URL}/lotes/${editingProperty.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`, 
          },
          body: JSON.stringify(data),
        });
        
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const updatedProperty = await res.json();
        
        setPropiedades(propiedades.map(p => 
          p.id === editingProperty.id ? updatedProperty : p
        ));
      } else {
        // Crear
        const res = await fetch(`${API_BASE_URL}/lotes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`, 
          },
          body: JSON.stringify(data),
        });
        
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const newProperty = await res.json();
        
        setPropiedades([...propiedades, newProperty]);
      }

      setShowForm(false);
      setEditingProperty(null);
      
      // 🔥 CORRECCIÓN: Recargar datos en lugar de recargar toda la página
      await loadPropiedades();
      
    } catch (error) {
      console.error('Error saving property:', error);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setOperando(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setViewingProperty(null);
  };

  if (cargando) {
    return (
      <div className="p-4 flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
          <button 
            onClick={loadPropiedades}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Propiedades</h2>
        <button
          onClick={handleAdd}
          disabled={operando}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Propiedad
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Fraccionamiento</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Manzana</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Lote</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Precio</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Estado</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {propiedades.map((prop) => (
              <tr key={prop.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium">{prop.fraccionamiento}</td>
                <td className="px-4 py-3">{prop.manzana}</td>
                <td className="px-4 py-3">{prop.lote}</td>
                <td className="px-4 py-3 font-semibold text-green-600">
                  ₲{prop.precioTotal?.toLocaleString() || '0'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      prop.estadoVenta === "Disponible"
                        ? "bg-green-100 text-green-800"
                        : prop.estadoVenta === "Reservado"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {prop.estadoVenta}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(prop.id)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      title="Ver detalles"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(prop.id)}
                      disabled={operando}
                      className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 disabled:opacity-50"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(prop.id)}
                      disabled={operando}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {propiedades.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  <div className="text-center">
                    <Home size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>No hay propiedades registradas.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 CORRECCIÓN: Modal de formulario SOLO para crear/editar */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold">
                {editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
              </h3>
              <button
                onClick={handleCancelForm}
                disabled={operando}
                className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>
            <PropertyForm
              initialData={editingProperty || {}}
              onCancel={handleCancelForm}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}

      {/* 🔥 CORRECCIÓN: Modal de detalles SOLO para ver */}
      {showDetails && viewingProperty && (
        <PropertyDetailsModal
          property={viewingProperty}
          onClose={handleCloseDetails}
        />
      )}

      {/* Loading overlay */}
      {operando && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Procesando...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropiedadesSection;