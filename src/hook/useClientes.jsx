import { useState,  useCallback } from 'react';
import clientesService from '../service/ClientesService';

export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientesService.getClientes();
      setClientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCliente = async (clienteData) => {
    setLoading(true);
    setError(null);
    try {
      const newCliente = await clientesService.createCliente(clienteData);
      setClientes(prev => [...prev, newCliente]);
      return newCliente;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCliente = async (id, clienteData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCliente = await clientesService.updateCliente(id, clienteData);
      setClientes(prev => 
        prev.map(cliente => 
          cliente.id === id ? updatedCliente : cliente
        )
      );
      return updatedCliente;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCliente = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await clientesService.deleteCliente(id);
      setClientes(prev => prev.filter(cliente => cliente.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  

  return {
    clientes,
    loading,
    error,
    refetch: fetchClientes,
    createCliente,
    updateCliente,
    deleteCliente,
  };
};