import React, { useEffect, useState } from "react";
import axios from "axios";

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", license_number: "" });
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadDrivers();
  }, [token]);

  const loadDrivers = () => {
    axios
      .get("http://localhost:4000/drivers", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setDrivers(res.data))
      .catch(err => console.error("Access denied:", err));
  };

  const startEdit = (driver) => {
    setEditing(driver);
    setForm({ name: driver.name, license_number: driver.license_number });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: "", license_number: "" });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:4000/drivers/${editing.id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDrivers(prev => prev.map(d => d.id === res.data.id ? res.data : d));
      cancelEdit();
    } catch (err) {
      alert("Error updating driver: " + (err.response?.data?.error || err.message));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/drivers",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDrivers(prev => [...prev, res.data]);
      setForm({ name: "", license_number: "" });
    } catch (err) {
      alert("Error creating driver: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm delete?")) return;
    try {
      await axios.delete(`http://localhost:4000/drivers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrivers(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      alert("Error deleting driver: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Drivers</h2>

      {user?.role === "admin" && (
        <form
          onSubmit={editing ? handleSave : handleRegister}
          className="max-w-md bg-white p-4 rounded shadow space-y-4 mb-6"
        >
          <h3 className="text-lg">
            {editing ? `Editing driver #${editing.id}` : "Register Driver"}
          </h3>

          <div className="flex flex-col space-y-1">
            <label className="font-medium">Name</label>
            <input
              type="text"
              placeholder="Name"
              className="w-full border px-3 py-2 rounded"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-medium">License Number</label>
            <input
              type="text"
              placeholder="License Number"
              className="w-full border px-3 py-2 rounded"
              value={form.license_number}
              onChange={e => setForm(f => ({ ...f, license_number: e.target.value }))}
              required
            />
          </div>

          <div className="flex space-x-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              {editing ? "Save" : "Register"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <ul className="space-y-2">
        {drivers.map(d => (
          <li key={d.id} className="border p-3 rounded shadow flex justify-between items-center">
            <span>{d.name} — {d.license_number}</span>
            {user?.role === "admin" && (
              <div className="space-x-2">
                <button
                  onClick={() => startEdit(d)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
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

export default Drivers;
