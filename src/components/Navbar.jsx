import Logo from "../image/Logo.png"
import { Outlet, Link, useLocation } from "react-router-dom";
import { LuCircleDollarSign } from "react-icons/lu";
import { useState, useEffect } from 'react';
import { BsPersonCircle, BsList, BsX } from "react-icons/bs";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    // Cerrar menú al cambiar de ruta
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    // Detectar scroll para cambiar estilo del navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevenir scroll cuando el menú móvil está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const navLinks = [
        { path: '/', label: 'Inicio' },
        { path: '/nosotros', label: 'Nosotros' },
        { path: '/servicios', label: 'Servicios' },
        { path: '/propiedades', label: 'Propiedades' },
        { path: '/contacto', label: 'Contacto' },
    ];

    const isActive = (path) => location.pathname === path;

    return(
        <>
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-3 md:py-4">
                        {/* Logo section */}
                        <Link to="/" className="flex items-center gap-2 md:gap-3 group">
                            <img 
                                src={Logo} 
                                alt="Logo Green Land" 
                                className="w-12 h-12 md:h-16 md:w-16 transition-transform group-hover:scale-110 duration-300"
                            />
                            <div>
                                <h1 className="font-display text-xl md:text-3xl lg:text-4xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                                    GREEN LAND
                                </h1>
                                <p className="font-body text-xs md:text-sm text-gray-600">
                                    Emprendimientos & Inversiones
                                </p>
                            </div>
                        </Link>

                        {/* Menu section - Desktop */}
                        <div className="hidden lg:block">
                            <ul className="flex items-center gap-1 xl:gap-2">
                                {navLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link 
                                            to={link.path}
                                            className={`font-body inline-block py-2 px-4 rounded-lg text-base xl:text-lg font-semibold transition-all duration-300 ${
                                                isActive(link.path)
                                                    ? 'text-green-600 bg-green-50'
                                                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                                            }`}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Icon section - Desktop */}
                        <div className="hidden lg:flex items-center gap-3">
                            <button className="font-body flex bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-11 cursor-pointer rounded-lg justify-center text-base font-semibold gap-2 items-center px-4 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                                <LuCircleDollarSign className="text-xl" /> 
                                Mis Pagos
                            </button>
                            <Link to="/login">
                                <button className="font-body flex bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-11 cursor-pointer rounded-lg justify-center text-base font-semibold gap-2 items-center px-4 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                                    <BsPersonCircle className="text-xl" /> 
                                    Acceder
                                </button>
                            </Link>
                        </div>

                        {/* Mobile hamburger menu button */}
                        <div className="lg:hidden flex items-center">
                            <button 
                                onClick={toggleMenu} 
                                className="text-3xl text-gray-800 focus:outline-none p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isOpen ? <BsX className="text-4xl" /> : <BsList />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
                    onClick={toggleMenu}
                />
            )}

            {/* Mobile Menu Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Header del menú móvil */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <img src={Logo} alt="Logo" className="w-10 h-10" />
                            <div>
                                <h2 className="font-display text-xl font-bold text-gray-800">GREEN LAND</h2>
                                <p className="text-xs text-gray-600">Menú</p>
                            </div>
                        </div>
                        <button 
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <BsX className="text-3xl" />
                        </button>
                    </div>

                    {/* Links del menú móvil */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-2">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.path}
                                    to={link.path} 
                                    onClick={toggleMenu} 
                                    className={`flex items-center px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-200 ${
                                        isActive(link.path)
                                            ? 'bg-green-50 text-green-600 border-l-4 border-green-600'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Botones de acción en mobile */}
                        <div className="mt-6 space-y-3 pt-6 border-t border-gray-200">
                            <button className="font-body flex w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-12 cursor-pointer rounded-lg justify-center text-lg font-semibold gap-2 items-center px-4 transition-all shadow-md">
                                <LuCircleDollarSign className="text-xl" /> 
                                Mis Pagos
                            </button>
                            <Link to="/login" onClick={toggleMenu} className="block">
                                <button className="font-body flex w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 cursor-pointer rounded-lg justify-center text-lg font-semibold gap-2 items-center px-4 transition-all shadow-md">
                                    <BsPersonCircle className="text-xl" /> 
                                    Acceder
                                </button>
                            </Link>
                        </div>
                    </nav>

                    {/* Footer del menú móvil */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <div className="text-center text-sm text-gray-600">
                            <p className="font-semibold">¿Necesitás ayuda?</p>
                            <a 
                                href="https://wa.me/595982640741" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700 font-semibold flex items-center justify-center gap-2 mt-2"
                            >
                                💬 WhatsApp
                            </a>
                            <a 
                                href="tel:+595982640741"
                                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-2 mt-2"
                            >
                                📞 +595 982 640741
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Outlet />
        </>
    )
}