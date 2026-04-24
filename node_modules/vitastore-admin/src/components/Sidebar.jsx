import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const navItems = [
  { path: "/admin/orders", label: "Đơn hàng", icon: "📦" },
  { path: "/admin/products", label: "Sản phẩm", icon: "🛍️" },
  { path: "/admin/accounts", label: "Tài khoản", icon: "👥" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate("/admin")}>
        <span className="logo-icon">⚙️</span>
        <span className="logo-text">VitaStore Admin</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-admin-info">
          <div className="sidebar-avatar">
            {admin?.fullName ? admin.fullName.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="sidebar-admin-detail">
            <span className="sidebar-admin-name">
              {admin?.fullName || "Admin"}
            </span>
            <span className="sidebar-admin-role">{admin?.role || "ADMIN"}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
          🚪
        </button>
      </div>
    </aside>
  );
}
