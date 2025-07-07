import { useState } from 'react';

export default function Formulario() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Aquí podés conectar con tu backend o servicio externo
    console.log('Formulario enviado:', form);

    // Resetear formulario (opcional)
    setForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <section className="font-body bg-white ">
      <h2 className="md:text-xl font-display font-bold  text-center text-gray-800">Contáctanos</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Nombre */}
        <div className='flex gap-2'>
            <div>
                <label htmlFor="name" className=" text-sm font-medium text-gray-700">Nombre completo</label>
                <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 md:px-4 md:py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div>
                {/* Email */}
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo electrónico</label>
                <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
        </div>
          
             
        </div>

        {/* Asunto */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Asunto</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Mensaje */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-14"
          ></textarea>
        </div>

        {/* Botón */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enviar mensaje
          </button>
        </div>
      </form>
    </section>
  );
}