import Foter from "../components/Footer"
import aguateria from "../image/aguateria.jpg"
import limpieza from "../image/limpieza.jpg"
import construccion from "../image/construccion.jpg"
import calle from "../image/calle.jpg"


export default function Servicios() {
    return(
        <>
        <div className="flex flex-col justify-center items-center gap-12 py-3">
            <h1 className="text-2xl">Servicios</h1>
            <div>
                <ul className="text-white font-bolt flex flex-col flex-wrap justify-center items-center">
                    <div className="group flex">
                        <li className="w-100 h-100 flex justify-center items-center text-2xl transform group-hover:w-40 transition-all duration-300 hover:w-160"
                        style={{ backgroundImage: `url(${aguateria})` }}>Aguateria</li>
                        <li className="w-100 h-100 flex justify-center items-center text-2xl transform group-hover:w-40 transition-all duration-300 hover:w-160"
                        style={{ backgroundImage: `url(${limpieza})` }}>Limpieza de terreno</li>
                    </div>
                    <div className="group flex">
                        <li className="w-100 h-100 flex justify-center items-center text-2xl transform group-hover:w-40 transition-all duration-300 hover:w-160"
                        style={{ backgroundImage: `url(${construccion})` }}>Construcciones</li>
                        <li className="w-100 h-100 flex justify-center items-center text-2xl transform group-hover:w-40 transition-all duration-300 hover:w-160"
                        style={{ backgroundImage: `url(${calle})` }}>Caminos</li>
                    </div>
                    
                    
                </ul>
            </div>
        </div>
        <Foter></Foter>
        </>
    )
};
