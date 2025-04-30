import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const Post = ({
  thumnail = "https://placehold.co/840x360",
  title,
  publishDate,
  author,
  description,
  id,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl w-[880px] p-5 mb-5">
      <figure className="w-full h-[368px] object-cover">
        <img src={`http://localhost:8000${thumnail}`} alt="Shoes" />
      </figure>
      <div className="card-body px-0">
        <h2 className="card-title">{title}</h2>
        <p>
          {publishDate} - {author}
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

Post.propTypes = {
  thumnail: PropTypes.string,
  title: PropTypes.string.isRequired,
  publishDate: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Post;
