import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../components/layout/Container";
import Sidebar from "../components/layout/Sidebar";
import ToggleTheme from "../components/ui/ToggleTheme";
import { HeartIcon } from "../components/ui/icons";
import apiInstance from "../../api/axios";

const ArticleDetail = () => {
  const { id } = useParams();
  const [like, setLike] = useState(false);
  const [article, setArticle] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    apiInstance
      .get(`articles/${Number(id)}/`)
      .then((res) => {
        setArticle(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

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
            <p>{article.created_at}</p>
            <div>
              <img src={article.img} alt="img" className="w-full" />
            </div>
            <div className="text-base text-base-content">{article.content}</div>
          </div>
        </div>
        <Sidebar />
      </div>
      <ToggleTheme />
    </Container>
  );
};

export default ArticleDetail;
