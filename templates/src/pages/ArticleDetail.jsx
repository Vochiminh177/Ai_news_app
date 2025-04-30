import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../components/layout/Container";
import Sidebar from "../components/layout/Sidebar";
import ToggleTheme from "../components/ui/ToggleTheme";
import { HeartIcon } from "../components/ui/icons";
import apiInstance from "../../api/axios";
import convertTime from "../utils/convertTime";
import CommentSection from "../components/ui/CommentSection";

const ArticleDetail = () => {
  const { id } = useParams();
  const [like, setLike] = useState(false);
  const [article, setArticle] = useState({});
  const [user, setUser] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Lấy bài viết
        const articleRes = await apiInstance.get(`articles/${Number(id)}/`);
        setArticle(articleRes.data);

        // 2. Gửi request tăng view
        await apiInstance.put(`articles/add_view/${Number(id)}/`);

        // 3. Lấy user của bài viết
        const userId = articleRes.data.user_id; // hoặc .user_id tùy backend
        console.log(articleRes.data);
        const userRes = await apiInstance.get(`user/${userId}/`);
        setUser(userRes.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setError(true);
      }
    };

    fetchData();
  }, [id]);

  const handleLike = () => {
    setLike(!like);
  };

  return (
    <Container className="">
      <div className="flex justify-between gap-5 py-28 ">
        <div className="w-full shadow-xl card bg-base-100 card-xl">
          <div className="card-body">
            <h2 className="flex items-center justify-between card-title">
              {article.title}
              <button onClick={handleLike}>
                <HeartIcon like={like} />
              </button>
            </h2>
            <p>
              {convertTime(article.created_at)} - {user.username}
            </p>
            <div>
              <img
                src={`http://localhost:8000/${article.img}`}
                alt="img"
                className="w-full"
              />
            </div>
            <div
              className="text-base text-base-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            ></div>
          </div>
          <CommentSection />
        </div>
        <Sidebar />
      </div>
      <ToggleTheme />
    </Container>
  );
};

export default ArticleDetail;
