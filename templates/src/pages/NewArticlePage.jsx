import React from "react";
import Container from "../components/layout/Container";
import ToggleTheme from "../components/ui/ToggleTheme";
import { CenterIcon, LeftIcon, RightIcon } from "../components/ui/icons";

const NewArticlePage = () => {
  return (
    <Container className="py-28">
      <div className="card w-full bg-base-100 card-xl shadow-xl min-h-[calc(100vh-200px)]">
        <div className="flex flex-col card-body">
          <textarea
            name=""
            id=""
            className="flex-1 w-full p-2 bg-transparent"
            placeholder="Nhap tai day"
          ></textarea>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <button>
                <b>B</b>
              </button>
              <button>
                <i>I</i>
              </button>
              <button>
                <u>U</u>
              </button>
              <button>
                <LeftIcon />
              </button>
              <button>
                <CenterIcon />
              </button>
              <button>
                <RightIcon />
              </button>
            </div>
            <div className="flex gap-3">
              <button className="px-3 py-2 font-semibold rounded text-primary-content bg-primary min-w-20">
                Dang bai
              </button>
              <button className="px-3 py-2 font-semibold rounded text-primary-content bg-primary min-w-20">
                Huy
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToggleTheme />
    </Container>
  );
};

export default NewArticlePage;
