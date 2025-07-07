import PropiedadesCard from './PropiedadesCard.jsx';
import { Carousel } from "flowbite-react";
import Casa from "../image/casa-lomas-country.jpg";
import Barrio from "../image/imagen-lomas-country-barrio1.jpg";
import Barrio2 from "../image/imagen-lomas-country-barrio2.jpg";

export default function PropiedadesList() {
    const Lotes=[{
        imagen: "../image/casa-lomas-country.jpg",
        titulo: "Las Lomas Country - Casa",
        ubicacion: "Loma Grande",
        superficie: "57 m²",
        precio: "280.000.000"
    }, {
        imagen: "../image/imagen-lomas-country-barrio1.jpg",
        titulo: "Las Lomas Country - Terreno",
        ubicacion: "Loma Grande",
        superficie: "57 m²",
        precio: "92.400.000"
    }, {
        imagen: "../image/imagen-lomas-country-barrio2.jpg",
        titulo: "Las Lomas Country - Terreno",
        ubicacion: "Loma Grande",
        superficie: "57 m²",
        precio: "99.000.000"
    }]
    return(
        <>
            <div className="flex flex-col justify-center items-center gap-16 bg-green-300 md:p-8">
                <div>
                    <h2 className="text-center text-3xl font-bold font-display">Propiedades Destacadas</h2>
                </div>
                <div className="hidden md:flex flex-wrap gap-22 items-center justify-around">
                    {
                        <PropiedadesCard 
                            key={0}
                            imagen={Casa}
                            titulo={Lotes[0].titulo} 
                            ubicacion={Lotes[0].ubicacion} 
                            superficie={Lotes[0].superficie} 
                            precio={Lotes[0].precio} 
                        />
                    }
                    {
                        <PropiedadesCard 
                            key={1}
                            imagen={Barrio}
                            titulo={Lotes[1].titulo} 
                            ubicacion={Lotes[1].ubicacion} 
                            superficie={Lotes[1].superficie} 
                            precio={Lotes[1].precio} 
                        />
                    }
                    {
                        <PropiedadesCard 
                            key={2}
                            imagen={Barrio2}
                            titulo={Lotes[2].titulo} 
                            ubicacion={Lotes[2].ubicacion} 
                            superficie={Lotes[2].superficie} 
                            precio={Lotes[2].precio} 
                        />
                    }
                </div>
                <div className="md:hidden h-full w-72">
                    <Carousel slideInterval={5000}>
                        {
                        <PropiedadesCard 
                            key={0}
                            imagen={Casa}
                            titulo={Lotes[0].titulo} 
                            ubicacion={Lotes[0].ubicacion} 
                            superficie={Lotes[0].superficie} 
                            precio={Lotes[0].precio} 
                        />
                    }
                    {
                        <PropiedadesCard 
                            key={1}
                            imagen={Barrio}
                            titulo={Lotes[1].titulo} 
                            ubicacion={Lotes[1].ubicacion} 
                            superficie={Lotes[1].superficie} 
                            precio={Lotes[1].precio} 
                        />
                    }
                    {
                        <PropiedadesCard 
                            key={2}
                            imagen={Barrio2}
                            titulo={Lotes[2].titulo} 
                            ubicacion={Lotes[2].ubicacion} 
                            superficie={Lotes[2].superficie} 
                            precio={Lotes[2].precio} 
                        />
                    }
                    </Carousel>
                </div>
            </div>
        </>
    )
};
