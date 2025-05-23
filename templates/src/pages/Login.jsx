import { useEffect, useState } from "react";
import apiInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { writeLocalStorage } from "../utils/actionLocalStorage";
const Login = () => {
  const { setIsAuth, setDataUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiInstance.post("/login/", {
        email,
        password,
      });
      alert("Đăng nhập thành công!");
      setDataUser(response.data);
      setIsAuth(true);
      writeLocalStorage("user", response.data);

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7fafc]">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-[380px] h-[332px] rounded-xs shadow-md rounded bg-[#fff]"
      >
        <h1 className="mt-2 text-xl font-bold text-center">Welcome DNews</h1>
        {error && <p className="mt-2 text-center text-red-600">{error}</p>}

        <label className="block mt-4 ml-8 text-sm font-bold text-gray-700">
          Email
        </label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-[300px] px-3 py-2 ml-8 rounded border shadow-inner border-gray-300 bg-[#f7fafc]"
        />

        <label className="block mt-3 ml-8 text-sm font-bold text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-[300px] px-3 py-2 ml-8 rounded border border-gray-300 shadow-inner bg-[#f7fafc]"
        />

        <button
          type="submit"
          className="block px-8 py-2 mx-auto mt-6 text-gray-200 bg-blue-600 rounded hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <span className="block mx-auto mt-3 text-center">
          Bạn chưa có tài khoản?{" "}
          <a href="/auth/register" className="text-blue-700">
            Đăng ký
          </a>
        </span>
      </form>
    </div>
  );
};

export default Login;
