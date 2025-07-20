import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token enviado:", token);

    axios
      .get("http://localhost:4000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        console.log("AdminPanel GET /admin/users response:", res.data);
        setUsers(res.data);
      })
      .catch(err => {
        console.error("AdminPanel GET erro:", err.response || err);
        alert("Access denied: " + (err.response?.data?.error || err.message));
      });
  }, []);

  const promoteToAdmin = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `http://localhost:4000/admin/users/${userId}/role`,
        { role: "admin" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, role: "admin" } : u
        )
      );
    } catch (err) {
      alert("Erro ao promover usuário: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🔧 Admin Panel – Users</h2>
      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.username}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">
                {u.role === "user" && (
                  <button
                    onClick={() => promoteToAdmin(u.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Promote
                  </button>
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan="4" className="text-center p-4">Nenhum usuário disponível</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
