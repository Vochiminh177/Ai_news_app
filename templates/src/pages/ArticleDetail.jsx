import React from "react";
import { useParams } from "react-router-dom";
import Container from "../components/layout/Container";
import Sidebar from "../components/layout/Sidebar";
import ToggleTheme from "../components/ui/ToggleTheme";

const ArticleDetail = () => {
  const { id } = useParams();
  console.log(id);
  return (
    <Container className="">
      <div className="flex justify-between py-28">
        <div className="card w-full bg-base-100 card-xl shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Xlarge Card</h2>
            <p>
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>
            <div className="justify-end card-actions">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
      <ToggleTheme />
    </Container>
  );
};

export default ArticleDetail;
