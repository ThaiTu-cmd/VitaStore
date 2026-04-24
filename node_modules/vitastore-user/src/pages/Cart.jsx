import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/api";

export default function Cart() {
  const { items, totalCount, removeFromCart, updateQty, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [orderNote, setOrderNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const total = items.reduce((sum, item) => {
    const price = parseFloat(String(item.price).replace(/[^0-9]/g, ""));
    return sum + (isNaN(price) ? 0 : price * item.qty);
  }, 0);

  const formatPrice = (num) => num.toLocaleString("vi-VN") + "đ";

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    setError("");
    setPlacing(true);
    try {
      await createOrder({
        userId: user?.id,
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.qty,
          price: i.price,
        })),
        note: orderNote,
        total,
      });
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.",
      );
    } finally {
      setPlacing(false);
    }
  };

  if (success) {
    return (
      <div className="page-shell">
        <Navbar />
        <main className="container auth-page">
          <div className="auth-card cart-success">
            <div className="cart-success-icon">✓</div>
            <h2>Đặt hàng thành công!</h2>
            <p>
              Cảm ơn bạn đã mua sắm tại VitaStore. Chúng tôi sẽ liên hệ sớm để
              xác nhận đơn hàng.
            </p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <Link to="/products" className="primary-button">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="container">
        <div className="cart-page">
          <div className="section-heading">
            <h2>Giỏ hàng</h2>
            {totalCount > 0 && (
              <span className="eyebrow">{totalCount} sản phẩm</span>
            )}
          </div>

          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <h3>Giỏ hàng trống</h3>
              <p>Hãy khám phá sản phẩm và thêm vào giỏ hàng nhé!</p>
              <Link to="/products" className="primary-button">
                Xem sản phẩm
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items">
                {items.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-media">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <strong className="cart-item-price">{item.price}</strong>
                      <div className="cart-item-qty">
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          disabled={item.qty <= 1}
                          aria-label="Giảm"
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          aria-label="Tăng"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Xóa"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h3>Tóm tắt đơn hàng</h3>

                <div className="cart-summary-row">
                  <span>Tạm tính</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <div className="cart-summary-row">
                  <span>Giao hàng</span>
                  <strong>Miễn phí</strong>
                </div>
                <div className="cart-summary-divider" />
                <div className="cart-summary-row cart-summary-total">
                  <span>Tổng cộng</span>
                  <strong>{formatPrice(total)}</strong>
                </div>

                <div className="form-group" style={{ marginTop: "18px" }}>
                  <label htmlFor="orderNote">Ghi chú đơn hàng</label>
                  <textarea
                    id="orderNote"
                    placeholder="Ghi chú cho người giao hàng..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    rows={3}
                  />
                </div>

                {error && <div className="auth-error">{error}</div>}

                {!isLoggedIn && (
                  <div className="cart-login-notice">
                    Bạn cần{" "}
                    <Link to="/login" state={{ from: "/cart" }}>
                      đăng nhập
                    </Link>{" "}
                    để đặt hàng.
                  </div>
                )}

                <button
                  className="primary-button auth-submit"
                  onClick={handleCheckout}
                  disabled={placing}
                >
                  {placing
                    ? "Đang xử lý..."
                    : isLoggedIn
                      ? "Đặt hàng"
                      : "Đăng nhập để đặt hàng"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
