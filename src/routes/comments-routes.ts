import { Router, Response } from "express";
import { authJWTMiddlewear } from "../middleweares/auth/authJWTmiddlewear";
import { contentValidation } from "../validators/post-validator";
import { commentsController } from "../composition-root";

export const commentsRoute = Router({});

commentsRoute.get(
  "/:id",
  commentsController.getComment.bind(commentsController)
);

commentsRoute.put(
  "/:id",
  authJWTMiddlewear,
  contentValidation(),
  commentsController.updateComment.bind(commentsController)
);

commentsRoute.delete(
  "/:id",
  authJWTMiddlewear,
  commentsController.deleteComment.bind(commentsController)
);
