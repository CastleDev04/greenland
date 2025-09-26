import { useState, useEffect, useCallback } from 'react';
import ventasService from '../service/VentasService';

export const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVentas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Ejecutando fetchVentas...');
      const ventasData = await ventasService.getVentas();
      setVentas(ventasData);
    } catch (err) {
      setError(err);
      setVentas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]); // Solo se ejecuta una vez

  const createVenta = async (ventaData) => {
    const newVenta = await ventasService.createVenta(ventaData);
    await fetchVentas(); // Recargar solo después de crear
    return newVenta;
  };

  const updateVenta = async (id, ventaData) => {
    const updatedVenta = await ventasService.updateVenta(id, ventaData);
    await fetchVentas(); // Recargar solo después de actualizar
    return updatedVenta;
  };

  const deleteVenta = async (id) => {
    await ventasService.deleteVenta(id);
    await fetchVentas(); // Recargar solo después de eliminar
  };

  return {
    ventas,
    loading,
    error,
    createVenta,
    updateVenta,
    deleteVenta,
    refetch: fetchVentas
  };
};