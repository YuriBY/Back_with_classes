import { Router, Response } from "express";
import { authJWTMiddlewear } from "../middleweares/auth/authJWTmiddlewear";
import {
  contentValidation,
  likesValidation,
} from "../validators/post-validator";
import { commentsController } from "../composition-root";
import { accessTokenMiddlewear } from "../middleweares/auth/accessTokenMiddlewear";

export const commentsRoute = Router({});

commentsRoute.get(
  "/:id",
  accessTokenMiddlewear,
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

commentsRoute.put(
  "/:id/like-status",
  authJWTMiddlewear,
  likesValidation(),
  commentsController.addLikeStatus.bind(commentsController)
);
