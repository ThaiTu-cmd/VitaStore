import { useEffect, useState } from "react";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/api";
import Modal from "../components/Modal";
import "../styles/Page.css";

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED",
];

const emptyForm = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  address: "",
  totalPrice: "",
  status: "PENDING",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data);
    } catch {
      setError("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openCreate = () => {
    setEditOrder(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (order) => {
    setEditOrder(order);
    setForm({
      customerName: order.customerName || "",
      customerEmail: order.customerEmail || "",
      customerPhone: order.customerPhone || "",
      address: order.address || "",
      totalPrice: order.totalPrice || "",
      status: order.status || "PENDING",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editOrder) {
        await updateOrder(editOrder.id, form);
      } else {
        await createOrder(form);
      }
      setShowModal(false);
      loadOrders();
    } catch {
      alert("Lỗi khi lưu đơn hàng.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrder(deleteId);
      setDeleteId(null);
      loadOrders();
    } catch {
      alert("Lỗi khi xóa đơn hàng.");
    }
  };

  const filtered = orders.filter((o) =>
    [o.customerName, o.customerEmail, o.customerPhone, o.status]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const statusBadge = (status) => {
    const map = {
      PENDING: { label: "Chờ xác nhận", cls: "badge-yellow" },
      CONFIRMED: { label: "Đã xác nhận", cls: "badge-blue" },
      SHIPPING: { label: "Đang giao", cls: "badge-purple" },
      DELIVERED: { label: "Hoàn thành", cls: "badge-green" },
      CANCELLED: { label: "Đã hủy", cls: "badge-red" },
    };
    const s = map[status] || { label: status, cls: "badge-gray" };
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Đơn hàng</h1>
          <p className="page-sub">Quản lý tất cả đơn hàng trong hệ thống</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Thêm đơn hàng
        </button>
      </div>

      <div className="page-toolbar">
        <input
          className="search-input"
          placeholder="Tìm theo tên, email, SĐT, trạng thái..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="record-count">{filtered.length} đơn hàng</span>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="table-wrap">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Khách hàng</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Địa chỉ</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-row">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                filtered.map((o, idx) => (
                  <tr key={o.id}>
                    <td>{idx + 1}</td>
                    <td className="td-bold">{o.customerName}</td>
                    <td>{o.customerEmail}</td>
                    <td>{o.customerPhone}</td>
                    <td className="td-truncate">{o.address}</td>
                    <td>{Number(o.totalPrice).toLocaleString("vi-VN")}₫</td>
                    <td>{statusBadge(o.status)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => openEdit(o)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => setDeleteId(o.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal
          title={editOrder ? "Sửa đơn hàng" : "Thêm đơn hàng"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên khách hàng</label>
              <input
                required
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm({ ...form, customerEmail: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                value={form.customerPhone}
                onChange={(e) =>
                  setForm({ ...form, customerPhone: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Tổng tiền (₫)</label>
              <input
                type="number"
                min={0}
                value={form.totalPrice}
                onChange={(e) =>
                  setForm({ ...form, totalPrice: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                {editOrder ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Xác nhận xóa" onClose={() => setDeleteId(null)}>
          <p>Bạn có chắc muốn xóa đơn hàng này không?</p>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>
              Hủy
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Xóa
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
