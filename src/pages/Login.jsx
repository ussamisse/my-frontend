import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

      // Primeiro, faz o registro
      await axios.post(`${apiUrl}/auth/register`, form);

      // Em seguida, faz login automático
      const loginRes = await axios.post(`${apiUrl}/auth/login`, form);

      login(loginRes.data.user, loginRes.data.token);
      setSuccess("✅ Registro feito com sucesso!");
      navigate("/vehicles");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(`❌ ${err.response.data.message}`);
      } else {
        setError("❌ Ocorreu um erro durante o registro.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">📝 Criar Conta</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Nome de usuário"
          className="w-full p-2 border border-gray-300 rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 border border-gray-300 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
}

export default Register;
