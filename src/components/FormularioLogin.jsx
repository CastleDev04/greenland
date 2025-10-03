import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from 'lucide-react';

export default function FormularioLogin() {

    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://backend-greenland.onrender.com/api/auth/login",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

       const data = await res.json();
      console.log(res.ok)
      if (!res.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      // Guardar en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));


       console.log("Inicio de sesión exitoso");
      // Redireccionar a /system si todo está bien
      navigate("/system");
    } catch (err) {
        console.error("Error al iniciar sesion:", err);
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

    return(
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm space-y-4 text-white"
                >
                    <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>

                {error && (
                    <div className="bg-red-500 text-white text-sm p-2 rounded">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block mb-1">Correo electrónico</label>
                    <input
                    type="email"
                    className="w-full px-3 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>

                <div>
                    <label className="block mb-1">Contraseña</label>
                    <div className="flex">
                        <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-3 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                        <button type="button" onClick={togglePasswordVisibility} className="px-3 mt-2 text-sm text-blue-400 hover:underline">
                            {showPassword ? <Eye/> : <EyeClosed />}
                        </button>
                    </div>
                    
                </div>

                <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
                >
                    Iniciar Sesión
                </button>

                    <div className="text-center mt-4 text-sm">
                        ¿No tienes cuenta?{" "}
                        <a href="/register" className="text-blue-400 hover:underline">
                            Registrarse
                        </a>
                    </div>
                    </form>
            </div>
    </>
    )
};
