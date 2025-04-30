import React, { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import apiInstance from "../../api/axios";
import Post from "../components/ui/Post";

const ArticleOfAccount = () => {
  const { dataUser } = useAuthStore();
  const [articles, setArticle] = useState([]);
  useEffect(() => {
    console.log("[UserDATA]", dataUser);
    const fetchData = async () => {
      try {
        const res = await apiInstance.get(`/articles/user/${dataUser.user_id}`);
        setArticle(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {articles.length === 0 ? (
        <div>Bạn chưa có bài viết nào</div>
      ) : (
        articles.map((article) => (
          <Post
            key={article.id}
            id={article.id}
            thumnail={article.img}
            title={article.title}
            author={dataUser.username}
            description={article.description}
            publishDate={article.created_at}
          />
        ))
      )}
    </div>
  );
};

export default ArticleOfAccount;
