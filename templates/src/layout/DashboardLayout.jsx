import React from "react";
import SidebarAdmin from "../components/layout/SidebarAmin";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <div className="fixed min-h-screen bg-base-100 h-max">
        <SidebarAdmin />
      </div>
      <div className="w-full ml-[300px] min-w-screen ">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
