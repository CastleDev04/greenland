import './App.css'
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"
import PropiedadDetalle from "./components/PropiedadDetalle"
import WhatsAppButton from "./components/WhaatsAppButton"
import Index from "./pages/index.jsx"
import Nosotros from "./pages/Nosotros.jsx"
import MisPagos from "./pages/MisPagos.jsx"
import PagosPorCedula from "./pages/PagosPorCedula.jsx"
import Servicios from "./pages/Servicios.jsx"
import Propiedades from "./pages/Propiedades.jsx"
import Contacto from "./pages/Contacto.jsx"
import FormularioAdmin from "./pages/pagesSystem/FormularioAdmin.jsx"
import Protected from "./components/componentsSystem/Protected.jsx"
import AdminLayout from "./pages/pagesSystem/AdminLayout.jsx"

// Componentes del sistema
import PropiedadesSection from "./components/componentsSystem/PropiedadesSection.jsx";
import ClienteSection from './SystemComponents/SystemSection/ClientesSection.jsx';
import VentasSection from './SystemComponents/SystemSection/VentasSection.jsx';
import PagosSection from './SystemComponents/SystemSection/PagosSection.jsx';
import FraccionamientoSection from './SystemComponents/SystemSection/FraccionamientoSection.jsx';
import UsuariosSection from './SystemComponents/SystemSection/UsuariosSection.jsx';
import PromocionesSection from './SystemComponents/SystemSection/PromocionesSection.jsx';
import NoticiasSection from './SystemComponents/SystemSection/NoticiasSection.jsx'

// Páginas protegidas
const AdminPropiedades = () => (
  <Protected allowedRoles={["ADMIN","VENDEDOR","COBRANZA","MODERADOR"]}>
    <PropiedadesSection />
  </Protected>
);

const AdminClientes = () => (
  <Protected allowedRoles={["ADMIN","VENDEDOR","COBRANZA","MODERADOR"]}>
    <ClienteSection />
  </Protected>
);

const AdminVentas = () => (
  <Protected allowedRoles={["ADMIN","VENDEDOR","COBRANZA","MODERADOR"]}>
    <VentasSection />
  </Protected>
);

const AdminPagos = () => (
  <Protected allowedRoles={["ADMIN","VENDEDOR","COBRANZA","MODERADOR"]}>
    <PagosSection />
  </Protected>
);

const AdminFraccionamiento = () => (
  <Protected allowedRoles={["ADMIN","VENDEDOR","COBRANZA","MODERADOR"]}>
    <FraccionamientoSection />
  </Protected>
);

const AdminReportes = () => (
  <Protected allowedRoles={["ADMIN","VENDEDOR","COBRANZA","MODERADOR"]}>
    <h1>Sección de reportes</h1>
  </Protected>
);

const AdminPromociones = () => (
  <Protected allowedRoles={["ADMIN","VENDEDOR","COBRANZA","MODERADOR"]}>
    <PromocionesSection />
  </Protected>
);

const AdminNoticias = () => (
  <Protected allowedRoles={["ADMIN","VENDEDOR","COBRANZA","MODERADOR"]}>
    <NoticiasSection />
  </Protected>
);

const AdminUsuarios = () => (
  <Protected allowedRoles={["ADMIN","VENDEDOR","COBRANZA","MODERADOR"]}>
    <UsuariosSection />
  </Protected>
);

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas con Navbar */}
          <Route path="/" element={<Navbar />}>
            <Route index element={<Index />} />
            <Route path="nosotros" element={<Nosotros />} />
            <Route path="servicios" element={<Servicios />} />
            <Route path="propiedades" element={<Propiedades />} />
            <Route path="propiedades/:id" element={<PropiedadDetalle />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="mis-pagos" element={<MisPagos />} />
            <Route path="cedula/:cedula" element={<PagosPorCedula />} />
            <Route path="login" element={<FormularioAdmin />} />
          </Route>

          {/* Rutas del sistema con AdminLayout (Navbar + Admin Sidebar) */}
          <Route path="system" element={<AdminLayout />}>
            <Route index element={<AdminPropiedades />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="ventas" element={<AdminVentas />} />
            <Route path="pagos" element={<AdminPagos />} />
            <Route path="fraccionamiento" element={<AdminFraccionamiento />} />
            <Route path="reportes" element={<AdminReportes />} />
            <Route path="promociones" element={<AdminPromociones />} />
            <Route path="noticias" element={<AdminNoticias />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <WhatsAppButton />
    </>
  )
}

export default App