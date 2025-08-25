import Logo from "../image/Logo.png"
import { BsFillTelephoneFill, BsFacebook, BsTiktok, BsInstagram, BsTwitter, BsEnvelope, BsGeoAlt } from "react-icons/bs";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="font-body bg-gradient-to-b from-green-600 to-green-700 text-white">
      {/* Sección principal del footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo y descripción */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={Logo} 
                alt="Logo Green Land" 
                className="w-12 h-12 md:w-16 md:h-16 rounded-lg shadow-lg" 
              />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
                  GREEN LAND
                </h2>
                <p className="text-green-100 text-sm">Tu hogar en la naturaleza</p>
              </div>
            </div>
            <p className="text-green-100 leading-relaxed mb-4 max-w-md">
              Descubre la tranquilidad y elegancia en nuestro exclusivo complejo residencial. 
              Espacios diseñados para tu bienestar y el de tu familia.
            </p>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white border-b-2 border-green-400 pb-2 inline-block">
              CONTACTO
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-100 hover:text-white transition-colors">
                <BsFillTelephoneFill className="text-green-300 flex-shrink-0" />
                <a href="tel:+595982640741" className="hover:underline">
                  +595 982 640741
                </a>
              </div>
              <div className="flex items-center gap-3 text-green-100 hover:text-white transition-colors">
                <BsEnvelope className="text-green-300 flex-shrink-0" />
                <a href="mailto:info@greenland.com.py" className="hover:underline">
                  info@greenland.com.py
                </a>
              </div>
              <div className="flex items-start gap-3 text-green-100">
                <BsGeoAlt className="text-green-300 flex-shrink-0 mt-1" />
                <div>
                  <p>Asunción, Paraguay</p>
                  <p className="text-sm opacity-90">Zona residencial premium</p>
                </div>
              </div>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white border-b-2 border-green-400 pb-2 inline-block">
              SÍGUENOS
            </h3>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://www.instagram.com/laslomascountry/profilecard/?igsh=eGM1dmRsN2xtbDV2"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-pink-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                aria-label="Síguenos en Instagram"
              >
                <BsInstagram className="text-xl" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=100094208843098"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-blue-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                aria-label="Síguenos en Facebook"
              >
                <BsFacebook className="text-xl" />
              </a>
              <a 
                href="https://www.tiktok.com/@laslomascountry?_t=ZM-8xJINzM00Sz&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-black p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                aria-label="Síguenos en TikTok"
              >
                <BsTiktok className="text-xl" />
              </a>
            </div>
            
            {/* Newsletter */}
            <div className="mt-6 pt-6 border-t border-green-500">
              <h4 className="font-semibold mb-3 text-green-100">Newsletter</h4>
              <p className="text-sm text-green-200 mb-3">
                Recibe noticias y ofertas exclusivas
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-green-400 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
                />
                <button className="bg-green-400 hover:bg-green-300 px-4 py-2 rounded-lg font-semibold text-green-800 transition-colors text-sm">
                  Suscribir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div className="mt-12 pt-8 border-t border-green-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-3 text-white">Servicios</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-white transition-colors">Venta de lotes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Construcción</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Asesoría</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Empresa</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Proyectos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimonios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Soporte</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Legal</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <div className="bg-green-800 border-t border-green-600">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-green-200 text-sm">
                © {currentYear} Green Land. Todos los derechos reservados.
              </p>
              <p className="text-green-300 text-xs mt-1">
                Desarrollado con 💚 en Paraguay
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-green-200">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
              <span className="hidden md:block">|</span>
              <a href="#" className="hover:text-white transition-colors">Términos de Uso</a>
              <span className="hidden md:block">|</span>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}