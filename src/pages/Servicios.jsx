import Foter from "../components/Footer"
import aguateria from "../image/aguateria.jpg"
import limpieza from "../image/limpieza.jpg"
import construccion from "../image/construccion.jpg"
import calle from "../image/calle.jpg"

export default function Servicios() {
    return(
        <>
        <div className="font-body flex flex-col w-full min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-300 via-green-200 to-emerald-200 py-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-display font-black text-gray-800 mb-4">
                    Nuestros Servicios
                </h1>
                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                    Soluciones integrales para el desarrollo de tu propiedad. Desde la preparación del terreno hasta la construcción de tu hogar soñado.
                </p>
            </div>

            {/* Services Grid - Interactive */}
            <div className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Aguatería */}
                        <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-80 md:h-96">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                                style={{ backgroundImage: `url(${aguateria})` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            </div>
                            <div className="relative h-full flex flex-col justify-end p-8 text-white">
                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 transform group-hover:translate-y-0 translate-y-2 transition-transform">
                                    💧 Aguatería
                                </h2>
                                <p className="text-base md:text-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    Instalación completa de sistemas de agua potable. Conexiones seguras y certificadas para garantizar el suministro constante de agua en tu propiedad.
                                </p>
                            </div>
                        </div>

                        {/* Limpieza de Terreno */}
                        <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-80 md:h-96">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                                style={{ backgroundImage: `url(${limpieza})` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            </div>
                            <div className="relative h-full flex flex-col justify-end p-8 text-white">
                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 transform group-hover:translate-y-0 translate-y-2 transition-transform">
                                    🌿 Limpieza de Terreno
                                </h2>
                                <p className="text-base md:text-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    Preparación profesional del terreno: desmonte, nivelación y limpieza total. Dejamos tu espacio listo para construir.
                                </p>
                            </div>
                        </div>

                        {/* Construcciones */}
                        <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-80 md:h-96">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                                style={{ backgroundImage: `url(${construccion})` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            </div>
                            <div className="relative h-full flex flex-col justify-end p-8 text-white">
                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 transform group-hover:translate-y-0 translate-y-2 transition-transform">
                                    🏗️ Construcciones
                                </h2>
                                <p className="text-base md:text-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    Construcción de viviendas con materiales de primera calidad. Convertimos tus planos en realidad con equipos profesionales.
                                </p>
                            </div>
                        </div>

                        {/* Caminos */}
                        <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-80 md:h-96">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                                style={{ backgroundImage: `url(${calle})` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            </div>
                            <div className="relative h-full flex flex-col justify-end p-8 text-white">
                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 transform group-hover:translate-y-0 translate-y-2 transition-transform">
                                    🛣️ Caminos
                                </h2>
                                <p className="text-base md:text-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    Pavimentación y construcción de vías de acceso. Calles internas con asfalto o empedrado de alta durabilidad.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Servicios Adicionales */}
            <div className="bg-white py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-800 mb-12">
                        Servicios Complementarios
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-blue-200">
                            <div className="text-4xl mb-4">⚡</div>
                            <h3 className="font-display text-xl font-bold text-gray-800 mb-3">
                                Instalaciones Eléctricas
                            </h3>
                            <p className="text-gray-600">
                                Cableado completo, conexión a red eléctrica y sistema de iluminación exterior para todo el barrio.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-green-200">
                            <div className="text-4xl mb-4">🌳</div>
                            <h3 className="font-display text-xl font-bold text-gray-800 mb-3">
                                Paisajismo
                            </h3>
                            <p className="text-gray-600">
                                Diseño y mantenimiento de áreas verdes, plantación de árboles y creación de espacios naturales.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-purple-200">
                            <div className="text-4xl mb-4">🚧</div>
                            <h3 className="font-display text-xl font-bold text-gray-800 mb-3">
                                Cercos Perimetrales
                            </h3>
                            <p className="text-gray-600">
                                Construcción de muros y cercos de seguridad para delimitar y proteger tu propiedad.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-yellow-200">
                            <div className="text-4xl mb-4">💡</div>
                            <h3 className="font-display text-xl font-bold text-gray-800 mb-3">
                                Alumbrado Público
                            </h3>
                            <p className="text-gray-600">
                                Sistema de iluminación LED de bajo consumo para todas las calles y espacios comunes.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-red-200">
                            <div className="text-4xl mb-4">🏊</div>
                            <h3 className="font-display text-xl font-bold text-gray-800 mb-3">
                                Áreas Recreativas
                            </h3>
                            <p className="text-gray-600">
                                Construcción de parques, canchas deportivas y zonas de esparcimiento familiar.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-indigo-200">
                            <div className="text-4xl mb-4">📋</div>
                            <h3 className="font-display text-xl font-bold text-gray-800 mb-3">
                                Asesoría Legal
                            </h3>
                            <p className="text-gray-600">
                                Gestión de escrituras, trámites municipales y toda la documentación necesaria.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Proceso de Trabajo */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-800 mb-4">
                        Nuestro Proceso de Trabajo
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Trabajamos de manera ordenada y profesional para garantizar resultados de excelencia
                    </p>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                                1
                            </div>
                            <h3 className="font-display font-bold text-lg mb-2">Consulta Inicial</h3>
                            <p className="text-gray-600 text-sm">Evaluamos tus necesidades y presupuesto</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                                2
                            </div>
                            <h3 className="font-display font-bold text-lg mb-2">Planificación</h3>
                            <p className="text-gray-600 text-sm">Diseñamos el plan de trabajo detallado</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                                3
                            </div>
                            <h3 className="font-display font-bold text-lg mb-2">Ejecución</h3>
                            <p className="text-gray-600 text-sm">Realizamos el trabajo con calidad garantizada</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                                4
                            </div>
                            <h3 className="font-display font-bold text-lg mb-2">Entrega</h3>
                            <p className="text-gray-600 text-sm">Verificamos que todo esté perfecto</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            {/* <div className="bg-gradient-to-r from-emerald-500 to-green-500 py-16 px-4 text-center">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                    ¿Necesitás alguno de nuestros servicios?
                </h2>
                <p className="text-white text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                    Contáctanos para recibir una cotización personalizada y sin compromiso
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-full text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
                        Solicitar Cotización
                    </button>
                    <button className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-white hover:text-green-600 transition-colors shadow-lg">
                        Ver Proyectos
                    </button>
                </div>
            </div> */}
        </div>
        <Foter />
        </>
    )
}