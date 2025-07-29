import { useEffect, useState } from "react";

const WhatsAppButton = () => {
  const [visible, setVisible] = useState(false);
  const phoneNumber = "595987126491"; // ← Reemplaza con tu número de WhatsApp (sin + ni espacios)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 200); // Mostrar solo cuando se scrollea hacia abajo más de 200px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    visible && (
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          width="28"
          height="28"
        >
          <path d="M12.04 2.003a9.943 9.943 0 00-8.95 14.337l-1.058 3.868 3.945-1.036a9.943 9.943 0 0014.343-8.953A9.948 9.948 0 0012.04 2.003zm0 17.937a7.994 7.994 0 01-4.08-1.122l-.292-.172-2.34.614.623-2.284-.179-.296a7.99 7.99 0 01-.126-8.026 8.005 8.005 0 0114.623 4.51 8 8 0 01-8.23 6.776zm4.512-5.925c-.248-.124-1.471-.726-1.698-.81-.227-.084-.392-.124-.557.124s-.64.81-.786.978c-.145.165-.29.186-.538.062-.248-.124-1.046-.386-1.99-1.232-.736-.656-1.232-1.466-1.377-1.714-.145-.248-.015-.382.11-.505.112-.111.248-.29.373-.434.125-.145.165-.248.248-.414.082-.165.041-.31-.021-.434-.062-.124-.557-1.344-.762-1.838-.2-.48-.403-.415-.557-.424l-.475-.008a.92.92 0 00-.665.31c-.228.248-.89.868-.89 2.12s.91 2.458 1.038 2.63c.124.165 1.783 2.72 4.323 3.81.604.26 1.073.414 1.44.53.605.192 1.155.165 1.59.1.485-.072 1.471-.602 1.678-1.185.207-.582.207-1.08.145-1.185-.062-.103-.227-.165-.475-.289z" />
        </svg>
      </a>
    )
  );
};

export default WhatsAppButton;