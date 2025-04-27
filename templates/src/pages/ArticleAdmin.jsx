import { useState, useEffect } from "react";
import apiInstance from "../../api/axios";
const ArticleAdmin = () => {
  const [article, setArticle] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchArticle();
  }, []);
  const fetchArticle = async () => {
    try {
      const response = await apiInstance.get("/articles/");
      setArticle(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Lỗi lấy bài viết", error);
    }
  };
  const HandleSearch = async (searchTerm) => {
    if (searchTerm.trim() === "") {
      fetchArticle();
    } else {
      try {
        const response = await apiInstance.get(
          `/articles/search/?key=${searchTerm}`
        );
        console.log(response.data);
        setArticle(response.data);
      } catch (error) {
        console.log("Lỗi tìm kiếm", error);
      }
    }
  };
  return (
    <>
      <h1 className="text-3xl font-bold text-center ">Bài viết </h1>
      <div className="mb-5">
        <input
          type="text"
          className="px-4 py-3 ml-16 mr-3 border border-gray-300 rounded-lg "
          placeholder="Bạn cần tìm gì ?"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="text-white bg-blue-500 cursor-pointer btn hover:bg-blue-700"
          onClick={() => HandleSearch(search)}
        >
          Tìm kiếm
        </button>
      </div>
      {article.map((article) => (
        <div key={article.id} className="mb-4">
          <div className="flex shadow-lg  h-[160px] max-w-[1000px] items-center overflow-hidden">
            <img
              src={`http://localhost:8000${article.img}`}
              alt="{article.title}"
              className=" h-[140px] object-cover mx-3"
            />
            <div className="flex-col w-full max-w-[600px] ">
              <div className="text-xl font-bold">{article.title}</div>
              <p className="line-clamp-2">{article.description}</p>
            </div>
            <div className="flex items-center">
              <button className="text-white bg-blue-500 cursor-pointer btn hover:bg-blue-700">
                Chi tiết
              </button>
              <button className="text-white bg-blue-500 cursor-pointer btn hover:bg-blue-700">
                Gỡ
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default ArticleAdmin;
