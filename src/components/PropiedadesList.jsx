import PropiedadesCard from './PropiedadesCard.jsx';

export default function PropiedadesList() {
    const Lotes=[{
        titulo: "Las Lomas Country",
        ubicacion: "Loma Grande",
        superficie: "500 m²",
        precio: "1.000.000"
    }, {
        titulo: "Parque del Sol",
        ubicacion: "Ciudad del Este",
        superficie: "600 m²",
        precio: "1.200.000"
    }, {
        titulo: "Valle Verde",
        ubicacion: "Asunción",
        superficie: "700 m²",
        precio: "1.500.000"
    }]
    return(
        <>
            <div className="flex flex-col justify-center items-center gap-16 bg-green-300 p-8">
                <div>
                    <h2 className="text-3xl font-bold">Propiedades Destacadas</h2>
                </div>
                <div className="flex gap-22 items-center justify-around">
                    {Lotes.map((lote, index) => (
                        <PropiedadesCard 
                            key={index}
                            titulo={lote.titulo} 
                            ubicacion={lote.ubicacion} 
                            superficie={lote.superficie} 
                            precio={lote.precio} 
                        />
                    ))}
                </div>
            </div>
        </>
    )
};
