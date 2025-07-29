import promo from "../image/promocionImg.jpg";
import VideoHero from "../components/VideoHero.jsx";

export default function PromocionSection() {
  return (
    <section className="px-4 py-12 bg-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Promociones</h2>
        <p className="text-gray-600">¡Aprovechá las promociones!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
        {/* Imagen de la promo */}
        <div className="w-full">
          <img
            src={promo}
            alt="Imagen de la promo"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Video promocional */}
        <VideoHero />
      </div>
    </section>
  );
}
