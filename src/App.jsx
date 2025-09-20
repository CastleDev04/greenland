import './App.css'
import React, { useState } from 'react';
import State from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"
import WhatsAppButton from "./components/WhaatsAppButton"
import Index from "./pages/index.jsx"
import Nosotros from "./pages/Nosotros.jsx"
import Servicios from "./pages/Servicios.jsx"
import Propiedades from "./pages/Propiedades.jsx"
import Contacto from "./pages/Contacto.jsx"
import FormularioAdmin from "./pages/pagesSystem/FormularioAdmin.jsx"
import Admin from "./pages/pagesSystem/Admin.jsx"
import PropiedadesSection from "./components/componentsSystem/PropiedadesSection.jsx";
import Protected from "./components/componentsSystem/Protected.jsx"
import ClienteSection from './SystemComponents/SystemSection/ClientesSection.jsx';
import VentasSection from './SystemComponents/SystemSection/VentasSection.jsx';



function App() {
   const [currentSection, setCurrentSection] = useState('propiedades');

  const renderSection = () => {
    switch (currentSection) {
      case 'propiedades':
        return <PropiedadesSection/>;
      case "clientes":
        return <ClienteSection/>;
      case 'fraccionamiento':
        return <h1>Seccion de fraccionamiento</h1>;
      case 'ventas':
        return <VentasSection/>;
      case 'pagos':
        return <h1>Seccion de Pagos</h1>;
      case 'reportes':
        return <h1>Seccion de reportes</h1>;
      case 'usuarios':
        return <h1>Seccion de usuarios</h1>;
      default:
        return <PropiedadesSection/>;
    }
  };

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Index />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="propiedades" element={<Propiedades />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="login" element={<FormularioAdmin />} />
          <Route path="system" element={ 
            <div className="flex">
              <Protected allowedRoles={["ADMIN","VENDEDOR","COBRANZA","MODERADOR"]}>
                <Admin setCurrentSection={setCurrentSection} />
                <main className="min-h-screen w-full bg-gray-100">{renderSection()}</main>
              </Protected>
              
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
    <WhatsAppButton />
    </>
  )
}

export default App
