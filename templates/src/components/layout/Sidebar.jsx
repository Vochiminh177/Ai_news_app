import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-60 rounded p-5 h-max bg-base-100 shadow-lg">
      <div>
        <p className="text-xl font-semibold">Danh muc</p>
        <div className="p-2 flex flex-col gap-1 text-primary">
          <NavLink to="/tech">Cong nghe</NavLink>
          <NavLink to="/sports">The thao</NavLink>
          <NavLink to="/game">Game</NavLink>
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold">Pho bien</p>
        <div className="p-2 flex flex-col gap-1 text-primary">
          <NavLink to="/tech">post 1</NavLink>
          <NavLink to="/sports">post 2</NavLink>
          <NavLink to="/game">post 3</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
