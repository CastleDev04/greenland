import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Footer from '../components/Footer';
import LoteamientoCard from '../components/LoteamientoCard';


L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const position =[-25.2894950,-57.6394610]
export default function Propiedades() {
    return(
        <>
            <div className="flex flex-col items-center justify-center gap-7">
                <div className="w-full h-screen">
                    <div className="w-full h-1/2">
                    <MapContainer  center={position} zoom={15} scrollWheelZoom={false} className="w-full h-full z-0 rounded-lg">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                Oficinas de las lomas country
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
                <div className="flex flex-col items-center justify-center gap-5">
                    <h1 className="text-4xl">Propiedades</h1>
                    <LoteamientoCard></LoteamientoCard>
                    <h2 className='text-5xl font-black'>Proximamente Listado de Propiedade Aqui</h2>
                </div> 
                <Footer></Footer>
                </div>
                
                
            </div>
        </>
    )
};
