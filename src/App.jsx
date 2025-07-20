import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";  // ajuste o caminho conforme sua estrutura
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Infractions from "./pages/Infractions";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminPanel from './pages/AdminPanel';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/infractions" element={<Infractions />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
	
	<Route path="admin/users" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
