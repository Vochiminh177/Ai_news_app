import React from "react";
import PersonIcon from "../ui/icons/PersonIcon";
import ClockIcon from "../ui/icons/ClockIcon";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

const SidebarAccount = () => {
  return (
    <div className="bg-base-200 shadow-sm p-5 rounded flex flex-col gap-4 h-max">
      <NavLink
        className={({ isActive }) =>
          clsx(
            "flex gap-4 px-2 py-3",
            isActive && "bg-primary text-primary-content"
          )
        }
        to="/account"
        end
      >
        <PersonIcon />
        <span>Thông tin cá nhân</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          clsx(
            "flex gap-4 px-2 py-3",
            isActive && "bg-primary text-primary-content"
          )
        }
        end
        to="/account/history"
      >
        <ClockIcon />
        <span>Danh sách bài viết</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          clsx(
            "flex gap-4 px-2 py-3",
            isActive && "bg-primary text-primary-content"
          )
        }
        end
        to="/account/new_article"
      >
        <ClockIcon />
        <span>Tạo bài viết</span>
      </NavLink>
    </div>
  );
};

export default SidebarAccount;
