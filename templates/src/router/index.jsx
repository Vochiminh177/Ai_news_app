import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ArticleDetail from "../pages/ArticleDetail";
import Category from "../pages/Category";
import NewArticlePage from "../pages/NewArticlePage";
import AccountDetail from "../pages/AccountDetail";
import ArticleEditor from "../pages/ArticleEditor";
import ArticleAdmin from "../pages/ArticleAdmin";
import Permission from "../pages/Permission";
import Users from "../pages/Users";
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
        path: "articles/",
        element: <NewArticlePage />,
      },
      {
        path: "articles/:id",
        element: <ArticleDetail />,
      },
      {
        path: "/:category",
        element: <Category />,
      },
      {
        path: "account/",
        element: <DefaultLayout />,
        children: [
          {
            path: "new_article/",
            element: <ArticleEditor />,
          },
        ],
      },
      {
        path: "admin/articles/",
        element: <ArticleAdmin />,
      },
      {
        path: "admin/permission/",
        element: <Permission />,
      },
      {
        path: "admin/users/",
        element: <Users />,
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
