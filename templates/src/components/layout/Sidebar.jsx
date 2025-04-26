import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="p-5 rounded shadow-lg w-60 h-max bg-base-100">
      <div>
        <p className="text-xl font-semibold">Danh muc</p>
        <div className="flex flex-col gap-1 p-2 text-primary">
          <NavLink to="/tech">Cong nghe</NavLink>
          <NavLink to="/sport">The thao</NavLink>
          <NavLink to="/game">Game</NavLink>
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold">Pho bien</p>
        <div className="flex flex-col gap-1 p-2 text-primary">
          <NavLink to="/tech">post 1</NavLink>
          <NavLink to="/sport">post 2</NavLink>
          <NavLink to="/game">post 3</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
