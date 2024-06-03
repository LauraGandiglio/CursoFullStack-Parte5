import Togglable from "./Toggable";
import { useState } from "react";

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [userLikes, setUserLikes] = useState(blog.likes);

  const updatedBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    user: blog.user?.id,
    id: blog.id,
    likes: userLikes + 1,
  };

  const addLike = () => {
    setUserLikes(userLikes + 1);
    updateBlog(updatedBlog);
  };

  return (
    <div>
      &quot;{blog.title}&quot; by <b>{blog.author}</b>
      <Togglable
        buttonLabel1="View"
        buttonLabel2="Hide"
      >
        <p>Url: {blog.url}</p>
        <div>
          <p>Likes: {blog.likes}</p>
          <button onClick={addLike} className="likeButton">Like</button>
        </div>

        <p>Creator: {blog.user ? blog.user.username : "Unattributed"} </p>
        {blog.user?.username == user.username && (
          <button onClick={() => deleteBlog(blog.id, blog)}>Delete</button>
        )}
      </Togglable>
    </div>
  );
};

export default Blog;
