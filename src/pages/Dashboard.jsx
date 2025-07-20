import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({ vehicles: 0, drivers: 0, infractions: 0 });
  const token = localStorage.getItem("token");

  const fetchStats = () => {
    axios
      .get("https://my-backend-e2jy.onrender.com/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching stats:", err));
  };

  useEffect(() => {
    fetchStats(); // chama quando a página é carregada
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stats</h1>
        <button
          onClick={fetchStats}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔄 Update
        </button>
      </div>

      <div className="space-y-4 text-lg">
        <p>📦 Vehicles: {stats.vehicles}</p>
        <p>🧍 Drivers: {stats.drivers}</p>
        <p>⚠️ Infractions: {stats.infractions}</p>
      </div>
    </div>
  );
}

export default Dashboard;
