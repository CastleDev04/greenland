import Logo from "../image/Logo.png"
import { LuCircleDollarSign } from "react-icons/lu";

import { BsPersonCircle, BsList } from "react-icons/bs";

export default function Navbar() {
    
    return(
        <>
            <nav>
                <div className="flex justify-between items-center py-4 md:px-2 bg-ambar-200 ">
                    {/*Logo section*/}
                    <div className="flex items-center">

                        <img src={Logo} alt="Logo  greenland" className="w-11 h-11 md:h-16 md:w-16 "/>
                        <div >
                            <h1 className="text-2xl md:text-4xl font-medium">GREEN LAND</h1>
                            <p className="text-sm md:font-normal">Emprendimientos & Inversiones</p>
                        </div>
                    </div>
                    {/*Menu section*/}
                    <div className="hidden md:block">
                        <ul className="flex text-xl item-center gap-5 text-gray-600">
                                <li >
                                    <a href="" className="inline-block py-1 px-3 hover:text-gray-200 font-semibolt ">
                                        Inicio
                                    </a>
                                    
                                </li>
                                <li >
                                    <a href="" className="inline-block py-1 px-3 hover:text-gray-200 font-semibolt ">
                                        Nosotros
                                    </a>
                                    
                                </li>
                                <li >
                                    <a href="" className="inline-block py-1 px-3 hover:text-gray-200 font-semibolt ">
                                        Servicios
                                    </a>
                                    
                                </li>
                                <li >
                                    <a href="" className="inline-block py-1 px-3 hover:text-gray-200 font-semibolt ">
                                        Propiedades
                                    </a>
                                    
                                </li>
                                <li >
                                    <a href="" className="inline-block py-1 px-3 hover:text-gray-200 font-semibolt ">
                                        Contacto
                                    </a>
                                    
                                </li>
                        </ul>
                    </div>
                    
                    {/*Icon section*/}
                    <div className="hidden md:flex gap-5 ">
                        {/* <button className="flex bg-gray-200 w-32 h-12 cursor-pointer hover:bg-gray-100 rounded-xl justify-center text-xl font-bolt text-center gap-3 items-center px-3">
                            <LuSearch /> Buscar
                        </button> */}
                        <button className="flex bg-gray-200 w-42 h-12 cursor-pointer hover:bg-gray-100  rounded-xl justify-center text-xl font-bolt text-center gap-3 items-center px-3">
                            <LuCircleDollarSign /> Mis Pagos
                        </button>
                        <button className="flex bg-blue-700 w-32 h-12 cursor-pointer hover:bg-blue-600 rounded-xl justify-center text-xl font-bolt text-center gap-3 items-center px-3">
                            <BsPersonCircle /> Acceder
                        </button>
                    </div>
                    {/*Mobile hamburguer menu section*/}
                    <div className="md:hidden flex items-center p-2">
                            <button className="text-4xl">
                                <BsList/>
                            </button>
                    </div>
                </div>
            </nav>

            {/*Mobile sidebar section*/}
        </>
    )
};
