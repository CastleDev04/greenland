import React from "react";
import { Navigate } from "react-router-dom";

export default function Protected({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Si no hay token → redirige al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta requiere roles y el usuario no los tiene
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  // Todo bien → muestra el contenido
  return children;
}