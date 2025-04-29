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
const SidebarAdmin = () => {
  return (
    <div className="h-screen w-[280px] shadow-[2px_2px_4px_0_rgba(0,0,0,0.3)] p-4 whitespace-nowrap flex flex-col justify-between bg-slate-100">
      <div>
        <div className="items-center justify-start gap-5 mt-3 mb-8 text-2xl flex-nowrap ">
          <span>Logo</span>
          <span>News-Website</span>
        </div>
        <ul>
          <li className="flex items-end gap-4 mb-5 text-xl cursor-pointer flex-nowrap hover:text-blue-500">
            <ChartBarIcon className="w-6 h-6" />
            <NavLink to="/admin/home">Trang chính</NavLink>
          </li>
          <li className="flex items-end gap-4 mb-5 text-xl cursor-pointer flex-nowrap hover:text-blue-500">
            <DocumentTextIcon className="w-6 h-6" />
            <NavLink to="/admin/articles">Danh sách bài viết</NavLink>
          </li>
          <li className="flex items-end gap-4 mb-5 text-xl cursor-pointer flex-nowrap hover:text-blue-500">
            <UserGroupIcon className="w-6 h-6" />
            <NavLink to="/admin/users">Danh sách người dùng</NavLink>
          </li>
          <li className="flex items-end gap-4 mb-5 text-xl cursor-pointer flex-nowrap hover:text-blue-500">
            <ShieldCheckIcon className="w-6 h-6" />
            <NavLink to="/admin/permission">Phân quyền</NavLink>
          </li>
        </ul>
      </div>
      <div>
        <div className="flex items-center gap-4 mb-4 cursor-pointer">
          <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
          <span>Đăng xuất</span>
        </div>
        <div className="flex gap-4">
          {/* <ToggleTheme /> */}
          <span>Mode</span>
        </div>
      </div>
    </div>
  );
};
export default SidebarAdmin;
