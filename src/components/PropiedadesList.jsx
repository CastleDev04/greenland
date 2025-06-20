import PropiedadesCard from './PropiedadesCard.jsx';
import Casa from "../image/casa-lomas-country.jpg";



export default function PropiedadesList() {
    const Lotes=[{
        imagen: "../image/casa-lomas-country.jpg",
        titulo: "Las Lomas Country - Casa",
        ubicacion: "Loma Grande",
        superficie: "57 m²",
        precio: "280.000.000"
    }, {
        imagen: "../image/imagen-lomas-country-barrio1.jpg",
        titulo: "Las Lomas Country - Terreno",
        ubicacion: "Loma Grande",
        superficie: "57 m²",
        precio: "1.200.000"
    }, {
        imagen: "../image/imagen-lomas-country-barrio2.jpg",
        titulo: "Las Lomas Country - Terreno",
        ubicacion: "Loma Grande",
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
                            imagen={lote.imagen}
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
