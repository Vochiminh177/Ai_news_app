import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import SidebarAdmin from "../components/layout/SidebarAmin";
import Users from "../pages/Users";
import Permission from "../pages/Permission";
import ArticleAdmin from "../pages/ArticleAdmin";
import Container from "../components/layout/Container";
const DefaultLayout = () => {
  return (
    <>
      <Header />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default DefaultLayout;
