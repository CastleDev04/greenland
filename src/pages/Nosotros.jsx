import familia from "../image/familia.jpg"
import Foter from "../components/Footer"

export default function Nosotros() {
    return(
        <div className="font-body flex flex-col w-full min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-300 via-green-200 to-emerald-200 flex flex-col items-center justify-center text-center gap-6 py-12 px-4 md:py-16">
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 animate-fade-in">
                    SOBRE GREEN LAND
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl max-w-3xl text-gray-700 font-medium">
                    El primer paso hacia tu futuro comienza con ese terreno soñado... y nosotros te ayudamos a conseguirlo
                </p>
                <img 
                    className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto rounded-xl shadow-2xl my-4 hover:scale-105 transition-transform duration-300" 
                    src={familia} 
                    alt="Familia feliz en su nuevo hogar" 
                />
                <p className="text-left text-base md:text-lg lg:text-xl max-w-4xl px-4 text-gray-700 leading-relaxed">
                    <span className="font-bold text-gray-900">GREEN LAND S.R.L. DESARROLLADORA INMOBILIARIA</span>, nos dedicamos a la creación de barrios cerrados que ofrecen un estilo de vida excepcional. Nuestra experiencia de 10 años en el desarrollo inmobiliario nos ha permitido construir comunidades seguras, modernas y llenas de vida, donde las familias pueden disfrutar de la tranquilidad y la calidad de vida que merecen.
                </p>
            </div>

            {/* Misión y Visión */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-16 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">🎯</span>
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
                                Nuestra Misión
                            </h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Desarrollar comunidades residenciales que transformen la manera de vivir, brindando espacios seguros, sustentables y de alta calidad donde las familias puedan crear sus mejores recuerdos y construir su patrimonio.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">👁️</span>
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
                                Nuestra Visión
                            </h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Ser la desarrolladora inmobiliaria líder en la región, reconocida por la excelencia de nuestros proyectos y por crear comunidades que mejoran la calidad de vida de miles de familias paraguayas.
                        </p>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white flex flex-col w-full items-center justify-center text-center gap-8 py-16 px-4">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-800">
                    ¿Por qué elegirnos?
                </h1>
                <div className="flex flex-wrap max-w-6xl justify-center items-stretch gap-6 md:gap-8">
                    {/* Card 1 */}
                    <div className="flex flex-col gap-3 w-full sm:w-80 md:w-96 text-left bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all p-6 rounded-lg shadow-md hover:shadow-xl border border-blue-200">
                        <h2 className="font-display text-xl md:text-2xl font-bold text-gray-800">
                            🔒 Seguridad las 24 horas
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Viví con tranquilidad. Nuestro sistema de vigilancia permanente, control de accesos y personal capacitado cuida lo que más importa: tu familia.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col gap-3 w-full sm:w-80 md:w-96 text-left bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all p-6 rounded-lg shadow-md hover:shadow-xl border border-green-200">
                        <h2 className="font-display text-xl md:text-2xl font-bold text-gray-800">
                            🌳 Entornos verdes y mantenimiento constante
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Mantenemos cada espacio en perfectas condiciones. Desde áreas verdes limpias hasta calles en buen estado, todo está pensado para que disfrutes cada rincón.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="flex flex-col gap-3 w-full sm:w-80 md:w-96 text-left bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all p-6 rounded-lg shadow-md hover:shadow-xl border border-purple-200">
                        <h2 className="font-display text-xl md:text-2xl font-bold text-gray-800">
                            🏀 Zonas recreativas para grandes y chicos
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Contamos con espacios deportivos, parques infantiles y zonas comunes para compartir en familia, hacer ejercicio o simplemente relajarte.
                        </p>
                    </div>

                    {/* Card 4 - Nueva */}
                    <div className="flex flex-col gap-3 w-full sm:w-80 md:w-96 text-left bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 transition-all p-6 rounded-lg shadow-md hover:shadow-xl border border-yellow-200">
                        <h2 className="font-display text-xl md:text-2xl font-bold text-gray-800">
                            🏗️ Infraestructura de calidad
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Calles pavimentadas, alumbrado público LED, red de agua potable y desagüe pluvial. Construimos pensando en el largo plazo.
                        </p>
                    </div>

                    {/* Card 5 - Nueva */}
                    <div className="flex flex-col gap-3 w-full sm:w-80 md:w-96 text-left bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all p-6 rounded-lg shadow-md hover:shadow-xl border border-red-200">
                        <h2 className="font-display text-xl md:text-2xl font-bold text-gray-800">
                            📈 Inversión inteligente
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Nuestras propiedades se valorizan con el tiempo. Invertir en GREEN LAND es asegurar tu patrimonio y el futuro de tu familia.
                        </p>
                    </div>

                    {/* Card 6 - Nueva */}
                    <div className="flex flex-col gap-3 w-full sm:w-80 md:w-96 text-left bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all p-6 rounded-lg shadow-md hover:shadow-xl border border-indigo-200">
                        <h2 className="font-display text-xl md:text-2xl font-bold text-gray-800">
                            🤝 Financiación flexible
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Ofrecemos planes de pago accesibles y adaptados a tu situación. Tu sueño de tener un terreno propio está más cerca de lo que pensás.
                        </p>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            

            {/* Valores */}
            <div className="bg-white py-16 px-4">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
                    Nuestros Valores
                </h2>
                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">💎</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-gray-800 mb-2">Calidad</h3>
                        <p className="text-gray-600">Compromiso con la excelencia en cada detalle de nuestros proyectos.</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">🛡️</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-gray-800 mb-2">Confianza</h3>
                        <p className="text-gray-600">Transparencia y honestidad en cada paso del camino.</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">🌱</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-gray-800 mb-2">Sostenibilidad</h3>
                        <p className="text-gray-600">Respeto por el medio ambiente en cada desarrollo.</p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            {/* <div className="bg-gradient-to-r from-emerald-500 to-green-500 py-16 px-4 text-center">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                    ¿Listo para dar el primer paso?
                </h2>
                <p className="text-white text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                    Descubrí nuestros proyectos disponibles y encontrá el terreno perfecto para tu familia.
                </p>
                <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-full text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
                    Ver Proyectos Disponibles
                </button>
            </div> */}

            {/* Footer */}
            <Foter />
        </div>
    )
}