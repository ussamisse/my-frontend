import React, { useEffect, useState } from "react";
import axios from "axios";

function Infractions() {
  const [infractions, setInfractions] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    description: "",
    vehicle_id: "",
    driver_id: "",
    fine_amount: ""
  });
  const [editing, setEditing] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = () => {
  axios.get(`${API_BASE}/vehicles`, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => setVehicles(res.data));
  axios.get(`${API_BASE}/drivers`, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => setDrivers(res.data));
  axios.get(`${API_BASE}/infractions`, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => setInfractions(res.data));
};


  const startEdit = (inf) => {
    setEditing(inf);
    setForm({
      description: inf.description,
      vehicle_id: inf.vehicle_id,
      driver_id: inf.driver_id ?? "",
      fine_amount: inf.fine_amount ?? ""
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ description: "", vehicle_id: "", driver_id: "", fine_amount: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        fine_amount: form.fine_amount ? parseFloat(form.fine_amount) : null
      };

      let res;
      if (editing) {
        res = await axios.put(`${API_BASE}/infractions/${editing.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });

        setInfractions(prev =>
          prev.map(inf => inf.id === editing.id ? res.data : inf)
        );
      } else {
        res = await axios.post(`${API_BASE}/infractions`, payload, { headers: { Authorization: `Bearer ${token}` } });

        setInfractions(prev => [res.data, ...prev]);
      }
      cancelEdit();
    } catch (err) {
      console.error("Erro:", err.response || err);
      alert("Erro ao salvar infração: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirma exclusão?")) return;
    try {
      await axios.delete(`${API_BASE}/infractions/${id}`, { headers: { Authorization: `Bearer ${token}` } });

      setInfractions(prev => prev.filter(i => i.id !== id));
    } catch {
      alert("Erro ao deletar infração.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">⚠️ Infractions</h2>

      {user?.role === "admin" && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-md mb-6 border p-4 rounded bg-white"
        >
          <h3 className="text-xl mb-2">{editing ? "Edit Infraction" : "Register Infraction"}</h3>

          {/* Vehicle selector */}
          <div className="flex flex-col space-y-1">
            <label className="font-medium">Vehicle</label>
            <select
              value={form.vehicle_id}
              onChange={e => setForm(f => ({ ...f, vehicle_id: e.target.value }))}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select vehicle</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate_number} - {v.model}</option>)}
            </select>
          </div>

          {/* Driver selector */}
          <div className="flex flex-col space-y-1">
            <label className="font-medium">Driver (optional)</label>
            <select
              value={form.driver_id}
              onChange={e => setForm(f => ({ ...f, driver_id: e.target.value }))}
              className="w-full border p-2 rounded"
            >
              <option value="">Select driver</option>
              {drivers.map(d => <option key={d.id} value={d.id}>{d.name} - {d.license_number}</option>)}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-1">
            <label className="font-medium">Description</label>
            <input
              type="text"
              placeholder="Description"
              className="w-full border p-2 rounded"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required
            />
          </div>

          {/* Fine amount */}
          <div className="flex flex-col space-y-1">
            <label className="font-medium">Fine Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Fine amount"
              className="w-full border p-2 rounded"
              value={form.fine_amount}
              onChange={e => setForm(f => ({ ...f, fine_amount: e.target.value }))}
            />
          </div>

          {/* Submit buttons */}
          <div className="flex space-x-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              {editing ? "Save" : "Register Infraction"}
            </button>
            {editing && (
              <button type="button" onClick={cancelEdit} className="ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            )}
          </div>
        </form>
      )}

      {/* Render infractions */}
      <ul className="space-y-2">
        {infractions.map(inf => (
          <li key={inf.id} className="border p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <strong>{inf.plate_number}</strong> — {inf.description}
              {inf.fine_amount != null && ` (Fine: $${Number(inf.fine_amount).toFixed(2)})`}
              {inf.date && ` on ${new Date(inf.date).toLocaleDateString()}`}
            </div>
            {user?.role === "admin" && (
              <div className="space-x-2">
                <button onClick={() => startEdit(inf)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(inf.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Infractions;
