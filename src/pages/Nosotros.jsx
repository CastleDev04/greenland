import familia from "../image/familia.jpg"
import Foter from "../components/Footer"

export default function Nosotros() {
    return(
        <div className="flex flex-col w-full h-full gap-10">
            <div className="bg-green-300 flex flex-col items-center justify-center text-center gap-5 py-6">
                <h1 className="text-2xl font-black">SOBRE GREEN LAND</h1>
                <p className="text-xl">El primer paso hacia tu futuro comienza con ese terreno soñado... y nosotros te ayudamos a conseguirlo</p>
                <img className="w-84 h-84" src={familia} alt="imagen de una familia" />
                <p className="text-xl w-232">GREEN LAND S.R.L. DESARROLLADORA INMOBILIARIA, nos dedicamos a la creacion de barios cerrados que ofrecen un estio de vida excepcional. Nuestra experiencia de 10 años en el desarrollo inmobiliario nos ha permitido construir comunidades seguras, modernas y llenas de vida, donde las familias pueden disfrutar de la tranquilidad y la calidad de vida que merecen.</p>
            </div>
            <div className="bg-white flex flex-col w-full items-center justify-center text-center gap-5">
                <h1 className="text-2xl">¿Por qué elegirnos?</h1>
                <div className="flex  w-3/4 justify-center items-center gap-9">
                    <div className="flex flex-col gap-2 w-72 text-left bg-gray-200 bg-opacity-25 p-5 rounded-md justify-center items-center">
                        <h2 className="text-xl">Seguridad las 24hrs.</h2>
                        <p>Viví con tranquilidad. Nuestro sistema de vigilancia pemanente, control de accesos y personal capacitado cuida lo que más importa: tu familia.</p>
                    </div>
                    <div className="flex flex-col gap-2 w-72 text-left bg-gray-200 bg-opacity-25 p-5 rounded-md justify-center items-center">
                        <h2 className="text-xl">Entornos verdes y mantenimientos constantes</h2>
                        <p>Mantemnemos cada espacio en perfectas condiciones. Desde áreas verdes limpias hasta calles en buen estado, todo está pensado para que disfrutes cada rincón.</p>
                    </div>
                    <div className="flex flex-col gap-2 w-72 text-left bg-gray-200 bg-opacity-25 p-5 rounded-md justify-center items-center">
                        <h2 className="text-xl">Zonas recreativas para grandes y chico</h2>
                        <p>Contamos con espacios deportivos, parques infantiles y zonas comunes para compartir en familia, hacer ejercicio o simplemente relajarte.</p>
                    </div>
                    
                    

                </div>

            </div>
            <Foter></Foter>
        </div>
    )
};
