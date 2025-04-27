import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import SidebarAdmin from "../components/layout/SidebarAmin";
import Users from "../pages/Users";
import Permission from "../pages/Permission";
import ArticleAdmin from "../pages/ArticleAdmin";
const DefaultLayout = () => {
  return (
    <>
      <div className="flex">
        <div className="fixed min-h-screen bg-base-100 h-max">
          <SidebarAdmin />
        </div>
        <div className="w-full ml-[300px] min-w-screen ">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
