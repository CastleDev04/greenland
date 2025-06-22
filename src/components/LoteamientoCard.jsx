import portada from "../image/logo-lomas-country.jpg"
import { BsCurrencyDollar, BsCardList  } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";

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
                        <p className="flex items-center gap-3 text-xl text-gray-800">
                            <span className="flex gap-2 items-center text-2xl font-bolt text-gray-950"><FiMapPin />Ubicacion:</span>  Loma Grande
                        </p>
                        <p className="flex items-center gap-3 text-xl text-gray-800">
                            <span className="flex gap-2 items-center text-2xl font-bolt text-gray-950"><BsCardList />Disponible:</span>  133 lotes
                        </p>
                    </div>
                    {/* Precio estimado */}
                    <div className="flex justify-end items-end">
                        <p className="flex items-center gap-3 text-xl text-gray-800">
                            <span className="flex gap-2 items-center text-2xl font-bolt text-gray-950"><BsCurrencyDollar />Precio:</span>
                            1.000.000 Gs
                        </p>
                    </div>
                </div>
                <button className="w-full bg-green-400 text-xl rounded-b-md p-1.5 hover:bg-green-200">Ver Loteamiento</button>
            </div>
        </>
    )
};
