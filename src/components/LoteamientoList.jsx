import LoteamientoCard from "./LoteamientoCard"

export default function LoteamientoList() {
    return(
        <>
            {/* Listado de Loteamiento disponibles */}
            <div className="flex flex-col justify-center items-center gap-16">
                <h1 className="text-3xl font-bold">Loteadoras</h1>
                {/* Seccion de cartas de loteadoras */}
                <div className="md:p-14">
                    <LoteamientoCard/>
                </div>
            </div>
        </>
    )
};
