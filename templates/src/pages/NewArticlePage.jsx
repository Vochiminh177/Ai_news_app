import React from "react";
import Container from "../components/layout/Container";
import ToggleTheme from "../components/ui/ToggleTheme";
import { CenterIcon, LeftIcon, RightIcon } from "../components/ui/icons";

const NewArticlePage = () => {
  return (
    <Container className="py-28">
      <div className="card w-full bg-base-100 card-xl shadow-xl min-h-[calc(100vh-200px)]">
        <div className="card-body flex flex-col">
          <textarea
            name=""
            id=""
            className="w-full flex-1 bg-transparent p-2"
            placeholder="Nhap tai day"
          ></textarea>
          <div className="w-full flex justify-between items-center">
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
              <button className="text-primary-content bg-primary px-3 py-2 min-w-20 font-semibold rounded">
                Dang bai
              </button>
              <button className="text-primary-content bg-primary px-3 py-2 min-w-20 font-semibold rounded">
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
