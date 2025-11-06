import { useState, useEffect, useCallback } from 'react';
import pagosService from '../service/PagosService';

export const usePagos = (ventaId = null) => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Función para recargar los pagos
  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Cargar pagos al montar el componente o cuando cambia ventaId
  useEffect(() => {
    const fetchPagos = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (ventaId) {
          data = await pagosService.getByVenta(ventaId);
        } else {
          data = await pagosService.getAll();
        }
        setPagos(data);
      } catch (err) {
        setError(err.message || 'Error al cargar los pagos');
        console.error('Error al cargar pagos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, [ventaId, refreshKey]);

  // Crear un nuevo pago
  const createPago = async (pagoData) => {
    setLoading(true);
    setError(null);
    try {
      const newPago = await pagosService.create(pagoData);
      setPagos(prev => [...prev, newPago]);
      return { success: true, data: newPago };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear el pago';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un pago existente
  const updatePago = async (id, pagoData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPago = await pagosService.update(id, pagoData);
      setPagos(prev => 
        prev.map(pago => pago.id === id ? updatedPago : pago)
      );
      return { success: true, data: updatedPago };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el pago';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un pago
  const deletePago = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await pagosService.delete(id);
      setPagos(prev => prev.filter(pago => pago.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el pago';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Obtener un pago específico
  const getPagoById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const pago = await pagosService.getById(id);
      return { success: true, data: pago };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener el pago';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Subir comprobante
  const uploadComprobante = async (id, file) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPago = await pagosService.uploadComprobante(id, file);
      setPagos(prev => 
        prev.map(pago => pago.id === id ? updatedPago : pago)
      );
      return { success: true, data: updatedPago };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al subir el comprobante';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    pagos,
    loading,
    error,
    createPago,
    updatePago,
    deletePago,
    getPagoById,
    uploadComprobante,
    refresh,
  };
};