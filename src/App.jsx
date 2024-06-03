import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import NewBlogForm from "./components/NewBlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Toggable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const blogFormRef = useRef();

  const [user, setUser] = useState(null);

  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogsUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      console.log("logging in with", username, password);

      window.localStorage.setItem("loggedBlogsUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      setMessage("Wrong username or password");
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    await blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      setMessage(` - ${blogObject.title} by ${blogObject.author} -`);
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    });
    await blogService.getAll().then((blogs) => setBlogs(blogs));
  };

  const updateBlog = async (blog) => {
    try {
      await blogService.update(blog.id, blog);
      await blogService
        .getAll()
        .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBlog = async (id, blog) => {
    try {
      if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
        await blogService.deleteBlog(id);
        const response = await blogService.getAll();
        setBlogs(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const closeSesion = () => {
    window.localStorage.removeItem("loggedBlogsUser");
    setUser(null);
  };
  return (
    <>
      {user ? (
        <div>
          <p>¡Hi {user.name}! you are logged in </p>
          <button onClick={closeSesion}>Logout</button>

          <h2>Create new blog</h2>
          {message && <p> The blog {message} was created successfully </p>}
          <Togglable
            buttonLabel1="Create blog"
            buttonLabel2="Cancel"
            ref={blogFormRef}
          >
            <NewBlogForm createBlog={addBlog} user={user} />
          </Togglable>

          <h2>blogs</h2>
          <div className="blogs">
            {blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          {message == "Wrong username or password" && <p> {message} </p>}
          <LoginForm
            handleLogin={handleLogin}
            handleUsername={({ target }) => setUsername(target.value)}
            handlePassword={({ target }) => setPassword(target.value)}
            username={username}
            password={password}
          />
        </div>
      )}
    </>
  );
};
export default App;
