import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../services/api";
import Modal from "../components/Modal";
import "../styles/Page.css";

const emptyUserForm = { fullName: "", email: "", phone: "", password: "" };
const emptyAdminForm = { fullName: "", email: "", password: "", role: "ADMIN" };

export default function Accounts() {
  const [tab, setTab] = useState("users");

  // Users state
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [userSearch, setUserSearch] = useState("");

  // Admins state
  const [admins, setAdmins] = useState([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [adminForm, setAdminForm] = useState(emptyAdminForm);
  const [deleteAdminId, setDeleteAdminId] = useState(null);
  const [adminSearch, setAdminSearch] = useState("");

  const loadUsers = async () => {
    try {
      setUserLoading(true);
      const res = await getUsers();
      setUsers(res.data);
    } catch {
      setUserError("Không thể tải danh sách người dùng.");
    } finally {
      setUserLoading(false);
    }
  };

  const loadAdmins = async () => {
    try {
      setAdminLoading(true);
      const res = await getAdmins();
      setAdmins(res.data);
    } catch {
      setAdminError("Không thể tải danh sách admin.");
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadAdmins();
  }, []);

  // User handlers
  const openCreateUser = () => {
    setEditUser(null);
    setUserForm(emptyUserForm);
    setShowUserModal(true);
  };
  const openEditUser = (u) => {
    setEditUser(u);
    setUserForm({
      fullName: u.fullName || "",
      email: u.email || "",
      phone: u.phone || "",
      password: "",
    });
    setShowUserModal(true);
  };
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        const payload = { ...userForm };
        if (!payload.password) delete payload.password;
        await updateUser(editUser.id, payload);
      } else {
        await createUser(userForm);
      }
      setShowUserModal(false);
      loadUsers();
    } catch {
      alert("Lỗi khi lưu người dùng.");
    }
  };
  const handleDeleteUser = async () => {
    try {
      await deleteUser(deleteUserId);
      setDeleteUserId(null);
      loadUsers();
    } catch {
      alert("Lỗi khi xóa người dùng.");
    }
  };

  // Admin handlers
  const openCreateAdmin = () => {
    setEditAdmin(null);
    setAdminForm(emptyAdminForm);
    setShowAdminModal(true);
  };
  const openEditAdmin = (a) => {
    setEditAdmin(a);
    setAdminForm({
      fullName: a.fullName || "",
      email: a.email || "",
      password: "",
      role: a.role || "ADMIN",
    });
    setShowAdminModal(true);
  };
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editAdmin) {
        const payload = { ...adminForm };
        if (!payload.password) delete payload.password;
        await updateAdmin(editAdmin.id, payload);
      } else {
        await createAdmin(adminForm);
      }
      setShowAdminModal(false);
      loadAdmins();
    } catch {
      alert("Lỗi khi lưu admin.");
    }
  };
  const handleDeleteAdmin = async () => {
    try {
      await deleteAdmin(deleteAdminId);
      setDeleteAdminId(null);
      loadAdmins();
    } catch {
      alert("Lỗi khi xóa admin.");
    }
  };

  const filteredUsers = users.filter((u) =>
    [u.fullName, u.email, u.phone]
      .join(" ")
      .toLowerCase()
      .includes(userSearch.toLowerCase()),
  );
  const filteredAdmins = admins.filter((a) =>
    [a.fullName, a.email, a.role]
      .join(" ")
      .toLowerCase()
      .includes(adminSearch.toLowerCase()),
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tài khoản</h1>
          <p className="page-sub">
            Quản lý tài khoản người dùng và quản trị viên
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn${tab === "users" ? " active" : ""}`}
          onClick={() => setTab("users")}
        >
          👤 Người dùng ({users.length})
        </button>
        <button
          className={`tab-btn${tab === "admins" ? " active" : ""}`}
          onClick={() => setTab("admins")}
        >
          🛡️ Quản trị viên ({admins.length})
        </button>
      </div>

      {/* USERS TAB */}
      {tab === "users" && (
        <>
          <div className="page-toolbar">
            <input
              className="search-input"
              placeholder="Tìm theo tên, email, SĐT..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            <span className="record-count">
              {filteredUsers.length} người dùng
            </span>
            <button className="btn btn-primary" onClick={openCreateUser}>
              + Thêm người dùng
            </button>
          </div>
          {userError && <div className="alert-error">{userError}</div>}
          <div className="table-wrap">
            {userLoading ? (
              <div className="loading">Đang tải...</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty-row">
                        Không có người dùng nào.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, idx) => (
                      <tr key={u.id}>
                        <td>{idx + 1}</td>
                        <td className="td-bold">{u.fullName}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => openEditUser(u)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => setDeleteUserId(u.id)}
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
        </>
      )}

      {/* ADMINS TAB */}
      {tab === "admins" && (
        <>
          <div className="page-toolbar">
            <input
              className="search-input"
              placeholder="Tìm theo tên, email, vai trò..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
            />
            <span className="record-count">
              {filteredAdmins.length} quản trị viên
            </span>
            <button className="btn btn-primary" onClick={openCreateAdmin}>
              + Thêm admin
            </button>
          </div>
          {adminError && <div className="alert-error">{adminError}</div>}
          <div className="table-wrap">
            {adminLoading ? (
              <div className="loading">Đang tải...</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty-row">
                        Không có quản trị viên nào.
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((a, idx) => (
                      <tr key={a.id}>
                        <td>{idx + 1}</td>
                        <td className="td-bold">{a.fullName}</td>
                        <td>{a.email}</td>
                        <td>
                          <span className="badge badge-purple">{a.role}</span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => openEditAdmin(a)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => setDeleteAdminId(a.id)}
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
        </>
      )}

      {/* User Modal */}
      {showUserModal && (
        <Modal
          title={editUser ? "Sửa người dùng" : "Thêm người dùng"}
          onClose={() => setShowUserModal(false)}
        >
          <form onSubmit={handleUserSubmit}>
            <div className="form-group">
              <label>Họ tên</label>
              <input
                required
                value={userForm.fullName}
                onChange={(e) =>
                  setUserForm({ ...userForm, fullName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                value={userForm.phone}
                onChange={(e) =>
                  setUserForm({ ...userForm, phone: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>
                {editUser
                  ? "Mật khẩu mới (để trống nếu không đổi)"
                  : "Mật khẩu"}
              </label>
              <input
                type="password"
                required={!editUser}
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({ ...userForm, password: e.target.value })
                }
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowUserModal(false)}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                {editUser ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <Modal
          title={editAdmin ? "Sửa quản trị viên" : "Thêm quản trị viên"}
          onClose={() => setShowAdminModal(false)}
        >
          <form onSubmit={handleAdminSubmit}>
            <div className="form-group">
              <label>Họ tên</label>
              <input
                required
                value={adminForm.fullName}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, fullName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={adminForm.email}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, email: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>
                {editAdmin
                  ? "Mật khẩu mới (để trống nếu không đổi)"
                  : "Mật khẩu"}
              </label>
              <input
                type="password"
                required={!editAdmin}
                value={adminForm.password}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, password: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Vai trò</label>
              <select
                value={adminForm.role}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, role: e.target.value })
                }
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowAdminModal(false)}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                {editAdmin ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm delete user */}
      {deleteUserId && (
        <Modal title="Xác nhận xóa" onClose={() => setDeleteUserId(null)}>
          <p>Bạn có chắc muốn xóa người dùng này không?</p>
          <div className="form-actions">
            <button
              className="btn btn-ghost"
              onClick={() => setDeleteUserId(null)}
            >
              Hủy
            </button>
            <button className="btn btn-danger" onClick={handleDeleteUser}>
              Xóa
            </button>
          </div>
        </Modal>
      )}

      {/* Confirm delete admin */}
      {deleteAdminId && (
        <Modal title="Xác nhận xóa" onClose={() => setDeleteAdminId(null)}>
          <p>Bạn có chắc muốn xóa quản trị viên này không?</p>
          <div className="form-actions">
            <button
              className="btn btn-ghost"
              onClick={() => setDeleteAdminId(null)}
            >
              Hủy
            </button>
            <button className="btn btn-danger" onClick={handleDeleteAdmin}>
              Xóa
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
