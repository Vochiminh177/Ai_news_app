import { NavLink } from "react-router-dom";
import convertTime from "../../utils/convertTime";
import { useEffect, useState } from "react";
import apiInstance from "../../../api/axios";

const Post = ({
  thumnail = "https://placehold.co/840x360",
  title,
  publishDate,
  author,
  description,
  id,
}) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiInstance.get(`/user/${Number(author)}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  });
  return (
    <div className="card bg-base-100 shadow-xl w-[880px] p-5 mb-5">
      <figure className="w-full h-[368px] object-cover">
        <img src={`http://localhost:8000${thumnail}`} alt="Shoes" />
      </figure>
      <div className="card-body px-0">
        <h2 className="card-title">{title}</h2>
        <p>
          {convertTime(publishDate)} - {user?.username}
        </p>
        <p>{description}</p>
        <div className="card-actions justify-start">
          <button className="btn btn-primary">
            <NavLink to={`/articles/${id}`}>Xem them</NavLink>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
