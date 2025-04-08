import React, { useEffect, useState } from "react";
import Container from "../components/layout/Container";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const modules = {
  toolbar: {
    container: "#custom-toolbar",
  },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image",
];

const ArticleEditor = () => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [img, setImg] = useState(null);

  const handleCancel = () => {};
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("article_id", "12345");
    formData.append("title", title);
    formData.append("content", value);
    formData.append("img", img);
    formData.append(
      "description",
      "Bài viết này hướng dẫn cách sử dụng Reactjs"
    );
    formData.append("status", "draft");
    formData.append("category", 1);
    console.log(formData.thumbnail);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/articles/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Đăng bài thành công:", res.data);
    } catch (err) {
      console.error("Lỗi khi đăng bài:", err);
    }
  };

  return (
    <Container className="pt-32">
      <form
        onSubmit={handleSubmit}
        className="w-full h-max bg-base-300 rounded-lg shadow-lg shadow-base-100 p-5"
      >
        <div>
          <span>Nhap tieu de</span>
          <input
            type="text"
            placeholder="Nhap Tieu de"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <span>Anh bai viet</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </div>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
          className="h-[400px]"
        />

        <div
          id="custom-toolbar"
          className="toolbar-bottom flex justify-between"
        >
          <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-list" value="bullet" />
            <button className="ql-link" />
          </span>

          <div className="w-max">
            <button
              onClick={handleCancel}
              className="w-40 h-full bg-primary text-primary-content"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-40 h-full bg-primary text-primary-content"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <p>Nội dung:</p>
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </Container>
  );
};

export default ArticleEditor;
