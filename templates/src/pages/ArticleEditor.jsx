import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useAuthStore from "../store/useAuthStore";
import axios from "axios";

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
  const [description, setDescription] = useState("");
  const [categoryID, setCategoryID] = useState(0);
  const [img, setImg] = useState(null);
  const { dataUser } = useAuthStore();

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setCategoryID(0);
    setImg(null);
    setValue("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("article_id", "12345");
    formData.append("title", title);
    formData.append("content", value);
    formData.append("img", img);
    formData.append("description", description);
    formData.append("user_id", Number(dataUser.user_id));
    formData.append("status", "draft");
    formData.append("category", categoryID);

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
    <>
      {/* Nút mở modal */}
      <button
        className="btn btn-primary"
        onClick={() => document.getElementById("editor_modal").showModal()}
      >
        Viết bài mới
      </button>

      {/* Modal */}
      <dialog id="editor_modal" className="modal">
        <div className="modal-box max-w-screen-2xl">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Tạo bài viết mới</h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
          </div>

          {/* Nội dung chia 2 cột */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 overflow-hidden">
            {/* Form nhập */}
            <form onSubmit={handleSubmit} className="rounded-lg shadow-lg ">
              <div>
                <label className="label">Tiêu đề</label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề"
                  className="input input-bordered w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Mô tả</label>
                <textarea
                  placeholder="Nhập mô tả ngắn"
                  className="textarea textarea-bordered w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Thể loại</label>
                <select
                  className="select select-bordered w-full"
                  onChange={(e) => setCategoryID(Number(e.target.value))}
                >
                  <option value="">-- Chọn thể loại --</option>
                  <option value="1">Tech</option>
                  <option value="2">Sport</option>
                  <option value="3">Game</option>
                </select>
              </div>

              <div>
                <label className="label">Ảnh bài viết</label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setImg(e.target.files[0])}
                />
              </div>

              <div className="flex justify-end gap-3 mt-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className=" px-3 py-2 rounded bg-primary text-primary-content"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 rounded bg-primary text-primary-content"
                >
                  Submit
                </button>
              </div>
            </form>

            {/* Editor + preview */}
            <div className="flex flex-col gap-10 h-[70vh] overflow-hidden">
              <div>
                <label className="label">Soạn nội dung</label>
                <ReactQuill
                  theme="snow"
                  value={value}
                  onChange={setValue}
                  formats={formats}
                  className="h-[200px] mb-3"
                />
              </div>

              <div className="bg-base-200 p-4 rounded flex-1 overflow-y-auto">
                <h4 className="font-semibold mb-2">Nội dung xem trước:</h4>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: value }}
                />
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ArticleEditor;
