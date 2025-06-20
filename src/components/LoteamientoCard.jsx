import portada from "../image/logo-lomas-country.jpg"


export default function LoteamientoCard() {
    return(
        <>
            <div className="w-80 border-gray-300 border-2 rounded-2xl rounded-b-md shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Imagen de la loteadora */}
                <img src={portada} alt="Imagen de loteadora" className="w-full h-54 rounded-t-2xl "/>
                {/* Informacion de la loteadora */}

                <div className="flex flex-col gap-4 p-4 bg-white">
                    {/* Titulo */}
                    <div className="w-full flex justify-center items-center">
                        <h2 className="text-2xl font-bold text-center">
                            Las Lomas Country
                        </h2>
                    </div>
                    {/* Informacion sobre lote (Ubicacion y disponibilida) */}
                    <div className="flex flex-col gap-2">
                        <p>
                            <span>Ubicacion:</span>  Loma Grande
                        </p>
                        <p>
                            <span>Disponible:</span>  133 lotes
                        </p>
                    </div>
                    {/* Precio estimado */}
                    <div className="flex justify-end items-end">
                        <p>
                            Precio:1.000.000 Gs
                        </p>
                    </div>
                </div>
                <button className="w-full bg-green-400 text-xl rounded-b-md p-1.5 hover:bg-green-200">Ver Loteamiento</button>
            </div>
        </>
    )
};
