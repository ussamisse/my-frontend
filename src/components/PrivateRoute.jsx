import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // Se não tiver token, redireciona para /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se tiver token, mostra o conteúdo
  return children;
}

export default PrivateRoute;
