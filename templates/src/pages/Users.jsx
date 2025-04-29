import { useEffect, useState } from "react";
import apiInstance from "../../api/axios";
import ModelDetail from "../components/layout/ModelDetail";
import Container from "../components/layout/Container";
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [statusUser, setStatusUser] = useState();
  const [roleList, setRoleList] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  //Hàm lấy dữ liệu
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiInstance.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiInstance.get("/role");
        setRoleList(response.data);
      } catch (error) {
        console.error("Lỗi lấy vai trò", error);
      }
    };
    fetchRoles();
  }, []);
  //Hàm xem chi tiết
  const HandleViewDetail = async (userID) => {
    try {
      const response = await apiInstance.get(`/user/${userID}/`);
      setSelectedUser(response.data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết user:", error);
    }
  };
  //Hàm tìm kiếm
  const HandleSearch = async (searchTerm) => {
    if (search.trim() === "") {
      try {
        const response = await apiInstance.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu người dùng:", error);
      }
    } else {
      try {
        const response = await apiInstance.get(
          `/users/search/?search=${searchTerm}`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      }
    }
  };
  //Hàm đóng model
  const HandleCloseModel = () => {
    setSelectedUser(null);
    setEditUser(null);
  };
  //Hàm edit
  const HandleEditUser = async () => {
    console.log(selectedRole);
    try {
      const formData = new FormData();
      formData.append("username", editUser.username);
      formData.append("email", editUser.email);
      formData.append("avatar", editUser.avatar);
      selectedRole.forEach((roleId) => {
        formData.append("role", roleId);
      });
      const response = await apiInstance.put(
        `/user/edit/${editUser.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = response.data;
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setEditUser(null);
      alert("Cập nhật user thành công");
    } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
    } finally {
    }
  };
  //Hàm get status
  const getStatusUser = (status) => {
    return status === 1 ? "Đang hoạt động " : "Bị ban";
  };
  //Hàm ban/unban
  const handleToggleStatus = async (userID, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userID ? { ...user, user_status: newStatus } : user
      )
    );
    try {
      await apiInstance.put(`/user/status/${userID}/`, {
        user_status: newStatus,
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái người dùng:", error);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userID ? { ...user, user_status: currentStatus } : user
        )
      );
    }
  };
  //Hàm click nút sửa
  const HandleEditClick = (user) => {
    setEditUser(user);
    const roleIds = roleList
      .filter((role) => user.roles.includes(role.role_name))
      .map((r) => r.id);
    setSelectedRole(roleIds);
  };
  //Hàm chọn img
  const HandleChangeImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (allowedTypes.includes(file.type)) {
        setEditUser({ ...editUser, avatar: file });
      } else {
        alert("Vui lòng chọn một file ảnh hợp lệ (jpeg,png,jpg)).");
      }
    }
  };
  return (
    <Container>
      <h1 className="mt-3 text-3xl font-bold">Danh sách người dùng </h1>
      <div className="flex gap-4 my-4">
        <input
          className="px-2 py-3 bg-base-200 shadow-lg rounded w-64"
          type="text"
          placeholder="Bạn cần tìm gì ?"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => HandleSearch(search)}
          className="px-3 py-2 bg-primary text-primary-content rounded font-medium"
        >
          Tìm kiếm
        </button>
      </div>
      <div>
        {users.length === 0 ? (
          <div className="text-center font-bold w-full text-3xl h-40 flex justify-center items-center">
            <p>Không có dữ liệu</p>
          </div>
        ) : (
          <table className="min-w-full mt-4 border border-collapse border-gray-300 table-auto">
            <thead>
              <tr>
                <td className="px-4 py-2 border">ID</td>
                <td className="px-4 py-2 border">UserName</td>
                <td className="px-4 py-2 border">Email</td>
                <td className="px-4 py-2 border">Avatar</td>
                <td className="px-4 py-2 border">Trạng thái</td>
                <td className="px-4 py-2 border">Xem chi tiết</td>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{user.id}</td>
                  <td className="px-4 py-2 border">{user.username}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    {getStatusUser(user.user_status)}
                  </td>
                  <td className="px-4 py-2 text-center border">
                    <button
                      onClick={() => HandleViewDetail(user.id)}
                      className="px-4 py-2 mr-3 text-white bg-blue-500 rounded-lg hover:bg-blue-700 "
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => HandleEditClick(user)}
                      className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 "
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedUser && (
        <ModelDetail title="Chi tiết User" onClose={HandleCloseModel}>
          <img
            src={selectedUser.avatar}
            alt="Avatar"
            className="w-20 h-20 mx-auto rounded-full"
          />
          <div>
            <strong>ID :</strong>
            {selectedUser.id}
          </div>
          <div>
            <strong>Tên :</strong>
            {selectedUser.username}
          </div>
          <div>
            <strong>Email :</strong>
            {selectedUser.email}
          </div>
          <div>
            <strong>Ngày tạo :</strong>
            {new Date(selectedUser.created_at).toLocaleString()}
          </div>
          <div>
            <strong>Thời gian cập nhật :</strong>
            {new Date(selectedUser.updated_at).toLocaleString()}
          </div>
          <div>
            <strong>Quyền :</strong>
            {selectedUser.roles.join(", ")}
          </div>
        </ModelDetail>
      )}
      {editUser && (
        <ModelDetail title="Chỉnh sửa User" onClose={HandleCloseModel}>
          <img
            src={editUser.avatar}
            alt="Avatar"
            className="w-20 h-20 mx-auto rounded-full"
          />
          <input type="file" accept="image/" onChange={HandleChangeImg} />
          <div>
            <strong>ID :</strong>
            {editUser.id}
          </div>
          <div>
            <strong>Tên :</strong>
            <input
              type="text"
              value={editUser.username}
              className="w-full p-1 border rounded"
              onChange={(e) =>
                setEditUser({ ...editUser, username: e.target.value })
              }
            />
          </div>
          <div>
            <strong>Email :</strong>
            <input
              type="text"
              value={editUser.email}
              className="w-full p-1 border rounded"
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />
          </div>
          <div>
            <strong>Vai trò :</strong>
            {roleList.map((role) => (
              <label key={role.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={role.id}
                  checked={selectedRole.includes(role.id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedRole((prev) =>
                      checked
                        ? [...prev, role.id]
                        : prev.filter((id) => id !== role.id)
                    );
                  }}
                />
                {role.role_name}
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() =>
                handleToggleStatus(editUser.id, editUser.user_status)
              }
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              {editUser.user_status === 1 ? "Ban" : "UnBan"}
            </button>

            <button
              onClick={HandleEditUser}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Xác nhận
            </button>
          </div>
        </ModelDetail>
      )}
    </Container>
  );
};
export default Users;
