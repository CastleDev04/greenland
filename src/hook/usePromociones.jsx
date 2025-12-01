// src/hooks/usePromociones.jsx
import { useState, useEffect, useCallback } from 'react';
import PromocionesService from '../service/PromocionesService';
import { SupabaseMediaService } from '../service/SupabaseMediaService';

export const usePromociones = () => {
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar publicidad
  const loadPromociones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await PromocionesService.getPromociones();
      // Ahora result es directamente el array de publicidades
      setPromociones(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando publicidad:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear publicidad
  const createPromocion = async (promocionData, file = null) => {
    console.log('Datos para crear:', promocionData);
    setLoading(true);
    setError(null);
    try {
      let mediaData = {};

      // Subir archivo si existe
      if (file) {
        const uploadedFile = await SupabaseMediaService.uploadFile(file, 'temp');
        mediaData = {
          tipo_medio: uploadedFile.tipo,
          url_medio: uploadedFile.url
        };
      }

      // Combinar datos
      const datosParaCrear = {
        ...promocionData,
        ...mediaData
      };

      const result = await PromocionesService.createPromocion(datosParaCrear);
      await loadPromociones();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error creando publicidad:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar publicidad
  const updatePromocion = async (id, promocionData, newFile = null) => {
    setLoading(true);
    setError(null);
    try {
      let mediaData = {};

      // Subir nuevo archivo si existe
      if (newFile) {
        const uploadedFile = await SupabaseMediaService.uploadFile(newFile, id);
        mediaData = {
          tipo_medio: uploadedFile.tipo,
          url_medio: uploadedFile.url
        };
        
        // Eliminar archivo anterior si existe
        const publicidadActual = promociones.find(p => p.id === id);
        if (publicidadActual && publicidadActual.path) {
          await SupabaseMediaService.deleteFile(publicidadActual.path);
        }
      }

      // Combinar datos
      const datosParaActualizar = {
        ...promocionData,
        ...mediaData
      };

      const result = await PromocionesService.updatePromocion(id, datosParaActualizar);
      await loadPromociones();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error actualizando publicidad:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar publicidad
  const deletePromocion = async (id) => {
    setLoading(true);
    setError(null);
    try {
      // Eliminar archivo asociado si existe
      const publicidad = promociones.find(p => p.id === id);
      if (publicidad && publicidad.path) {
        await SupabaseMediaService.deleteFile(publicidad.path);
      }

      const result = await PromocionesService.deletePromocion(id);
      await loadPromociones();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error eliminando publicidad:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromociones();
  }, [loadPromociones]);

  return {
    promociones,
    loading,
    error,
    createPromocion,
    updatePromocion,
    deletePromocion,
    reloadPromociones: loadPromociones
  };
};