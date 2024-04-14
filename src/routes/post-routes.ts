import { Router } from "express";
import { authMiddlewear } from "../middleweares/auth/auth-middlewear";
import {
  contentValidation,
  postValidation,
} from "../validators/post-validator";
import { authJWTMiddlewear } from "../middleweares/auth/authJWTmiddlewear";
import { postController } from "../composition-root";

export const postRoute = Router({});

postRoute.get("/", postController.getPosts.bind(postController));

postRoute.get("/:id", postController.getPost.bind(postController));

postRoute.post(
  "/",
  authMiddlewear,
  postValidation(),
  postController.createPost.bind(postController)
);

postRoute.put(
  "/:id",
  authMiddlewear,
  postValidation(),
  postController.updatePost.bind(postController)
);

postRoute.delete(
  "/:id",
  authMiddlewear,
  postController.deletePost.bind(postController)
);

postRoute.post(
  "/:id/comments",
  authJWTMiddlewear,
  contentValidation(),
  postController.createComment.bind(postController)
);

postRoute.get("/:id/comments", postController.getComments.bind(postController));
