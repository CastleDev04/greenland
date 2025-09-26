import { useState } from 'react';
import clientesService from '../service/ClientesService';

export const useClientes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientes, setClientes] = useState([]); // Asegurar que siempre sea array

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await clientesService.getClientes();
      
      // CORRECCIÓN: Asegurar que clientes siempre sea un array
      const clientesArray = Array.isArray(data.clientes) ? data.clientes : 
                           Array.isArray(data) ? data : [];
      
      setClientes(clientesArray);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching clients:', err);
      // Asegurar que clientes sea array vacío en caso de error
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const createCliente = async (clienteData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Creando cliente con datos:', clienteData);
      
      const result = await clientesService.createCliente(clienteData);
      
      // CORRECCIÓN: Verificar que prev sea array antes de hacer spread
      setClientes(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        const newCliente = result.newCliente || result;
        return newCliente ? [...prevArray, newCliente] : prevArray;
      });
      
      return result;
      
    } catch (error) {
      console.error('💥 Error en useClientes.createCliente:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCliente = async (id, clienteData) => {
    setLoading(true);
    try {
      const result = await clientesService.updateCliente(id, clienteData);
      
      // CORRECCIÓN: Verificar que prev sea array
      setClientes(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        const updatedCliente = result.cliente || result;
        
        return prevArray.map(cliente => 
          cliente.id === id ? updatedCliente : cliente
        );
      });
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCliente = async (id) => {
    setLoading(true);
    try {
      await clientesService.deleteCliente(id);
      
      // CORRECCIÓN: Verificar que prev sea array
      setClientes(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.filter(cliente => cliente.id !== id);
      });
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    clientes,
    loading,
    error,
    createCliente,
    updateCliente,
    deleteCliente,
    refetch
  };
};