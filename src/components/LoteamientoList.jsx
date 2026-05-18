import { useState, useEffect } from 'react';
import LoteamientoCard from "./LoteamientoCard";
import { useFraccionamientos } from '../hook/useFraccionamientos';

export default function LoteamientoList() {
    const { fraccionamientos, loading, error, fetchFraccionamientos } = useFraccionamientos();
    const [fraccionamientosActivos, setFraccionamientosActivos] = useState([]);

    useEffect(() => {
        // Cargar fraccionamientos desde la API
        fetchFraccionamientos();
    }, []);

    useEffect(() => {
        // Filtrar solo los fraccionamientos activos o en desarrollo
        if (fraccionamientos.length > 0) {
            const activos = fraccionamientos.filter(f => 
                f.estado === 'Activo' || f.estado === 'En desarrollo' || !f.estado
            );
            setFraccionamientosActivos(activos);
        }
    }, [fraccionamientos]);

    // Mostrar loading mientras carga
    if (loading) {
        return (
            <div className="w-full flex flex-col justify-center items-center gap-16">
                <h1 className="font-display text-3xl font-bold">Loteadoras</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    <span className="ml-3 text-gray-600">Cargando loteamientos...</span>
                </div>
            </div>
        );
    }

    // Mostrar error si hay
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center gap-16">
                <h1 className="font-display text-3xl font-bold">Loteadoras</h1>
                <div className="text-center py-12">
                    <p className="text-red-600">Error al cargar los loteamientos: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col justify-center items-center gap-16 px-4 py-8">
            {/* Título */}
            <h1 className="font-display text-3xl font-bold text-center">Loteadoras</h1>
            
            {/* Seccion de cartas de loteadoras */}
            {fraccionamientosActivos.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">No hay loteamientos disponibles en este momento.</p>
                </div>
            ) : (
                <div className="w-full max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {fraccionamientosActivos.map((fraccionamiento) => (
                            <LoteamientoCard 
                                key={fraccionamiento.id} 
                                fraccionamiento={fraccionamiento} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}