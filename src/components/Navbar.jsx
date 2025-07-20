import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2 text-sm">
        <Link to="/" className="font-bold text-lg">🏠 Dashboard</Link>
        {user && (
          <>
            <span className="px-2">|</span>
            <Link to="/vehicles" className="hover:underline">🚗 Vehicles</Link>
            <span className="px-2">|</span>
            <Link to="/drivers" className="hover:underline">👤 Drivers</Link>
            <span className="px-2">|</span>
            <Link to="/infractions" className="hover:underline">⚠️ Infractions</Link>
            {user?.role === "admin" && (
              <>
                <span className="px-2">|</span>
                <Link to="/admin/users" className="hover:underline">🔧 Admin Panel</Link>
		

              </>
            )}
          </>
        )}
        {!user && (
          <>
            <span className="px-2">|</span>
            <Link to="/login" className="hover:underline">🔐 Login</Link>
            <span className="px-2">|</span>
            <Link to="/register" className="hover:underline">📝 Register</Link>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span>👤 {user.username}</span>
            <button
              onClick={() => { logout(); window.location.href = "/login"; }}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              🚪 Logout
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
