// hook/useFraccionamientos.js
import { useState, useCallback } from 'react';
import FraccionamientosService from '../service/FraccionamientosService';

export const useFraccionamientos = () => {
  const [fraccionamientos, setFraccionamientos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFraccionamientos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await FraccionamientosService.getAll();
      setFraccionamientos(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error('Error al cargar fraccionamientos:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLotesByFraccionamiento = useCallback(async (fraccionamientoId) => {
    try {
      const data = await FraccionamientosService.getLotesByFraccionamiento(fraccionamientoId);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Error al cargar lotes:', err);
      return [];
    }
  }, []);

  const fetchAllLotes = useCallback(async () => {
    try {
      const data = await FraccionamientosService.getAllLotes();
      setLotes(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error('Error al cargar todos los lotes:', err);
      return [];
    }
  }, []);

  const createFraccionamiento = useCallback(async (fraccionamientoData) => {
    setLoading(true);
    try {
      const nuevoFraccionamiento = await FraccionamientosService.create(fraccionamientoData);
      setFraccionamientos(prev => [...prev, nuevoFraccionamiento]);
      return nuevoFraccionamiento;
    } catch (err) {
      console.error('Error al crear fraccionamiento:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFraccionamiento = useCallback(async (id, fraccionamientoData) => {
    setLoading(true);
    try {
      const fraccionamientoActualizado = await FraccionamientosService.update(id, fraccionamientoData);
      setFraccionamientos(prev => prev.map(f => f.id === id ? fraccionamientoActualizado : f));
      return fraccionamientoActualizado;
    } catch (err) {
      console.error('Error al actualizar fraccionamiento:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFraccionamiento = useCallback(async (id) => {
    setLoading(true);
    try {
      await FraccionamientosService.delete(id);
      setFraccionamientos(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error('Error al eliminar fraccionamiento:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createLote = useCallback(async (loteData) => {
    setLoading(true);
    try {
      const nuevoLote = await FraccionamientosService.createLote(loteData);
      setLotes(prev => [...prev, nuevoLote]);
      return nuevoLote;
    } catch (err) {
      console.error('Error al crear lote:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLote = useCallback(async (id, loteData) => {
    setLoading(true);
    try {
      const loteActualizado = await FraccionamientosService.updateLote(id, loteData);
      setLotes(prev => prev.map(l => l.id === id ? loteActualizado : l));
      return loteActualizado;
    } catch (err) {
      console.error('Error al actualizar lote:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLote = useCallback(async (id) => {
    setLoading(true);
    try {
      await FraccionamientosService.deleteLote(id);
      setLotes(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Error al eliminar lote:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fraccionamientos,
    lotes,
    loading,
    error,
    fetchFraccionamientos,
    fetchLotesByFraccionamiento,
    fetchAllLotes,
    createFraccionamiento,
    updateFraccionamiento,
    deleteFraccionamiento,
    createLote,
    updateLote,
    deleteLote
  };
};