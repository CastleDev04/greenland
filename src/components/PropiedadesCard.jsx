import portada from "../image/portada.jpg"

export default function PropiedadesCard(params) {
    return(
        <>
                    <div className="w-80">
                        {/* Imagen de la loteadora */}
                        <img src={portada} alt="Imagen de loteadora" className="w-full h-54 rounded-t-2xl"/>
                        {/* Informacion de la loteadora */}
        
                        <div className="flex flex-col gap-4 p-4 bg-white">
                            {/* Titulo */}
                            <div className="w-full flex justify-center items-center">
                                <h2 className="text-2xl font-bold text-center">
                                    {params.titulo}
                                </h2>
                            </div>
                            {/* Informacion sobre lote (Ubicacion y disponibilida) */}
                            <div className="flex flex-col gap-2">
                                <p>
                                    <span>Ubicacion:</span>  {params.ubicacion}
                                </p>
                                <p>
                                    <span>Superficie:</span>  {params.superficie}
                                </p>
                            </div>
                            {/* Precio estimado */}
                            <div className="flex justify-end items-end">
                                <p>
                                    <span>Coutas Desde:</span> {params.precio} Gs
                                </p>
                            </div>
                        </div>
                        <button className="w-full bg-green-400 text-xl rounded-b-md p-1.5 hover:bg-green-200">Ver Loteamiento</button>
                    </div>
                </>
    )
    
};
