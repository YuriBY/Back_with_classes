import { Router } from "express";
import { authMiddlewear } from "../middleweares/auth/auth-middlewear";
import { blogValidator } from "../validators/blog-validators";
import { postInBlogValidation } from "../validators/post-validator";
import { blogController } from "../composition-root";

export const blogRoute = Router({});

blogRoute.get("/", blogController.getBlogs.bind(blogController));

blogRoute.get("/:id", blogController.getBlog.bind(blogController));

blogRoute.get("/:id/posts", blogController.getPosts.bind(blogController));

blogRoute.post(
  "/",
  authMiddlewear,
  blogValidator(),
  blogController.createBlog.bind(blogController)
);

blogRoute.post(
  "/:id/posts",
  authMiddlewear,
  postInBlogValidation(),
  blogController.createPost.bind(blogController)
);

blogRoute.put(
  "/:id",
  authMiddlewear,
  blogValidator(),
  blogController.updateBlog.bind(blogController)
);

blogRoute.delete(
  "/:id",
  authMiddlewear,
  blogController.deleteBlog.bind(blogController)
);
