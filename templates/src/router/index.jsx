import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ArticleDetail from "../pages/ArticleDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "articles/:id",
        element: <ArticleDetail />,
      },
    ],
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
]);

export default router;
