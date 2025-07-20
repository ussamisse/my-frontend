import React, { useEffect, useState } from "react";
import axios from "axios";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [plateNumber, setPlateNumber] = useState("");
  const [model, setModel] = useState("");
  const [owner, setOwner] = useState("");
  const [driverId, setDriverId] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // Carrega veículos e motoristas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, driversRes] = await Promise.all([
          axios.get(`${API}/vehicles`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/drivers`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setVehicles(vehiclesRes.data);
        setDrivers(driversRes.data);
      } catch (err) {
        alert("Erro ao buscar dados. Faça login novamente.");
      }
    };
    fetchData();
  }, [API, token]);

  const resetForm = () => {
    setEditId(null);
    setPlateNumber("");
    setModel("");
    setOwner("");
    setDriverId("");
    setShowForm(false);
  };

  const openFormCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!driverId) return alert("Selecione um motorista!");

    const data = {
      plate_number: plateNumber,
      model,
      owner,
      driver_id: driverId,
    };

    try {
      const res = editId
        ? await axios.put(`${API}/vehicles/${editId}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.post(`${API}/vehicles`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });

      setVehicles(prev =>
        editId ? prev.map(v => (v.id === editId ? res.data : v)) : [...prev, res.data]
      );

      resetForm();
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      alert(`Erro ao ${editId ? "atualizar" : "cadastrar"} veículo: ${msg}`);
    }
  };

  const handleEdit = (v) => {
    setEditId(v.id);
    setPlateNumber(v.plate_number);
    setModel(v.model);
    setOwner(v.owner);
    setDriverId(v.driver_id?.toString() || "");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Deseja realmente excluir este veículo?")) return;
    try {
      await axios.delete(`${API}/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      alert("Erro ao deletar: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🚗 Veículos</h2>

      {user?.role === "admin" && (
        <>
          <button
            onClick={openFormCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            {editId ? "✏️ Editar Veículo" : "➕ Novo Veículo"}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium">Placa</label>
                <input
                  value={plateNumber}
                  onChange={e => setPlateNumber(e.target.value)}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Modelo</label>
                <input
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Proprietário</label>
                <input
                  value={owner}
                  onChange={e => setOwner(e.target.value)}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Motorista</label>
                <select
                  value={driverId}
                  onChange={e => setDriverId(e.target.value)}
                  required
                  className="w-full border rounded p-2"
                >
                  <option value="">Selecione um motorista</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} – {d.license_number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {editId ? "Atualizar" : "Cadastrar"}
                </button>
                {editId && (
                  <button type="button" onClick={resetForm} className="text-gray-700 underline">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}
        </>
      )}

      <ul className="space-y-2">
        {vehicles.map(v => (
          <li key={v.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <strong>{v.plate_number}</strong> – {v.model} <br />
              <span className="text-sm text-gray-600">Proprietário: {v.owner}</span>
            </div>
            {user?.role === "admin" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(v)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Excluir
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Vehicles;
