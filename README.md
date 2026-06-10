# Greenland Site Web

Greenland es una aplicación web construida con React y Vite para gestionar un sitio inmobiliario y un panel administrativo. Incluye páginas públicas para clientes, consultas de pagos, y un sistema protegido para administrar propiedades, clientes, ventas, pagos, promociones, noticias y usuarios.

## Características principales

- Navegación pública con rutas: Inicio, Nosotros, Servicios, Propiedades, Contacto, Mis Pagos y consulta por cédula.
- Panel administrativo seguro bajo `/system` con control de acceso por roles.
- Gestión de:
  - Propiedades
  - Clientes
  - Ventas
  - Pagos
  - Fraccionamientos
  - Promociones
  - Noticias
  - Usuarios
- Integración con backend remoto vía API en `https://api.greenlandpy.com/api`.
- Soporte para conexión a Supabase en `src/components/lib/supabaseClient.js`.
- Componente flotante de WhatsApp para contacto directo.
- Diseño con Tailwind CSS y Flowbite.

## Estructura del proyecto

- `src/App.jsx` - Configuración principal de rutas públicas y de sistema.
- `src/main.jsx` - Punto de entrada de React.
- `src/components/` - Componentes de UI reutilizables.
- `src/pages/` - Páginas públicas de la aplicación.
- `src/pages/pagesSystem/` - Vistas del sistema administrativo.
- `src/SystemComponents/` - Componentes del panel administrativo y secciones del sistema.
- `src/service/` - Servicios de acceso a API y lógica de negocio.
- `src/components/lib/` - Configuración de Supabase.
- `public/` - Recursos estáticos.

## Tecnologías utilizadas

- React 19
- Vite
- Tailwind CSS 4
- Flowbite / Flowbite React
- React Router DOM
- React Leaflet + Leaflet
- Supabase JavaScript
- Axios
- ESLint

## Instalación

1. Clona el repositorio:

```bash
git clone <REPOSITORIO>
cd greenland
```

2. Instala dependencias:

```bash
npm install
```

3. Configura variables de entorno / credenciales:

- `src/components/lib/supabaseClient.js` contiene las variables `supabaseUrl` y `supabaseKey`.
- Configura estos valores con tus credenciales de Supabase.

> Nota: actualmente el archivo usa import `dotenv` y placeholders comentados, por lo que debes completarlo manualmente.

4. Ejecuta el proyecto en modo desarrollo:

```bash
npm run dev
```

5. Construye para producción:

```bash
npm run build
```

6. Ver vista previa del build:

```bash
npm run preview
```

## Deploy

La aplicación está preparada para ser desplegada en Netlify. El archivo `netlify.toml` ya incluye una regla de redirección para enviar todas las rutas a `index.html`:

```toml
[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

## Rutas importantes

### Públicas

- `/` - Página de inicio
- `/nosotros` - Sobre la empresa
- `/servicios` - Servicios ofrecidos
- `/propiedades` - Listado de propiedades
- `/propiedades/:id` - Detalle de propiedad
- `/contacto` - Formulario de contacto
- `/mis-pagos` - Consulta de pagos
- `/cedula/:cedula` - Pagos por cédula
- `/login` - Acceso al panel administrativo

### Sistema administrativo

- `/system` - Panel principal
- `/system/clientes`
- `/system/ventas`
- `/system/pagos`
- `/system/fraccionamiento`
- `/system/promociones`
- `/system/noticias`
- `/system/usuarios`
- `/system/reportes`

## Servicios y API

- `src/service/ClientesService.js`
- `src/service/FraccionamientosService.js`
- `src/service/NoticiasService.js`
- `src/service/PagosService.js`
- `src/service/PromocionesService.js`
- `src/service/SupabaseMediaService.js`
- `src/service/usuarioService.js`
- `src/service/VentasService.js`

`src/service/VentasService.js` usa el endpoint base:

```js
const API_BASE_URL = 'https://api.greenlandpy.com/api';
```

## Notas adicionales

- El proyecto usa rutas protegidas y roles: `ADMIN`, `VENDEDOR`, `COBRANZA`, `MODERADOR`.
- Comprueba que el backend remoto y Supabase estén correctamente configurados antes de usar el panel administrativo.
- Si necesitas cambiar estilos, revisa `src/App.css` y `src/index.css`.

## Comandos útiles

- `npm run dev` - Iniciar servidor de desarrollo.
- `npm run build` - Generar build de producción.
- `npm run preview` - Servir el build localmente.
- `npm run lint` - Ejecutar ESLint en el proyecto.

## Sugerencias de mejora

- Añadir un archivo `.env` y configurarlo con variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY` para evitar exponer credenciales en código.
- Documentar la API backend si se planea compartir el proyecto con el equipo.
- Completar los comentarios y validaciones de las secciones administrativas.
