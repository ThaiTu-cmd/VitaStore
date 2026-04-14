import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand-mark">
        <span className="brand-badge">Vita</span>
        <span>
          <strong>VitaStore</strong>
          <small>Best supplements for your health</small>
        </span>
      </Link>

      <nav className="menu" aria-label="Main navigation">
        <Link to="/">Trang chủ</Link>
        <Link to="/products">Sản phẩm</Link>
        <Link to="/about-us">Giới thiệu</Link>
      </nav>
    </header>
  );
}
