import { useNavigate } from 'react-router-dom';

export default function Admin() {

  const navigate = useNavigate();

  const navItems = [
    { name: 'Gestión de Propiedades', path: '/system/' },
    { name: 'Fraccionamiento', path: '/system/fraccionamiento' },
    { name: 'Clientes', path: '/system/clientes' },
    { name: 'Ventas', path: '/system/ventas' },
    { name: 'Pagos y Financiamiento', path: '/system/pagos' },
    { name: 'Reportes', path: '/system/reportes' },
    { name: "Promociones", path: "/system/promociones" },
    { name: "Noticias", path: "/system/noticias" },
    { name: 'Usuarios', path: '/system/usuarios' },
  ];

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-5 justify-between items-center">
        <div className="text-xl font-bold">GREENLAND</div>
        
        <ul className="flex flex-col gap-10 space-x-6">
          {navItems.map(item => (
            <li
              key={item.path}
              className="hover:text-yellow-400 cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      
    </nav>
  );
};
