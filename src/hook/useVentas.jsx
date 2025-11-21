// hook/useVentas.jsx
import { useState, useEffect, useCallback } from 'react';
import ventasService from '../service/VentasService';

export const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Función para recargar las ventas
  const refetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Cargar ventas al montar el componente
  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔄 Cargando ventas...');
        const data = await ventasService.getVentas();
        
        // Asegurar que sea un array
        const ventasArray = Array.isArray(data) ? data : [];
        console.log(`✅ ${ventasArray.length} ventas cargadas`);
        
        setVentas(ventasArray);
      } catch (err) {
        console.error('❌ Error al cargar ventas:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, [refreshKey]);

  // Crear una nueva venta
  const createVenta = async (ventaData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 Creando nueva venta...');
      const response = await ventasService.createVenta(ventaData);
      
      // Extraer la venta creada del response
      const newVenta = response.venta || response.data || response;
      
      console.log('✅ Venta creada exitosamente:', newVenta);
      
      // Agregar a la lista local
      setVentas(prev => [...prev, newVenta]);
      
      // Refrescar para obtener datos actualizados del servidor
      refetch();
      
      return newVenta;
    } catch (err) {
      console.error('❌ Error al crear venta:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar una venta existente
  const updateVenta = async (id, ventaData) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📝 Actualizando venta #${id}...`);
      const response = await ventasService.updateVenta(id, ventaData);
      
      // Extraer la venta actualizada del response
      const updatedVenta = response.venta || response.data || response;
      
      console.log('✅ Venta actualizada exitosamente:', updatedVenta);
      
      // Actualizar en la lista local
      setVentas(prev => 
        prev.map(venta => venta.id === id ? updatedVenta : venta)
      );
      
      // Refrescar para obtener datos actualizados del servidor
      refetch();
      
      return updatedVenta;
    } catch (err) {
      console.error(`❌ Error al actualizar venta #${id}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar (cancelar) una venta
  const deleteVenta = async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🗑️ Eliminando venta #${id}...`);
      await ventasService.deleteVenta(id);
      
      console.log('✅ Venta eliminada exitosamente');
      
      // Eliminar de la lista local
      setVentas(prev => prev.filter(venta => venta.id !== id));
      
      // Refrescar para obtener datos actualizados del servidor
      refetch();
      
      return { success: true };
    } catch (err) {
      console.error(`❌ Error al eliminar venta #${id}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener una venta específica por ID
  const getVentaById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const venta = await ventasService.getVentaById(id);
      return venta;
    } catch (err) {
      console.error(`❌ Error al obtener venta #${id}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    ventas,
    loading,
    error,
    createVenta,
    updateVenta,
    deleteVenta,
    getVentaById,
    refetch
  };
};