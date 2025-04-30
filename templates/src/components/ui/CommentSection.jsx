import React, { useState, useEffect } from "react";
import apiInstance from "../../../api/axios";
const CommentSection = ({ articleID }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState([]);
  useEffect(() => {
    if (articleID) {
      console.log("articleID hiện tại:", articleID);
      fetchComment();
      fetchUser();
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
  const fetchUser = async () => {
    try {
      const response = await apiInstance.get("/users");
      console.log(response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu ", error);
    }
  };
  const getInfoUser = (userID) => {
    const users = user.find((user) => user.id === userID);
    if (users) {
      return {
        username: users.username,
        avatar: users.avatar || "http://localhost:8000/media/default.jpg",
      };
    }

    return {
      username: "Vô danh",
      avatar: "http://localhost:8000/media/default.jpg",
    };
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
        {comments.map((c) => {
          const { username, avatar } = getInfoUser(c.user); // Lấy tên và avatar người dùng
          return (
            <div key={c.id} className="p-4 rounded shadow-sm bg-base-100">
              <div className="flex items-center">
                <img
                  src={avatar}
                  alt={username}
                  className="w-8 h-8 mr-3 rounded-full"
                />
                <p className="font-semibold">{username}</p>
              </div>
              <p className="mb-2 text-sm text-gray-500">{c.createdAt}</p>
              <p>{c.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;
