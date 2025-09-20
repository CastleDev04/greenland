import { useState, useCallback } from 'react';
import ventasService from '../service/VentasService';

export const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVentas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ventasService.getVentas();
      setVentas(data);
    } catch (err) {
      setError(err.message || 'Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createVenta = async (ventaData) => {
    setLoading(true);
    setError(null);
    try {
      const newVenta = await ventasService.createVenta(ventaData);
      setVentas(prev => [...prev, newVenta]);
      return newVenta;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVenta = async (id, ventaData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedVenta = await ventasService.updateVenta(id, ventaData);
      setVentas(prev => 
        prev.map(venta => 
          venta.id === id ? updatedVenta : venta
        )
      );
      return updatedVenta;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVenta = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await ventasService.deleteVenta(id);
      setVentas(prev => prev.filter(venta => venta.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    ventas,
    loading,
    error,
    refetch: fetchVentas,
    createVenta,
    updateVenta,
    deleteVenta,
  };
};