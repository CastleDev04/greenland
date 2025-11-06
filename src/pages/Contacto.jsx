import Footer from '../components/Footer';
import { BsFacebook, BsTiktok, BsInstagram, BsWhatsapp, BsEnvelope, BsGeoAlt, BsClock } from "react-icons/bs";
import Formulario from "../components/Formulario.jsx";

export default function Contacto() {
    return(
        <div className="font-body min-h-screen flex flex-col">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-300 via-green-200 to-emerald-200 py-12 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-display font-black text-gray-800 mb-4">
                    Contactanos
                </h1>
                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                    Estamos aquí para ayudarte a encontrar tu terreno ideal. ¡Hablemos!
                </p>
            </div>

            {/* Main Contact Section */}
            <div className="flex-grow flex flex-col lg:flex-row items-stretch justify-center px-4 py-12 md:py-16 gap-8 max-w-7xl mx-auto w-full">
                {/* Info Card */}
                <div className='flex flex-col bg-gradient-to-br from-green-200 to-emerald-200 rounded-2xl shadow-2xl p-8 lg:w-2/5 gap-6 border border-green-300'>
                    <div className="text-center lg:text-left">
                        <h2 className='text-3xl md:text-4xl font-bold font-display text-gray-800 mb-3'>
                            Información de Contacto
                        </h2>
                        <p className='text-gray-700 text-base md:text-lg leading-relaxed'>
                            Podés comunicarte con nosotros a través de los siguientes medios, o escribir tu mensaje directamente en el formulario.
                        </p>
                    </div>

                    {/* Contact Details */}
                    <div className='flex flex-col gap-5 mt-4'>
                        {/* Ubicación */}
                        <div className='flex items-start gap-4 bg-white bg-opacity-50 p-4 rounded-xl hover:bg-opacity-70 transition-all'>
                            <div className='bg-green-500 text-white p-3 rounded-full text-2xl flex-shrink-0'>
                                <BsGeoAlt />
                            </div>
                            <div>
                                <h3 className='font-display font-bold text-gray-800 mb-1'>Dirección</h3>
                                <p className='text-gray-700'>Nuestra Sra. de la Asunción 1109<br/>Asunción, Paraguay</p>
                            </div>
                        </div>

                        {/* Instagram */}
                        <div className='flex items-start gap-4 bg-white bg-opacity-50 p-4 rounded-xl hover:bg-opacity-70 transition-all'>
                            <div className='bg-pink-500 text-white p-3 rounded-full text-2xl flex-shrink-0'>
                                <BsInstagram />
                            </div>
                            <div>
                                <h3 className='font-display font-bold text-gray-800 mb-1'>Instagram</h3>
                                <a href="https://www.instagram.com/laslomascountry" className='text-gray-700 hover:text-pink-600 transition-colors'>
                                    @laslomascountry
                                </a>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className='flex items-start gap-4 bg-white bg-opacity-50 p-4 rounded-xl hover:bg-opacity-70 transition-all'>
                            <div className='bg-green-600 text-white p-3 rounded-full text-2xl flex-shrink-0'>
                                <BsWhatsapp />
                            </div>
                            <div>
                                <h3 className='font-display font-bold text-gray-800 mb-1'>WhatsApp</h3>
                                <a href="https://wa.me/595982640741" className='text-gray-700 hover:text-green-600 transition-colors'>
                                    +595 982 640741
                                </a>
                            </div>
                        </div>

                        {/* Email */}
                        <div className='flex items-start gap-4 bg-white bg-opacity-50 p-4 rounded-xl hover:bg-opacity-70 transition-all'>
                            <div className='bg-blue-500 text-white p-3 rounded-full text-2xl flex-shrink-0'>
                                <BsEnvelope />
                            </div>
                            <div>
                                <h3 className='font-display font-bold text-gray-800 mb-1'>Email</h3>
                                <a href="mailto:info@greenland.com.py" className='text-gray-700 hover:text-blue-600 transition-colors'>
                                    info@greenland.com.py
                                </a>
                            </div>
                        </div>

                        {/* Horario */}
                        <div className='flex items-start gap-4 bg-white bg-opacity-50 p-4 rounded-xl hover:bg-opacity-70 transition-all'>
                            <div className='bg-purple-500 text-white p-3 rounded-full text-2xl flex-shrink-0'>
                                <BsClock />
                            </div>
                            <div>
                                <h3 className='font-display font-bold text-gray-800 mb-1'>Horario de atención</h3>
                                <p className='text-gray-700'>Lunes a Viernes: 8:00 - 18:00<br/>Sábados: 8:00 - 13:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className='mt-6'>
                        <h3 className='font-display font-bold text-gray-800 text-lg mb-4 text-center lg:text-left'>
                            Seguinos en redes sociales
                        </h3>
                        <div className="flex gap-4 justify-center lg:justify-start">
                            <a 
                                href="https://www.instagram.com/laslomascountry/profilecard/?igsh=eGM1dmRsN2xtbDV2" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 rounded-full text-2xl hover:scale-110 transition-transform shadow-lg hover:shadow-xl"
                                aria-label="Instagram"
                            >
                                <BsInstagram />
                            </a>
                            <a 
                                href="https://www.facebook.com/profile.php?id=100094208843098" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white p-4 rounded-full text-2xl hover:scale-110 transition-transform shadow-lg hover:shadow-xl"
                                aria-label="Facebook"
                            >
                                <BsFacebook />
                            </a>
                            <a 
                                href="https://www.tiktok.com/@laslomascountry?_t=ZM-8xJINzM00Sz&_r=1" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-gray-900 text-white p-4 rounded-full text-2xl hover:scale-110 transition-transform shadow-lg hover:shadow-xl"
                                aria-label="TikTok"
                            >
                                <BsTiktok />
                            </a>
                            <a 
                                href="https://wa.me/595982640741" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-green-500 text-white p-4 rounded-full text-2xl hover:scale-110 transition-transform shadow-lg hover:shadow-xl"
                                aria-label="WhatsApp"
                            >
                                <BsWhatsapp />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className='flex flex-col bg-white rounded-2xl shadow-2xl p-8 lg:w-3/5 gap-6 border border-gray-200'>
                    <div className="text-center lg:text-left">
                        <h2 className='text-3xl md:text-4xl font-bold font-display text-gray-800 mb-3'>
                            Mandanos un Mensaje
                        </h2>
                        <p className='text-gray-600 text-base md:text-lg'>
                            Completá el formulario y nos pondremos en contacto con vos a la brevedad.
                        </p>
                    </div>
                    <Formulario />
                </div>
            </div>

            {/* Map Section (Optional) */}
            {/* <div className="bg-gray-100 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-800 mb-8">
                        ¿Dónde Encontrarnos?
                    </h2>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5944848938447!2d-57.59!3d-25.28!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDE2JzQ4LjAiUyA1N8KwMzUnMjQuMCJX!5e0!3m2!1sen!2spy!4v1234567890"
                            width="100%" 
                            height="450" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ubicación Green Land"
                            className="w-full"
                        ></iframe>
                    </div>
                </div>
            </div> */}

            {/* FAQ Section */}
            <div className="bg-white py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-800 mb-12">
                        Preguntas Frecuentes
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="font-display font-bold text-xl text-gray-800 mb-2">
                                ¿Cuál es el horario de atención?
                            </h3>
                            <p className="text-gray-600">
                                Atendemos de lunes a viernes de 8:00 a 18:00 hs, y los sábados de 8:00 a 13:00 hs.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="font-display font-bold text-xl text-gray-800 mb-2">
                                ¿Puedo visitar los terrenos disponibles?
                            </h3>
                            <p className="text-gray-600">
                                ¡Por supuesto! Coordiná una visita con nosotros llamando o escribiendo por WhatsApp, y te mostraremos todos nuestros proyectos disponibles.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="font-display font-bold text-xl text-gray-800 mb-2">
                                ¿Ofrecen planes de financiación?
                            </h3>
                            <p className="text-gray-600">
                                Sí, contamos con diversos planes de financiación adaptados a tus necesidades. Consultanos para más detalles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 py-12 px-4 text-center">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                    ¿Preferís hablar directamente?
                </h2>
                <p className="text-white text-lg mb-6 max-w-2xl mx-auto">
                    Llamanos o escribinos por WhatsApp y te atenderemos de inmediato
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                        href="tel:+595982640741"
                        className="bg-white text-green-600 font-bold py-4 px-8 rounded-full text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center gap-2"
                    >
                        📞 Llamar Ahora
                    </a>
                    <a 
                        href="https://wa.me/595982640741"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center gap-2"
                    >
                        <BsWhatsapp /> WhatsApp
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    )
}