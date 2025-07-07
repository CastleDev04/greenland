import './App.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"
import Index from "./pages/index.jsx"
import Nosotros from "./pages/Nosotros.jsx"
import Servicios from "./pages/Servicios.jsx"
import Propiedades from "./pages/Propiedades.jsx"
import Contacto from "./pages/Contacto.jsx"

function App() {

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
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
