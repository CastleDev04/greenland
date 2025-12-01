
export default function Admin({ setCurrentSection }) {

  const navItems = [
    { name: 'Gestión de Propiedades', key: 'propiedades' },
    { name: 'Fraccionamiento', key: 'fraccionamiento' },
    { name: 'Clientes', key: 'clientes' },
    { name: 'Ventas', key: 'ventas' },
    { name: 'Pagos y Financiamiento', key: 'pagos' },
    { name: 'Reportes', key: 'reportes' },
    { name: "Promociones", key: "promociones" },
    { name: 'Usuarios', key: 'usuarios' },
  ];

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-5 justify-between items-center">
        <div className="text-xl font-bold">GREENLAND</div>
        
        <ul className="flex flex-col gap-10 space-x-6">
          {navItems.map(item => (
            <li
              key={item.key}
              className="hover:text-yellow-400 cursor-pointer"
              onClick={() => setCurrentSection(item.key)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      
    </nav>
  );
};
