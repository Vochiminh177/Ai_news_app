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
import DashboardLayout from "../layout/DashboardLayout";
import AccountLayout from "../layout/AccountLayout";
import ArticleOfAccount from "../pages/ArticleOfAccount";
import HomeAdmin from "../pages/HomeAdmin";
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
        element: <AccountLayout />,
        children: [
          {
            index: true,
            element: <AccountDetail />,
          },
          {
            path: "new_article/",
            element: <ArticleEditor />,
          },
          {
            path: "history/",
            element: <ArticleOfAccount />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      {
        path: "articles/",
        element: <ArticleAdmin />,
      },
      {
        path: "permission/",
        element: <Permission />,
      },
      {
        path: "users/",
        element: <Users />,
      },
      {
        path: "home/",
        element: <HomeAdmin />,
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
