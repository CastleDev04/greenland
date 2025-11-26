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
        
        // Asegurarnos de que siempre sea un array
        setPagos(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Error al cargar los pagos');
        console.error('Error al cargar pagos:', err);
        setPagos([]); // Resetear a array vacío en caso de error
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
      const result = await pagosService.create(pagoData);
      const newPago = result.pago || result.data || result;
      
      setPagos(prev => [...prev, newPago]);
      return { success: true, data: newPago };
    } catch (err) {
      const errorMessage = err.message || 'Error al crear el pago';
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
      const result = await pagosService.update(id, pagoData);
      const updatedPago = result.pago || result.data || result;
      
      setPagos(prev => 
        prev.map(pago => pago.id === id ? updatedPago : pago)
      );
      return { success: true, data: updatedPago };
    } catch (err) {
      const errorMessage = err.message || 'Error al actualizar el pago';
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
      const errorMessage = err.message || 'Error al eliminar el pago';
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
      const result = await pagosService.getById(id);
      const pago = result.pago || result.data || result;
      return { success: true, data: pago };
    } catch (err) {
      const errorMessage = err.message || 'Error al obtener el pago';
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
      const result = await pagosService.uploadComprobante(id, file);
      const updatedPago = result.pago || result.data || result;
      
      setPagos(prev => 
        prev.map(pago => pago.id === id ? updatedPago : pago)
      );
      return { success: true, data: updatedPago };
    } catch (err) {
      const errorMessage = err.message || 'Error al subir el comprobante';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Simular pago
  const simularPago = async (simulacionData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await pagosService.simularPago(simulacionData);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Error al simular el pago';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NUEVO: Calcular total de pagos
  const calcularTotalPagos = useCallback(() => {
    return pagos.reduce((total, pago) => total + (parseFloat(pago.monto) || 0), 0);
  }, [pagos]);

  return {
    pagos,
    loading,
    error,
    createPago,
    updatePago,
    deletePago,
    getPagoById,
    uploadComprobante,
    simularPago,
    refresh,
    calcularTotalPagos // 🔥 NUEVO
  };
};