import React, { useState, useEffect } from "react";
import apiInstance from "../../../api/axios";
const CommentSection = ({ articleID }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  useEffect(() => {
    if (articleID) {
      console.log("articleID hiện tại:", articleID);
      fetchComment();
    }
  }, [articleID]);
  const fetchComment = async () => {
    try {
      const response = await apiInstance.get(`/comment/${articleID}/`);
      setComments(response.data);
    } catch (error) {
      console.error("Lỗi lấy bình luận", error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: "Người dùng ẩn danh",
        content: text.trim(),
        createdAt: new Date().toLocaleString(),
      },
    ]);
    setText("");
  };

  return (
    <div className="p-6 mt-10 rounded-lg shadow-md ">
      <h3 className="mb-4 text-lg font-semibold">Bình luận</h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full textarea textarea-bordered"
          rows="3"
          placeholder="Viết bình luận..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-2 text-right">
          <button type="submit" className="btn btn-primary">
            Gửi bình luận
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-sm italic text-gray-400">Chưa có bình luận nào.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="p-4 rounded shadow-sm bg-base-100">
            <p className="font-semibold">{c.user_id}</p>
            <p className="mb-2 text-sm text-gray-500">{c.createdAt}</p>
            <p>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
