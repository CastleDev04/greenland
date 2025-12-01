// src/services/SupabaseMediaService.js
import { supabase } from '../components/lib/supabase';

export class SupabaseMediaService {
  
  static getBucketConfig(file) {
    const isVideo = file.type.startsWith('video/');
    return {
      bucket: 'media',
      folder: isVideo ? 'videos_promos' : 'imagenes_promos',
      tipo: isVideo ? 'video' : 'imagen'
    };
  }

  static async uploadFile(file, promocionId) {
    try {
      const { folder, tipo } = this.getBucketConfig(file);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${promocionId}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        nombre_archivo: file.name,
        tipo: tipo,
        path: filePath
      };

    } catch (error) {
      console.error('Error subiendo archivo:', error);
      throw error;
    }
  }

  static async deleteFile(filePath) {
    try {
      const { error } = await supabase.storage
        .from('media')
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error eliminando archivo:', error);
      throw error;
    }
  }

  static async uploadMultipleFiles(files, promocionId) {
    const uploadPromises = files.map(file => 
      this.uploadFile(file, promocionId)
    );
    
    return Promise.all(uploadPromises);
  }

  static async deleteMultipleFiles(filePaths) {
    try {
      if (!filePaths || filePaths.length === 0) return true;

      const { error } = await supabase.storage
        .from('media')
        .remove(filePaths);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error eliminando archivos:', error);
      throw error;
    }
  }
}