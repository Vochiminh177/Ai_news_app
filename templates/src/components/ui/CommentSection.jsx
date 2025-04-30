import React, { useState } from "react";

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

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
    <div className=" p-6 rounded-lg mt-10 shadow-md">
      <h3 className="text-lg font-semibold mb-4">Bình luận</h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="textarea textarea-bordered w-full"
          rows="3"
          placeholder="Viết bình luận..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="text-right mt-2">
          <button type="submit" className="btn btn-primary">
            Gửi bình luận
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 italic">Chưa có bình luận nào.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="bg-base-100 p-4 rounded shadow-sm">
            <p className="font-semibold">{c.author}</p>
            <p className="text-sm text-gray-500 mb-2">{c.createdAt}</p>
            <p>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
