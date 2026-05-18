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
                {/* Hero - Primera sección */}
                <Hero />

                {/* Promoción */}
                <PromocionSection />

                {/* Loteamiento */}
                <LoteamientoList />

                {/* Propiedades destacadas */}
                <PropiedadesList />

                {/* Noticias */}
                <NoticiasSection />

                {/* Footer */}
                <Foter />
            </div>
        </>
    )
};
