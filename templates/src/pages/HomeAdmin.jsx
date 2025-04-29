import { useEffect, useState } from "react";
import apiInstance from "../../api/axios";
import ModelDetail from "../components/layout/ModelDetail";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const HomeAdmin = () => {
  const [topArticle, setTopArticle] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [countArticle, setCountArticle] = useState(0);
  const [countUser, setCountUser] = useState(0);
  const [year, setYear] = useState("2025");
  const [mode, setMode] = useState("month");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Tổng bài viết đã đăng",
        data: [],
        backgroundColor: "#4299E1",
      },
    ],
  });
  useEffect(() => {
    fetchArticle();
    fetchUser();
    fetchStats();
  }, [mode, year]);
  const fetchArticle = async () => {
    try {
      const response = await apiInstance.get("/articles/");
      const count = response.data.filter(
        (article) => article.status === "published"
      );
      setCountArticle(count.length);
      const top5art = count
        .sort((a, b) => b.counter_view - a.counter_view)
        .splice(0, 5);
      setTopArticle(top5art);
    } catch (error) {
      console.error("Lỗi lấy bài viết", error);
    }
  };
  const fetchUser = async () => {
    try {
      const response = await apiInstance.get("/users");
      setCountUser(response.data.length);
    } catch (error) {
      console.error("Lỗi lấy user ", error);
    }
  };
  const fetchStats = async () => {
    try {
      const response = await apiInstance.get(
        `/articles/stats/?mode=${mode}&year=${year}`
      );
      const data = response.data;

      const labels = Object.keys(data);
      const values = Object.values(data);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Tổng bài viết đã đăng",
            data: values,
            backgroundColor: "#4299E1",
          },
        ],
      });
    } catch (error) {
      console.error("Lỗi lấy thống kê", error);
    }
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const HandleDetail = async (id) => {
    try {
      const response = await apiInstance.get(`articles/${id}/`);
      setSelectedArticle(response.data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết ", error);
    }
  };
  const HandleCloseModel = () => {
    setSelectedArticle(null);
  };
  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-center ">Trang chủ</h1>
      <div className="grid grid-cols-3 gap-6 mx-8 mb-8">
        <div className="py-6 bg-blue-300 rounded-sm">
          Số lượng bài viết <span>{countArticle ? countArticle : 0}</span>
        </div>
        <div className="py-6 bg-blue-300 rounded-sm">
          Số lượng user <span>{countUser ? countUser : 0}</span>
        </div>
        <div className="py-6 bg-blue-300 rounded-sm">Số </div>
      </div>

      <div className="p-6 mb-4  bg-white rounded shadow">
        <h2 className="mb-2 text-xl font-semibold">
          Biểu đồ tổng số bài đăng các tháng
        </h2>
        <div className="mb-2 flex items-center space-x-4">
          <select
            name=""
            id="mode"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="month"> Tháng </option>
            <option value="quarter"> Quý </option>
          </select>
          <select
            name=""
            id="year"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
      <div className="font-bold text-2xl ">
        Top 5 bài viết nhiêu lượt truy cập nhất
      </div>

      {topArticle.map((article) => (
        <div key={article.id} className="mb-4 ">
          <div className="grid grid-cols-11 gap-4 shadow-lg max-w-[1000px] h-[160px] w-full items-center overflow-hidden">
            <img
              src={`http://localhost:8000${article.img}`}
              alt="{article.title}"
              className=" h-[140px] object-cover mx-3 col-span-2"
            />
            <div className="col-span-5 ">
              <div className="text-xl font-bold">{article.title} </div>
              <p className="line-clamp-2">{article.description}</p>
            </div>
            <div className="items-center col-span-3 ">
              <button
                className="text-white bg-blue-500 cursor-pointer btn hover:bg-blue-700"
                onClick={() => HandleDetail(article.id)}
              >
                Chi tiết
              </button>
            </div>
          </div>
        </div>
      ))}
      {selectedArticle && (
        <ModelDetail
          title="Chi tiết bài viết"
          onClose={HandleCloseModel}
          width="w-[60vw]"
        >
          <div className="flex justify-between gap-5 ">
            <div className="w-full shadow-xl card bg-base-100 card-xl">
              <div className="card-body">
                <h2 className="flex items-center justify-between card-title ">
                  {selectedArticle.title}
                </h2>
                <p>{selectedArticle.created_at}</p>
                <div>
                  <img
                    src={`http://localhost:8000${selectedArticle.img}`}
                    alt="img"
                    className="w-full"
                  />
                </div>
                <div className="text-base text-base-content">
                  {selectedArticle.content}
                </div>
              </div>
            </div>
          </div>
        </ModelDetail>
      )}
    </>
  );
};
export default HomeAdmin;
