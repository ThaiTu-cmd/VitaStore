import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("user_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginUser = (data) => api.post("/auth/user/login", data);
export const registerUser = (data) => api.post("/auth/user/register", data);

// Products
export const getProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);

// Orders
export const createOrder = (data) => api.post("/orders", data);
export const getMyOrders = () => api.get("/orders/my");

export default api;
