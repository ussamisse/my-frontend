// src/pages/Vehicles.jsx
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

  useEffect(() => {
    // Buscar veículos e motoristas
    axios
      .get("http://localhost:4000/vehicles", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setVehicles(res.data))
      .catch(() => alert("Access denied. Please log in."));
    axios
      .get("http://localhost:4000/drivers", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setDrivers(res.data))
      .catch(err => console.error("Erro ao buscar motoristas:", err));
  }, [token]);

  const openFormCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = editId
        ? await axios.put(
            `http://localhost:4000/vehicles/${editId}`,
            { plate_number: plateNumber, model, owner, driver_id: driverId },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        : await axios.post(
            "http://localhost:4000/vehicles",
            { plate_number: plateNumber, model, owner, driver_id: driverId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
      setVehicles(prev =>
        editId
          ? prev.map(v => (v.id === editId ? res.data : v))
          : [...prev, res.data]
      );
      resetForm();
    } catch (err) {
      alert(
        `${editId ? "Error updating" : "Error registering"} vehicle: ${
          err.response?.data?.error || err.message
        }`
      );
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
    if (!window.confirm("Tem certeza que deseja deletar este veículo?")) return;
    try {
      await axios.delete(`http://localhost:4000/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      alert("Error deleting vehicle: " + (err.response?.data?.error || err.message));
    }
  };

  const resetForm = () => {
    setEditId(null);
    setPlateNumber("");
    setModel("");
    setOwner("");
    setDriverId("");
    setShowForm(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Vehicles</h2>

      {user?.role === "admin" && (
        <>
          <button
            onClick={openFormCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            {editId ? "Edit Vehicle" : "Register Vehicle"}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-4 max-w-md">
              <div>
                <label>Plate Number</label>
                <input
                  value={plateNumber}
                  onChange={e => setPlateNumber(e.target.value)}
                  required className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label>Model</label>
                <input
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  required className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label>Owner</label>
                <input
                  value={owner}
                  onChange={e => setOwner(e.target.value)}
                  required className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label>Driver</label>
                <select
                  value={driverId}
                  onChange={e => setDriverId(e.target.value)}
                  required className="w-full border rounded p-2"
                >
                  <option value="">Select a driver</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} – {d.license_number}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  {editId ? "Update" : "Submit"}
                </button>
                {editId && (
                  <button type="button" onClick={resetForm} className="text-gray-700 underline">
                    Cancel
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
            <span><strong>{v.plate_number}</strong> – {v.model}</span>
            {user?.role === "admin" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(v)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
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
