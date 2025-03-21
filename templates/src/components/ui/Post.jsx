import PropTypes from "prop-types";

const Post = ({
  thumnail = "https://placehold.co/840x360",
  title,
  publishDate,
  author,
  description,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl w-[880px] p-5">
      <figure className="w-full h-[368px] object-cover">
        <img src={thumnail} alt="Shoes" />
      </figure>
      <div className="card-body px-0">
        <h2 className="card-title">{title}</h2>
        <p>
          {publishDate} - {author}
        </p>
        <p>{description}</p>
        <div className="card-actions justify-start">
          <button className="btn btn-primary">Xem them</button>
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
