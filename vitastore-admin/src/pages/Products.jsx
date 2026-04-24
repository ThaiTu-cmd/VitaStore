import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/api";
import Modal from "../components/Modal";
import "../styles/Page.css";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  imageUrl: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      setError("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "",
      imageUrl: product.imageUrl || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await updateProduct(editProduct.id, form);
      } else {
        await createProduct(form);
      }
      setShowModal(false);
      loadProducts();
    } catch {
      alert("Lỗi khi lưu sản phẩm.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteId);
      setDeleteId(null);
      loadProducts();
    } catch {
      alert("Lỗi khi xóa sản phẩm.");
    }
  };

  const filtered = products.filter((p) =>
    [p.name, p.category, p.description]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sản phẩm</h1>
          <p className="page-sub">Quản lý danh mục sản phẩm trong cửa hàng</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Thêm sản phẩm
        </button>
      </div>

      <div className="page-toolbar">
        <input
          className="search-input"
          placeholder="Tìm theo tên, danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="record-count">{filtered.length} sản phẩm</span>
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
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-row">
                    Không có sản phẩm nào.
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => (
                  <tr key={p.id}>
                    <td>{idx + 1}</td>
                    <td>
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="product-thumb"
                        />
                      ) : (
                        <div className="product-thumb-placeholder">🛍️</div>
                      )}
                    </td>
                    <td className="td-bold">{p.name}</td>
                    <td>
                      <span className="badge badge-blue">{p.category}</span>
                    </td>
                    <td>{Number(p.price).toLocaleString("vi-VN")}₫</td>
                    <td>
                      <span
                        className={`badge ${p.stock > 0 ? "badge-green" : "badge-red"}`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => openEdit(p)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => setDeleteId(p.id)}
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
          title={editProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên sản phẩm</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Danh mục</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Giá (₫)</label>
              <input
                type="number"
                min={0}
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Tồn kho</label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>URL hình ảnh</label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
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
                {editProduct ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Xác nhận xóa" onClose={() => setDeleteId(null)}>
          <p>Bạn có chắc muốn xóa sản phẩm này không?</p>
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
