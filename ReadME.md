- In order to run the backend, you need to setup your environment variables including MongoDB atlas credentials, cloudinary credentials, port no, accessToken and refreshToken strings. (sample.env is provided with the code) and then install all the dependencies using npm install command.
- To run the backend server, use command: npm run dev

User API’s (Sample)

- Register User: - http://localhost:8000/api/user/signup
  o Body should contain fullName, email and password.

- Login User: - http://localhost:8000/api/user/signin
  o Body should contain email and password.

- Logout User: - http://localhost:8000/api/user/signout

Blog API’s (Sample)

- Create Blog: - http://localhost:8000/api/blog/createBlog
  o Body should contain title, content and blogPicture (optional).

- Update Blog: - http://localhost:8000/api/blog/updateBlog/input_blogid
  o Body should contain the updated title and content.

- Delete Blog: - http://localhost:8000/api/blog/deleteBlog/input_blogid
  o URL should contain the correct blog_id corresponding to the blog that you want to delete.

- Retrieve Single Blog: - http://localhost:8000/api/blog/singleBlog/input_blogid
  o URL should contain the correct blog_id corresponding the blog whose details you want to retrieve.

- Retrieve All Blog: - http://localhost:8000/api/blog/allBlog

- Filter By Title: - http://localhost:8000/api/blog/filterByTitle/input_title
  o URL should contain the title of the blog.

- Filter By Author: - http://localhost:8000/api/blog/filterByAuthor/input_author_name
  o URL should contain the author_name corresponding to which, the blogs will be fetched.
