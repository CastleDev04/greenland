import { LuSearch } from "react-icons/lu";
import portada from "../image/portada-greenland.jpg";
export default function Hero() {
    return(
        <>
        {/* Section de bienvenida */}
            <div className="font-body w-full bg-cover bg-center h-screen"
            style={{ backgroundImage: `url(${portada})` }}>
                <div className=" flex flex-col justify-center items-center h-full gap-6 ">
                    <h1 className="font-display text-4xl text-center md:text-8xl font-bolt">Bienvenidos a <span className="text-emerald-950 font-extrabold">Green Land </span> </h1>
                    <p className="text-xl text-center font-normal text-gray-900">Donde está tu terreno soñado, con Descuentos exclusivos y posesion inmediata</p>
                    <button className="flex bg-gray-200 w-32 h-12 cursor-pointer hover:bg-gray-100 rounded-xl justify-center text-xl font-bolt text-center gap-3 items-center px-3">
                            <LuSearch /> Buscar
                    </button>
                </div>
            </div>
        </>
    )
};
