import { useState, useEffect } from "react";
import apiInstance from "../../api/axios";
import ModelDetail from "../components/layout/ModelDetail";
import ArticleDetail from "./ArticleDetail";
import Container from "../components/layout/Container";
const ArticleAdmin = () => {
  const [article, setArticle] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState([]);
  const [categoryName, setCategoryName] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);
  useEffect(() => {
    fetchArticle();
    fetchCategory();
  }, []);
  const fetchArticle = async () => {
    try {
      const response = await apiInstance.get("/articles/");
      setArticle(response.data);
    } catch (error) {
      console.error("Lỗi lấy bài viết", error);
    }
  };
  //Lấy thể loại
  const fetchCategory = async () => {
    try {
      const response = await apiInstance.get("/all_categories/");
      setCategory(response.data);
      console.log(response.data);
      const categoryMap = {};
      response.data.forEach((category) => {
        categoryMap[category.id] = category.category_name;
      });
      setCategoryName(categoryMap);
    } catch (error) {
      console.error("Lỗi lấy thể loại ", error);
    }
  };
  //Tìm kiếm nâng cao
  const HandleSearch = async (searchTerm) => {
    const sort = document.getElementById("sort").value;
    const category = document.getElementById("category").value;
    const status = document.getElementById("status").value;
    const from_day = document.getElementById("from-date").value;
    const to_day = document.getElementById("to-date").value;
    const params = new URLSearchParams();
    if (searchTerm.trim() !== "") {
      params.append("key", searchTerm);
    }
    if (sort !== "all") {
      params.append("sort", sort);
    }
    if (status !== "") {
      params.append("status", status);
    }
    if (category !== "") {
      params.append("category", category);
    }
    if (from_day !== "") {
      params.append("from_date", from_day);
    }
    if (to_day !== "") {
      params.append("to_date", to_day);
    }
    try {
      const response = await apiInstance.get(
        `/articles/advanced_search/?${params.toString()}`
      );
      console.log(response.data);
      setArticle(response.data);
    } catch (error) {
      console.log("Lỗi tìm kiếm", error);
    }
  };
  // thay đổi button cho cập nhật trạng thái
  const renderButton = (status, article_id) => {
    if (status === "draft") {
      return (
        <button
          className="text-white bg-blue-500 cursor-pointer btn hover:bg-blue-700"
          onClick={() => HandleUpdateStatus(article_id, "published")}
        >
          Duyệt
        </button>
      );
    } else if (status === "published") {
      return (
        <button
          className="text-white bg-blue-500 cursor-pointer btn hover:bg-blue-700"
          onClick={() => HandleUpdateStatus(article_id, "rejected")}
        >
          Gỡ
        </button>
      );
    } else {
      return (
        <button
          className="text-white bg-blue-500 cursor-pointer btn hover:bg-blue-700"
          onClick={() => HandleUpdateStatus(article_id, "published")}
        >
          Khôi phục
        </button>
      );
    }
  };
  //Cập nhật status
  const HandleUpdateStatus = async (id, article_status) => {
    try {
      console.log({ status: article_status });
      const response = await apiInstance.put(`/update_status/${id}/`, {
        status: article_status,
      });
      fetchArticle();
    } catch (error) {
      console.log("Lỗi sửa trạng thái", error);
    }
  };
  const HandleCloseModel = () => {
    setSelectedArticle(null);
  };
  //Hàm lấy chi tiết
  const HandleDetail = async (id) => {
    try {
      const response = await apiInstance.get(`articles/${id}/`);
      console.log(response.data);
      setSelectedArticle(response.data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết ", error);
    }
  };
  return (
    <Container>
      <h1 className="text-3xl font-bold">Bài viết</h1>
      <div className="flex gap-4 my-5">
        <input
          type="text"
          className="w-64 px-2 py-3 rounded shadow-lg bg-base-200"
          placeholder="Bạn cần tìm gì ?"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="h-full px-2 py-3 font-medium rounded bg-primary text-primary-content"
          onClick={() => HandleSearch(search)}
        >
          Tìm kiếm
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <select name="" id="sort" className="border border-gray-300 rounded-sm">
          <option value="all">Tất cả</option>
          <option value="new">Mới nhất</option>
        </select>
        <select
          name=""
          id="status"
          className="border border-gray-300 rounded-sm"
        >
          <option value="">Tất cả</option>
          <option value="draft">Chờ duyệt</option>
          <option value="published">Đã duyệt</option>
          <option value="reject">Đã gỡ</option>
        </select>
        <select
          name=""
          id="category"
          className="border border-gray-300 rounded-sm"
        >
          <option value="">Tất cả</option>
          {category.map((category) => (
            <option value={category.id} key={category.id}>
              {category.category_name}
            </option>
          ))}
        </select>
        <label htmlFor="from-date">Từ ngày:</label>
        <input
          type="date"
          id="from-date"
          className="p-2 border border-gray-300 rounded-lg"
        />

        <label htmlFor="to-date">Đến ngày:</label>
        <input
          type="date"
          id="to-date"
          className="p-2 border border-gray-300 rounded-lg"
        />
      </div>
      {article.map((article) => (
        <div key={article.id} className="mb-4 ">
          <div className="grid grid-cols-11 gap-4 shadow-lg max-w-[1000px] h-[160px] w-full items-center overflow-hidden">
            <img
              src={`http://localhost:8000${article.img}`}
              alt="{article.title}"
              className=" h-[140px] object-cover mx-3 col-span-2"
            />
            <div className="col-span-5 ">
              <div className="text-xl font-bold">
                {article.title}{" "}
                <span className="font-normal">
                  ({categoryName[article.category]})
                </span>
              </div>
              <p className="line-clamp-2">{article.description}</p>
            </div>
            <div className="col-span-1">{article.status}</div>
            <div className="items-center col-span-3 ">
              <button
                className="text-white bg-blue-500 cursor-pointer btn hover:bg-blue-700"
                onClick={() => HandleDetail(article.id)}
              >
                Chi tiết
              </button>
              {renderButton(article.status, article.id)}
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
    </Container>
  );
};
export default ArticleAdmin;
