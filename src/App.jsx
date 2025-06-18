import './App.css'

import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import LoteamientoList from "./components/LoteamientoList"
import PropiedadesList from "./components/PropiedadesList"
import Foter from "./components/Footer"

function App() {

  return (
    <>
      <div className="overflow-x-hidden">
        <Navbar></Navbar>
      </div>
      <div className="flex flex-col gap-24">
        <Hero></Hero>
        <LoteamientoList/>
        <PropiedadesList/>
        <Foter></Foter>
      </div>
    </>
  )
}

export default App
