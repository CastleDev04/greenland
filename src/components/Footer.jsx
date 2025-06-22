import Logo from "../image/Logo.png"
import { BsFillTelephoneFill, BsFacebook, BsTiktok, BsInstagram, BsTwitter } from "react-icons/bs";

export default function Foter() {
  return (
    <>
      <div>
        {/* seccion de footer  */}
        <div className="bg-green-600 p-5 flex justify-between px-14 w-full">
          <div className="flex gap-2 items-center">
            <img src={Logo} alt="logo lomas country" className="w-16 h-16" />
            <h2 className="text-2xl font-bolt">GREEN LAND</h2>
          </div>

          <div className="flex justify-around gap-12">
          {/* Seccion Contacto */}
            <div className="flex flex-col justify-center items-center gap-5">
              <h2 className="text-2xl font-bolt">
                CONTACTO 
              </h2>
              <div >
                <div className="flex gap-4"><BsFillTelephoneFill /> <p>0981 234233</p></div>
                <div className="flex gap-4"><BsFillTelephoneFill /> <p>0982 640741</p></div>
              </div>
            </div>
          {/* Seccion de Redes Sociales */}
            <div className="flex flex-col justify-center items-center gap-5">
              <h2 className="text-2xl font-bolt">
                SIGUENOS
              </h2>
              <div className="flex gap-9 text-3xl">
                <a href=""><BsInstagram /></a>
                <a href=""><BsFacebook /></a>
                <a href=""><BsTiktok /></a>
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