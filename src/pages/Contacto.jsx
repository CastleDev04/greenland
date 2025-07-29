import Footer from '../components/Footer';
import { BsFacebook, BsTiktok, BsInstagram } from "react-icons/bs";
import Formulario from "../components/Formulario.jsx";

export default function Contacto() {
    return(
        <div >
            <div className="flex flex-col md:flex-row font-body items-center justify-center ">
                <div className='flex flex-col items-center  p-5 justify-center bg-green-200 gap-5 w-100 h-136 rounded-bl-2xl rounded-tl-2xl'>
                    <h2 className='text-2xl font-bold font-display'>Información de contacto</h2>
                    <p className='text-left md:text-center'>Puede comunicarte con nosotros a través de los siguientes medios. O puedes escribir tu mensaje directamente en el formulario.</p>
                    <ul className='flex flex-col items-center justify-center gap-2 text-sm md:text-lg'>
                        <li>Nuestra Sra. de la Asuncion 1109-Asuncion</li>
                        <li>@laslomascountry</li>
                        <li>+595 982 640741</li>
                    </ul>
                    <div  className="flex gap-9 md:text-3xl">
                        <a href="https://www.instagram.com/laslomascountry/profilecard/?igsh=eGM1dmRsN2xtbDV2"><BsInstagram /></a>
                        <a href="https://www.facebook.com/profile.php?id=100094208843098"><BsFacebook /></a>
                        <a href="https://www.tiktok.com/@laslomascountry?_t=ZM-8xJINzM00Sz&_r=1"><BsTiktok /></a>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center gap-5 w-120 h-screen'>
                    <h2 className='text-2xl font-bold font-display'>Mandanos un mensaje</h2>
                    <Formulario></Formulario>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
};
