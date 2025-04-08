import React from "react";
import { Outlet } from "react-router-dom";

const AccountDetail = () => {
  return (
    <div className="pt-32">
      <Outlet />
    </div>
  );
};

export default AccountDetail;
