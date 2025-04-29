import { useEffect, useState } from "react";
import Container from "../components/layout/Container";
import Sidebar from "../components/layout/Sidebar";
import Post from "../components/ui/Post";
import ToggleTheme from "../components/ui/ToggleTheme";
import apiInstance from "../../api/axios";
import useArticleStore from "../store/useArticleStore";
import convertTime from "../utils/convertTime";

const Home = () => {
  const { articles, setArticle } = useArticleStore();
  const [error, setError] = useState(false);
  useEffect(() => {
    console.log("RUNNING");
    apiInstance
      .get("/articles/")
      .then((res) => {
        setArticle(res.data);
      })
      .catch((err) => {
        setError(true);
      });
  }, [setArticle]);

  return (
    <Container className="">
      <div className="flex justify-between py-28">
        <div className="">
          {articles.length !== 0 ? (
            articles.map((article) => (
              <Post
                title={article.title}
                publishDate={convertTime(article.created_at)}
                author="Jane Doe"
                description={article.description}
                thumnail={`http://localhost:8000${article.img}`}
                id={article.id}
                key={article.id}
              />
            ))
          ) : (
            <></>
          )}
        </div>
        <Sidebar />
      </div>
      <ToggleTheme />
    </Container>
  );
};

export default Home;
