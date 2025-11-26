import { useState, useEffect } from 'react';
import clientesService from '../service/ClientesService';

export const useClientes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [lotes, setLotes] = useState([]); // ← NUEVO ESTADO PARA LOTES

  // Cargar ambos: clientes y lotes
  const refetch = async () => {
    setLoading(true);
    try {
      console.log('🔄 Cargando clientes y lotes...');
      
      // Cargar clientes y lotes en paralelo usando el MISMO servicio
      const [clientesData, lotesData] = await Promise.all([
        clientesService.getClientes(),
        clientesService.getLotes() // ← NUEVO: Usar el método del mismo servicio
      ]);
      
      // CORRECCIÓN: Asegurar que clientes siempre sea un array
      const clientesArray = Array.isArray(clientesData.clientes) ? clientesData.clientes : 
                           Array.isArray(clientesData) ? clientesData : [];
      
      // CORRECCIÓN: Asegurar que lotes siempre sea un array
      const lotesArray = Array.isArray(lotesData) ? lotesData : [];

      console.log('✅ Clientes cargados:', clientesArray.length);
      console.log('✅ Lotes cargados:', lotesArray.length);
      
      setClientes(clientesArray);
      setLotes(lotesArray);
      setError(null);
    } catch (err) {
      console.error('💥 Error cargando datos:', err);
      setError(err.message);
      // Asegurar arrays vacíos en caso de error
      setClientes([]);
      setLotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al inicializar el hook
  useEffect(() => {
    refetch();
  }, []);

  // ... (el resto de las funciones se mantienen igual) ...
  const createCliente = async (clienteData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Creando cliente con datos:', clienteData);
      
      const result = await clientesService.createCliente(clienteData);
      
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

      setClientes(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        const updatedCliente = result.cliente || result;

        return prevArray.map(cliente =>
          cliente.id === id
            ? { ...cliente, ...updatedCliente }
            : cliente
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

  // Función para obtener lotes de un cliente específico
  const getLotesDelCliente = (clienteId) => {
    if (!clienteId || !Array.isArray(lotes)) return [];
    return lotes.filter(lote => lote.compradorId === clienteId);
  };

  return {
    clientes,
    lotes, // ← EXPORTAR LOTES
    loading,
    error,
    createCliente,
    updateCliente,
    deleteCliente,
    refetch,
    getLotesDelCliente // ← NUEVA FUNCIÓN
  };
};