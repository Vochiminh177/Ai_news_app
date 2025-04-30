import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Heading from "../components/ui/Heading";
import Container from "../components/layout/Container";
import Post from "../components/ui/Post";
import Sidebar from "../components/layout/Sidebar";
import ToggleTheme from "../components/ui/ToggleTheme";
import apiInstance from "../../api/axios";

const Category = () => {
  const { category } = useParams();
  const [listArticle, setListArticle] = useState([]);
  const listCategory = {
    tech: "Cong nghe",
    sport: "The thao",
    game: "Game",
  };

  const categoryID = {
    tech: 1,
    sport: 2,
    game: 3,
  };

  useEffect(() => {
    const fetchArticle = async () => {
      const res = await apiInstance.get(`/articles/category`, {
        params: {
          category: categoryID[category],
        },
      });

      setListArticle(res.data);
    };

    fetchArticle();
  }, [category]);
  return (
    <Container className="">
      <div className="flex justify-between gap-14 py-28">
        <div className="flex-1">
          <Heading title={listCategory[category]} clas />
          <div>
            {listArticle.map((article) => (
              <Post
                title={article.title}
                thumnail={article.img}
                publishDate={article.created_at}
                description={article.description}
                id={article.id}
                author={article.user_id}
              />
            ))}
          </div>
        </div>
        <Sidebar />
      </div>
      <ToggleTheme />
    </Container>
  );
};

export default Category;
