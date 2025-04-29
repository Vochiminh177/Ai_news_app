import React from "react";
import { Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const AccountDetail = () => {
  const { dataUser } = useAuthStore();
  return (
    <div className="">
      <div className="avatar">
        <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <div>
        <span>Ten: {dataUser.username}</span>
      </div>
      <div>
        <span>email: {dataUser.email}</span>
      </div>
    </div>
  );
};

export default AccountDetail;
