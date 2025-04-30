import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="p-5 rounded shadow-lg w-60 h-max bg-base-100">
      <div>
        <p className="text-xl font-semibold">Danh mục</p>
        <div className="flex flex-col gap-1 p-2 text-primary">
          <NavLink to="/tech">Công nghệ</NavLink>
          <NavLink to="/sport">Thể thao</NavLink>
          <NavLink to="/game">Game</NavLink>
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold">Dành cho bạn </p>
        <div className="flex flex-col gap-1 p-2 text-primary">
          <NavLink to="/tech">bài viết 1</NavLink>
          <NavLink to="/sport">bài viết 2</NavLink>
          <NavLink to="/game">bài viết 3</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
