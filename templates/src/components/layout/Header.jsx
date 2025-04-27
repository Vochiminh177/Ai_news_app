import { NavLink, useNavigate } from "react-router-dom";
import Container from "./Container";
import useArticleStore from "../../store/useArticleStore";
import { useState } from "react";
import apiInstance from "../../../api/axios";
import useAuthStore from "../../store/useAuthStore";

const Header = () => {
  const { setArticle } = useArticleStore();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { isAuth } = useAuthStore();

  const handleSearch = () => {
    apiInstance
      .get(`/articles/search?key=${search}`)
      .then((res) => {
        setArticle(res.data);
        setSearch("");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container className="fixed z-10 border-b-2 shadow-2xl bg-base-300">
      <div className="navbar w-full h-[60px] bg-transparent justify-between">
        <div className="navbar-start w-min">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="p-2 mt-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box z-1 w-52"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <p className="text-3xl font-playwrite">DNews</p>
        </div>
        <div className="hidden px-10 navbar-center lg:flex gap-9">
          <NavLink to="/">Trang chu</NavLink>
          <NavLink to="/tech">Cong nghe</NavLink>
          <NavLink to="/sport">The thao</NavLink>
          <NavLink to="/game">Game</NavLink>
        </div>
        <div className="gap-2 navbar-end">
          <label className="input input-bordered flex items-center gap-2 input-sm mr-2 lg:w-[280px]">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <button onClick={handleSearch}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </label>
          {isAuth ? (
            <>
              <div class="dropdown dropdown-hover">
                <div tabindex="0" className="cursor-pointer">
                  <div class="avatar">
                    <div class="ring-primary ring-offset-base-100 w-8 rounded-full ring ring-offset-2">
                      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                  </div>
                </div>
                <ul
                  tabindex="0"
                  class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                  <li>
                    <NavLink
                      to="/account/"
                      end
                      className={({ isActive }) =>
                        isActive ? "bg-primary text-primary-content" : ""
                      }
                    >
                      Thong tin tai khoan
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/account/article"
                      end
                      className={({ isActive }) =>
                        isActive ? "bg-primary text-primary-content" : ""
                      }
                    >
                      Bai viet cua ban
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/account/new_article"
                      end
                      className={({ isActive }) =>
                        isActive ? "bg-primary text-primary-content" : ""
                      }
                    >
                      Tao bai viet moi
                    </NavLink>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <button className="px-3 py-2 rounded bg-primary text-primary-content min-w-24">
                <NavLink to="/auth/login">Dang nhap</NavLink>
              </button>
              <button className="px-3 py-2 rounded bg-primary text-primary-content min-w-24">
                <NavLink to="/auth/register">Dang ki</NavLink>
              </button>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Header;
