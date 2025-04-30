import {
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  UserCircleIcon,
  ArrowLeftEndOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import ToggleTheme from "../ui/ToggleTheme";
import clsx from "clsx";
const SidebarAdmin = () => {
  return (
    <div className="h-screen w-[280px] whitespace-nowrap flex flex-col justify-between bg-base-300">
      <div>
        <div className="items-center justify-start gap-5 mt-3 mb-8 text-2xl flex-nowrap p-4">
          <span>Logo</span>
          <span>News-Website</span>
        </div>
        <ul>
          <li className="">
            <NavLink
              to="/admin/home"
              end
              className={({ isActive }) =>
                clsx(
                  "flex gap-3 text-xl p-4 items-center",
                  isActive && "bg-primary text-primary-content"
                )
              }
            >
              <ChartBarIcon className="w-6 h-6" />
              <span>Trang chủ</span>
            </NavLink>
          </li>
          <li className="">
            <NavLink
              to="/admin/articles"
              end
              className={({ isActive }) =>
                clsx(
                  "flex gap-3 text-xl p-4 items-center",
                  isActive && "bg-primary text-primary-content"
                )
              }
            >
              <DocumentTextIcon className="w-6 h-6" />
              <span>Danh sách bài viết</span>
            </NavLink>
          </li>
          <li className="">
            <NavLink
              to="/admin/users"
              end
              className={({ isActive }) =>
                clsx(
                  "flex gap-3 text-xl p-4 items-center",
                  isActive && "bg-primary text-primary-content"
                )
              }
            >
              <UserGroupIcon className="w-6 h-6" />
              <span>Danh sách người dùng</span>
            </NavLink>
          </li>
          <li className="">
            <NavLink
              to="/admin/permission"
              end
              className={({ isActive }) =>
                clsx(
                  "flex gap-3 text-xl p-4 items-center",
                  isActive && "bg-primary text-primary-content"
                )
              }
            >
              <ShieldCheckIcon className="w-6 h-6" />
              <span>Phân quyền</span>
            </NavLink>
          </li>
        </ul>
      </div>
      <div>
        <div className="flex items-center gap-4 cursor-pointer p-4">
          <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
          <span>Đăng xuất</span>
        </div>
        <div className="flex gap-4 p-4">
          <ToggleTheme />
          <span>Mode</span>
        </div>
      </div>
    </div>
  );
};
export default SidebarAdmin;
