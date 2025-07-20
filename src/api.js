import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// ======= DRIVERS =======
export const fetchDrivers = () => axios.get(`${API_URL}/drivers`);
export const fetchDriverById = (id) => axios.get(`${API_URL}/drivers/${id}`);
export const createDriver = (driverData) => axios.post(`${API_URL}/drivers`, driverData);
export const updateDriver = (id, driverData) => axios.put(`${API_URL}/drivers/${id}`, driverData);
export const deleteDriver = (id) => axios.delete(`${API_URL}/drivers/${id}`);

// ======= VEHICLES =======
export const fetchVehicles = () => axios.get(`${API_URL}/vehicles`);
export const fetchVehicleById = (id) => axios.get(`${API_URL}/vehicles/${id}`);
export const createVehicle = (vehicleData) => axios.post(`${API_URL}/vehicles`, vehicleData);
export const updateVehicle = (id, vehicleData) => axios.put(`${API_URL}/vehicles/${id}`, vehicleData);
export const deleteVehicle = (id) => axios.delete(`${API_URL}/vehicles/${id}`);

// ======= INFRACTIONS =======
export const fetchInfractions = () => axios.get(`${API_URL}/infractions`);
export const fetchInfractionById = (id) => axios.get(`${API_URL}/infractions/${id}`);
export const createInfraction = (infractionData) => axios.post(`${API_URL}/infractions`, infractionData);
export const updateInfraction = (id, infractionData) => axios.put(`${API_URL}/infractions/${id}`, infractionData);
export const deleteInfraction = (id) => axios.delete(`${API_URL}/infractions/${id}`);

// ======= STATS =======
export const fetchStats = () => axios.get(`${API_URL}/stats`);

// ======= AUTH =======
// Se tiver rotas de autenticação
export const login = (credentials) => axios.post(`${API_URL}/auth/login`, credentials);
export const register = (userData) => axios.post(`${API_URL}/auth/register`, userData);

// etc. — pode ir ampliando conforme novas rotas surgirem

