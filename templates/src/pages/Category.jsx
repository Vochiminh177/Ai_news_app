import React from "react";
import { useParams } from "react-router-dom";
import Heading from "../components/ui/Heading";
import Container from "../components/layout/Container";
import Post from "../components/ui/Post";
import Sidebar from "../components/layout/Sidebar";
import ToggleTheme from "../components/ui/ToggleTheme";

const Category = () => {
  const { category } = useParams();
  const listCategory = {
    tech: "Cong nghe",
    sport: "The thao",
    game: "Game",
  };
  return (
    <Container className="">
      <div className="flex justify-between py-28">
        <div>
          <Heading title={listCategory[category]} />
          <div>
            <Post
              title="Breaking News: New Technology Revolutionizing the Industry"
              publishDate="March 18, 2025"
              author="Jane Doe"
              description="A new technology has emerged that is expected to revolutionize the industry. Experts are excited about the potential impact this could have on businesses and consumers alike."
            />
          </div>
        </div>
        <Sidebar />
      </div>
      <ToggleTheme />
    </Container>
  );
};

export default Category;
