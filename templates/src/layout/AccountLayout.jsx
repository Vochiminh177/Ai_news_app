import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarAccount from "../components/layout/SidebarAccount";
import Container from "../components/layout/Container";

const AccountLayout = () => {
  const location = useLocation();

  const routes = {
    "/account": "Thông tin tài khoản",
    "/account/history": "Danh sách bài viết của bạn",
    "/account/new_article": "Tạo bài viết",
  };
  return (
    <Container>
      <div className="flex gap-5 py-28">
        <SidebarAccount />
        <div className="flex-1">
          <h2 className="bg-primary text-primary-content p-3 text-xl font-semibold mb-4">
            {routes[location.pathname]}
          </h2>
          <div className="bg-base-200 rounded shadow p-5">
            <Outlet />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AccountLayout;
