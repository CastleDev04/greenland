import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import LoteamientoList from "../components/LoteamientoList"
import PropiedadesList from "../components/PropiedadesList"
import Foter from "../components/Footer"


export default function Index() {
    return(
        <>
        
            
            <div className="flex flex-col gap-24">
                <Hero></Hero>
                <LoteamientoList/>
                <PropiedadesList/>
                <Foter></Foter>
            </div>
        </>
    )
};
