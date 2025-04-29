import { useState } from "react";
import apiInstance from "../../api/axios";
import useAuthStore from "../store/useAuthStore";
import { data, useNavigate } from "react-router-dom";
const Register = () => {
  const { setIsAuth, setDataUser } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await apiInstance.post("register/", formData);
      setMessage(response.data.message || "Đăng ký thành công!");
      setFormData({
        username: "",
        email: "",
        password: "",
        password2: "",
      });
      setIsAuth(true);
      setDataUser(response.data);
      writeLocalStorage("user", data);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "Lỗi đăng ký!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7fafc]">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-[380px] h-[530px] rounded-xs shadow-md bg-[#fff] p-4"
      >
        <h1 className="text-xl font-bold text-center">Welcome DNews</h1>

        {error && <p className="mt-2 text-center text-red-600">{error}</p>}
        {message && (
          <p className="mt-2 text-center text-green-600">{message}</p>
        )}

        <label className="block mt-4 text-sm font-bold text-gray-700">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border rounded bg-[#f7fafc] shadow-inner"
          required
        />

        <label className="block mt-3 text-sm font-bold text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border rounded bg-[#f7fafc] shadow-inner"
          required
        />

        <label className="block mt-3 text-sm font-bold text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border rounded shadow-inner"
          required
        />

        <label className="block mt-3 text-sm font-bold text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          name="password2"
          value={formData.password2}
          onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border rounded shadow-inner"
          required
        />

        <button
          type="submit"
          className="block px-8 py-2 mx-auto mt-6 text-white bg-blue-600 rounded hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        <span className="block mt-3 text-center">
          Bạn đã có tài khoản?{" "}
          <a href="/auth/login" className="text-blue-700">
            Đăng nhập
          </a>
        </span>
      </form>
    </div>
  );
};

export default Register;
