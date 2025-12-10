import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import LoteamientoList from "../components/LoteamientoList"
import PropiedadesList from "../components/PropiedadesList"
import Foter from "../components/Footer"
import PromocionSection from "../components/PromocionSection.jsx";
import NoticiasSection from "../components/NoticiasSection.jsx";

export default function Index() {
    return(
        <>
        
            
            <div className="flex flex-col gap-24">
                <Hero></Hero>
                <LoteamientoList/>
                <PromocionSection />
                <PropiedadesList/>
                <NoticiasSection />
                <Foter></Foter>
            </div>
        </>
    )
};
