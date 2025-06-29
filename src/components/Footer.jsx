import Logo from "../image/Logo.png"
import { BsFillTelephoneFill, BsFacebook, BsTiktok, BsInstagram, BsTwitter } from "react-icons/bs";

export default function Foter() {
  return (
    <>
      <div className="">
        {/* seccion de footer  */}
        <div className="bg-green-600 p-5 flex flex-wrap justify-between w-full">
          <div className="flex gap-2 items-center">
            <img src={Logo} alt="logo lomas country" className="md:w-16 w-11 md:h-16 h-11" />
            <h2 className="text-md md:text-2xl font-bolt">GREEN LAND</h2>
          </div>

          <div className="flex gap-5">
          {/* Seccion Contacto */}
            <div className="flex flex-col justify-center items-center gap-5">
              <h2 className="text-xl md:text-2xl font-bolt">
                CONTACTO 
              </h2>
              <div >
                <div className="flex gap-4 text-sm justify-center items-center"><BsFillTelephoneFill /> <p>0982 640741</p></div>
              </div>
            </div>
          {/* Seccion de Redes Sociales */}
            <div className="flex flex-col justify-center items-center gap-5">
              <h2 className="text-xl md:text-2xl font-bolt">
                SIGUENOS
              </h2>
              <div className="flex gap-9 md:text-3xl">
                <a href="https://www.instagram.com/laslomascountry/profilecard/?igsh=eGM1dmRsN2xtbDV2"><BsInstagram /></a>
                <a href="https://www.facebook.com/profile.php?id=100094208843098"><BsFacebook /></a>
                <a href="https://www.tiktok.com/@laslomascountry?_t=ZM-8xJINzM00Sz&_r=1"><BsTiktok /></a>
              </div>
            </div>

          </div>
        </div>
        {/* Seccion de footer pie de pagina */}
        <div className="bg-green-700">
          
        </div>
      </div>
    </>
  );
}