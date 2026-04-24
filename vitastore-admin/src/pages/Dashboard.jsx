import { Link } from "react-router-dom";
import "../styles/Page.css";

const cards = [
  { label: "Đơn hàng", icon: "📦", path: "/admin/orders", color: "#2563eb" },
  { label: "Sản phẩm", icon: "🛍️", path: "/admin/products", color: "#7c3aed" },
  { label: "Tài khoản", icon: "👥", path: "/admin/accounts", color: "#059669" },
];

export default function Dashboard() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Chào mừng đến trang quản trị VitaStore</p>
        </div>
      </div>
      <div
        style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: 8 }}
      >
        {cards.map((c) => (
          <Link
            key={c.path}
            to={c.path}
            style={{
              textDecoration: "none",
              background: "#fff",
              borderRadius: 16,
              padding: "32px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              minWidth: 160,
              transition: "transform 0.15s, box-shadow 0.15s",
              flex: "1 1 160px",
              maxWidth: 220,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.13)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
            }}
          >
            <span style={{ fontSize: 40 }}>{c.icon}</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: c.color }}>
              {c.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
