import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../components/layout/Container";
import Sidebar from "../components/layout/Sidebar";
import ToggleTheme from "../components/ui/ToggleTheme";
import { HeartIcon } from "../components/ui/icons";
import apiInstance from "../../api/axios";
import convertTime from "../utils/convertTime";
import CommentSection from "../components/ui/CommentSection";
import useAuthStore from "../store/useAuthStore";

const ArticleDetail = () => {
  const { id } = useParams();
  const { dataUser } = useAuthStore();
  const [like, setLike] = useState(false);
  const [article, setArticle] = useState({});
  const [user, setUser] = useState({});
  const [error, setError] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [listLike, setListLike] = useState([]);
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
        const userRes = await apiInstance.get(`user/${userId}/`);
        setUser(userRes.data);
        // 4. Lấy api lượt like
        const likeRes = await apiInstance.get(`article/like/${Number(id)}/`);
        setLikeCount(likeRes.data.like_count);
        //5. Lấy danh sách các bài viết đã thích của user
        const listLikeRes = await apiInstance.get(
          `get_like_user/${dataUser.user_id}/`
        );
        const likedArticles = listLikeRes.data.list_like;
        setListLike(likedArticles);

        // Cập nhật trạng thái "like"
        const isLiked = likedArticles.includes(Number(id));
        setLike(isLiked);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setError(true);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    setLike(!like);
    try {
      const res = await apiInstance.post("article/like/", {
        user_id: dataUser.user_id,
        article_id: article.id,
      });
      console.log(res.data);
      const likeRes = await apiInstance.get(`article/like/${Number(id)}/`);
      setLikeCount(likeRes.data.like_count);
    } catch (error) {
      console.error("Lỗi like ", error);
    }
  };

  return (
    <Container className="">
      <div className="flex justify-between gap-5 py-28 ">
        <div className="w-full shadow-xl card bg-base-100 card-xl">
          <div className="card-body">
            <h2 className="flex items-center justify-between card-title">
              {article.title}
              <button onClick={handleLike} className="flex">
                <HeartIcon like={like} />
                <span>{likeCount}</span>
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
          <CommentSection articleID={article.id} />
        </div>
        <Sidebar />
      </div>
      <ToggleTheme />
    </Container>
  );
};

export default ArticleDetail;
