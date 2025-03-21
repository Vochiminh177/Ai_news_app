import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";

const DefaultLayout = () => {
  return (
    <div className="bg-base-100 min-h-screen h-max">
      <Header />
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
