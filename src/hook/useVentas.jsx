import { useState, useEffect, useCallback } from 'react';
import ventasService from '../service/VentasService';

export const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadVentas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Cargando ventas...');
      const ventasData = await ventasService.getVentas();
      console.log(`✅ ${ventasData.length} ventas cargadas`);
      setVentas(ventasData);
    } catch (err) {
      console.error('❌ Error al cargar ventas:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVentas();
  }, [loadVentas]);

  const createVenta = async (ventaData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 Creando nueva venta...');
      const response = await ventasService.createVenta(ventaData);
      
      const nuevaVenta = response.venta || response;
      console.log('✅ Venta creada:', nuevaVenta);
      
      setVentas(prev => [...prev, nuevaVenta]);
      
      return nuevaVenta;
    } catch (err) {
      console.error('❌ Error al crear venta:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVenta = async (id, ventaData) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📝 Actualizando venta #${id}...`);
      const response = await ventasService.updateVenta(id, ventaData);
      
      const ventaActualizada = response.venta || response;
      console.log('✅ Venta actualizada:', ventaActualizada);
      
      setVentas(prev => 
        prev.map(venta => venta.id === id ? ventaActualizada : venta)
      );
      
      return ventaActualizada;
    } catch (err) {
      console.error(`❌ Error al actualizar venta #${id}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVenta = async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🗑️ Eliminando venta #${id}...`);
      await ventasService.deleteVenta(id);
      
      console.log('✅ Venta eliminada');
      
      setVentas(prev => prev.filter(venta => venta.id !== id));
      
      return { success: true };
    } catch (err) {
      console.error(`❌ Error al eliminar venta #${id}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refetch = useCallback(() => {
    loadVentas();
  }, [loadVentas]);

  const simularVenta = (ventaData) => {
    try {
      return ventasService.simularVenta(ventaData);
    } catch (err) {
      console.error('❌ Error en simulación:', err);
      throw err;
    }
  };

  // 🔥 NUEVO: Función para calcular resumen de venta
  const calcularResumenVenta = (venta) => {
    const montoTotal = venta.montoTotal || 0;
    const montoPagado = venta.monto_pagado || 0; // ✅ Usar monto_pagado del backend
    const montoPendiente = Math.max(0, montoTotal - montoPagado);
    const cuotasPagadas = venta.cuotas_pagadas || 0;
    const totalCuotas = venta.cantidadCuotas || 0;
    const progreso = montoTotal > 0 ? (montoPagado / montoTotal) * 100 : 0;

    return {
      montoTotal,
      montoPagado,
      montoPendiente,
      cuotasPagadas,
      totalCuotas,
      progreso,
      estaPagada: montoPendiente <= 0
    };
  };

  return {
    ventas,
    loading,
    error,
    createVenta,
    updateVenta,
    deleteVenta,
    refetch,
    simularVenta,
    calcularResumenVenta, // 🔥 NUEVO
    getVentaById: ventasService.getVentaById,
    getVentasActivas: ventasService.getVentasActivas,
    getLotesDisponibles: ventasService.getLotesDisponibles
  };
};