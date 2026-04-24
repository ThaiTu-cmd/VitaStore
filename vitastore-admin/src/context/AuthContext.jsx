import { createContext, useContext, useState, useCallback } from "react";
import { loginAdmin } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem("admin_info");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    const res = await loginAdmin({ email, password });
    const { token, user: adminInfo } = res.data;
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_info", JSON.stringify(adminInfo));
    setAdmin(adminInfo);
    return adminInfo;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_info");
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ admin, login, logout, isAuthenticated: !!admin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
