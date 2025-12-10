import { useState, useEffect, useCallback } from 'react';
import NoticiasService from '../service/NoticiasService';
import { SupabaseMediaService } from '../service/SupabaseMediaService';

export const useNoticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar noticias
  const loadNoticias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await NoticiasService.getNoticias();
      setNoticias(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando noticias:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear noticia
  const createNoticia = async (noticiaData, file = null) => {
    console.log('Datos para crear:', noticiaData);
    setLoading(true);
    setError(null);
    try {
      let mediaData = {};

      // Subir archivo si existe
      if (file) {
        const uploadedFile = await SupabaseMediaService.uploadFile(file, 'noticia_temp');
        mediaData = {
          url_imagen: uploadedFile.url
        };
      }

      // Combinar datos
      const datosParaCrear = {
        ...noticiaData,
        ...mediaData
      };

      const result = await NoticiasService.createNoticia(datosParaCrear);
      await loadNoticias();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error creando noticia:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar noticia
  const updateNoticia = async (id, noticiaData, newFile = null) => {
    setLoading(true);
    setError(null);
    try {
      let mediaData = {};

      // Subir nuevo archivo si existe
      if (newFile) {
        const uploadedFile = await SupabaseMediaService.uploadFile(newFile, `noticia_${id}`);
        mediaData = {
          url_imagen: uploadedFile.url
        };
        
        // Eliminar archivo anterior si existe
        const noticiaActual = noticias.find(n => n.id === id);
        if (noticiaActual && noticiaActual.url_imagen && noticiaActual.url_imagen.includes('supabase')) {
          // Extraer path de la URL para eliminar
          try {
            const urlParts = noticiaActual.url_imagen.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const filePath = `imagenes_noticias/${fileName}`;
            await SupabaseMediaService.deleteFile(filePath);
          } catch (deleteError) {
            console.warn('No se pudo eliminar el archivo anterior:', deleteError);
          }
        }
      }

      // Combinar datos
      const datosParaActualizar = {
        ...noticiaData,
        ...mediaData
      };

      const result = await NoticiasService.updateNoticia(id, datosParaActualizar);
      await loadNoticias();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error actualizando noticia:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar noticia
  const deleteNoticia = async (id) => {
    setLoading(true);
    setError(null);
    try {
      // Eliminar archivo asociado si existe
      const noticia = noticias.find(n => n.id === id);
      if (noticia && noticia.url_imagen && noticia.url_imagen.includes('supabase')) {
        try {
          const urlParts = noticia.url_imagen.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const filePath = `imagenes_noticias/${fileName}`;
          await SupabaseMediaService.deleteFile(filePath);
        } catch (deleteError) {
          console.warn('No se pudo eliminar el archivo:', deleteError);
        }
      }

      const result = await NoticiasService.deleteNoticia(id);
      await loadNoticias();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error eliminando noticia:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNoticias();
  }, [loadNoticias]);

  return {
    noticias,
    loading,
    error,
    createNoticia,
    updateNoticia,
    deleteNoticia,
    reloadNoticias: loadNoticias
  };
};