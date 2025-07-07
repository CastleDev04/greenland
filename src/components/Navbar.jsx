import Logo from "../image/Logo.png"
import { Outlet, Link } from "react-router-dom";
import { LuCircleDollarSign } from "react-icons/lu";
import { useState } from 'react';
import { BsPersonCircle, BsList } from "react-icons/bs";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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
                                    <Link to="/"  className="inline-block py-1 px-3 hover:text-gray-200 font-semibolt ">
                                        Inicio
                                    </Link>
                                    
                                </li>
                                <li >
                                    <Link to="/nosotros"  className="inline-block py-1 px-3 hover:text-gray-200 font-semibolt ">
                                        Nosotros
                                    </Link>
                                    
                                </li>
                                <li >
                                    <Link to="/servicios"  className="inline-block py-1 px-3 hover:text-gray-200 font-semibolt ">
                                        Servicios
                                    </Link>
                                    
                                </li>
                                <li >
                                    <Link to="/propiedades"  className="inline-block py-1 px-3 hover:text-gray-200 font-semibolt ">
                                        Propiedades
                                    </Link >
                                    
                                </li>
                                <li >
                                    <Link to="/contacto"  className="inline-block py-1 px-3 hover:text-gray-200 font-semibolt ">
                                        Contacto
                                    </Link>
                                    
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
                            <button onClick={toggleMenu} className="text-4xl text-gray-800 focus:outline-none">
                                <BsList/>
                            </button>
                    </div>
                </div>
            </nav>
            {/* Menú desplegable */}
            {isOpen && (
            <div className="absolute top-16 left-0 w-full bg-white shadow-lg z-50">
                <nav className="flex flex-col space-y-4 p-4 text-lg text-gray-700">
                    <Link to="/" onClick={toggleMenu} className="hover:text-blue-600">Inicio</Link>
                    <Link to="/nosotros" onClick={toggleMenu} className="hover:text-blue-600">Nosotros</Link>
                    <Link to="/servicios" onClick={toggleMenu} className="hover:text-blue-600">Servicios</Link>
                    <Link to="/propiedades" onClick={toggleMenu} className="hover:text-blue-600">Propiedades</Link>
                    <Link to="/contacto" onClick={toggleMenu} className="hover:text-blue-600">Contacto</Link>
                </nav>
            </div>
            )}

            <Outlet/>

        </>
    )
};
