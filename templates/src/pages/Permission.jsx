import { useEffect, useState } from "react";
import apiInstance from "../../api/axios";
import ModelDetail from "../components/layout/ModelDetail";
import Container from "../components/layout/Container";
const Permission = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createRole, setCreateRole] = useState(null);
  const [editRole, setEditRole] = useState(null);
  const [permissionList, setPermissionList] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roleName, setRoleName] = useState("");
  //Hàm lấy dữ liệu
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiInstance.get("/role/");
        setRoles(response.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  //Lấy ds quyền
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await apiInstance.get("/permission/");
        setPermissionList(response.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách quyền: ", error);
      }
    };
    if (createRole || editRole) fetchPermissions();
  }, [createRole, editRole]);
  //Hàm đóng model
  const HandleCloseModel = () => {
    setCreateRole(null);
    setEditRole(null);
  };
  //Hàm tạo vai trò
  const HandleCreateRole = async () => {
    try {
      if (!roleName.trim()) {
        alert("Vui lòng nhập tên vai trò.");
        return;
      }

      const res = await apiInstance.post("/role/create/", {
        role_name: roleName,
        permission_ids: selectedPermissions,
      });
      console.log("Dữ liệu role mới:", res.data);
      setRoles((prev) => [...prev, res.data]);
      setRoleName("");
      setSelectedPermissions([]);
      HandleCloseModel();
    } catch (error) {
      console.error("Lỗi khi tạo vai trò:", error);
      alert("Đã có lỗi xảy ra khi tạo vai trò.");
    }
  };
  //Hàm lấy quyền
  const HandleGetRole = async (roleId) => {
    try {
      const response = await apiInstance.get(`/role/${roleId}/`);
      setEditRole({ id: roleId });
      setRoleName(response.data.role_name);
      setSelectedPermissions(response.data.permissions.map((p) => p.id));
      setCreateRole(true);
    } catch (error) {
      console.error("Không thể lấy vai trò ", error);
    }
  };
  //Hàm sửa vai trò
  const HandleEditRole = async () => {
    try {
      const response = await apiInstance.put(`/role/edit/${editRole.id}/`, {
        role_name: roleName,
        permission_ids: selectedPermissions,
      });
      setRoles((prev) =>
        prev.map((role) => (role.id === editRole.id ? response.data : role))
      );
      HandleCloseModel();
    } catch (error) {
      console.error("Lỗi khi cập nhật vai trò:", error);
    }
  };
  return (
    <Container>
      <h1 className="mt-3 text-3xl font-bold">Danh sách quyền</h1>
      <div className="items-center justify-between mt-3">
        <button
          onClick={() => setCreateRole(true)}
          className="p-1 bg-blue-500 border rounded-lg hover:bg-blue-700 hover:text-white"
        >
          Thêm quyền
        </button>
      </div>
      <div>
        <table className="min-w-full mt-4 border border-collapse border-gray-300 table-auto">
          <thead>
            <tr>
              <td className="px-4 py-2 border">ID</td>
              <td className="px-4 py-2 border">Vai trò</td>
              <td className="px-4 py-2 border">Ngày tạo</td>
              <td className="px-4 py-2 border">Ngày cập nhật</td>
              <td className="px-4 py-2 border">Quyền</td>
              <td className="px-4 py-2 border">Chỉnh sửa</td>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{role.id}</td>
                <td className="px-4 py-2 border">{role.role_name}</td>
                <td className="px-4 py-2 border">
                  {" "}
                  {new Date(role.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-2 border">
                  {" "}
                  {new Date(role.updated_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-2 border">
                  {role.permissions && role.permissions.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {role.permissions.map((perm) => (
                        <li key={`${role.id}-${perm.id}`}>{perm.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="italic text-gray-400">Chưa có quyền</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center border">
                  <button
                    onClick={() => HandleGetRole(role.id)}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 "
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {createRole && (
        <ModelDetail title="Thêm quyền" onClose={HandleCloseModel}>
          <div>
            <strong>Tên quyền</strong>
            <input
              type="text"
              className="w-full p-1 border "
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Chọn quyền</label>
            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-40">
              {permissionList.map((perm) => (
                <label key={perm.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={perm.id}
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedPermissions((prev) =>
                        checked
                          ? [...prev, perm.id]
                          : prev.filter((id) => id !== perm.id)
                      );
                    }}
                  />
                  {perm.name}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => HandleCreateRole()}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </ModelDetail>
      )}
      {editRole && (
        <ModelDetail title="Sửa vai trò" onClose={HandleCloseModel}>
          <div>
            <strong>Mã vai trò :</strong>
            {editRole.id}
          </div>
          <div>
            <strong>Tên vai trò</strong>
            <input
              type="text"
              className="w-full p-1 border "
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Chọn quyền</label>
            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-40">
              {permissionList.map((perm) => (
                <label key={perm.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={perm.id}
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedPermissions((prev) =>
                        checked
                          ? [...prev, perm.id]
                          : prev.filter((id) => id !== perm.id)
                      );
                    }}
                  />
                  {perm.name}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => HandleEditRole()}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </ModelDetail>
      )}
    </Container>
  );
};
export default Permission;
