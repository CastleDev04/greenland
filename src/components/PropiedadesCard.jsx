import { FiMapPin } from "react-icons/fi";
import { BsCurrencyDollar, BsSuperscript } from "react-icons/bs";


export default function PropiedadesCard(params) {
    return(
        <>
                    <div className="w-80 border-gray-300 border-2 md:rounded-2xl md:rounded-b-md shadow-lg hover:shadow-xl transition-shadow duration-300">
                        {/* Imagen de la loteadora */}
                        <img src={params.imagen} alt="Imagen de loteadora" className="w-full h-56 md:rounded-t-2xl"/>
                        {/* Informacion de la loteadora */}
        
                        <div className="flex flex-col gap-4 p-4 bg-white">
                            {/* Titulo */}
                            <div className="w-full flex justify-center items-center">
                                <h2 className="md:text-2xl font-bold text-center">
                                    {params.titulo}
                                </h2>
                            </div>
                            {/* Informacion sobre lote (Ubicacion y disponibilida) */}
                            <div className="flex flex-col gap-2">
                                <p className="flex items-center gap-3 md:text-xl text-gray-800">
                                    <span className="flex gap-2 items-center md:text-xl font-bold text-gray-950"><FiMapPin />Ubicacion:</span>  {params.ubicacion}
                                </p>
                                <p className="flex items-center gap-3 md:text-xl text-gray-800">
                                    <span className="flex gap-2 items-center md:text-xl font-bold text-gray-950"><BsSuperscript />Superficie:</span>  {params.superficie}
                                </p>
                            </div>
                            {/* Precio estimado */}
                            <div className="flex justify-end items-end">
                                <p className="flex items-center gap-3 md:text-xl text-gray-800">
                                    <span className="flex gap-2 items-center md:text-xl font-bold text-gray-950"><BsCurrencyDollar />Precio:</span> {params.precio} Gs
                                </p>
                            </div>
                        </div>
                        <button className="w-full bg-green-400 text-xl md:rounded-b-md p-1.5 hover:bg-green-200">Ver Contacto</button>
                    </div>
                </>
    )
    
};
