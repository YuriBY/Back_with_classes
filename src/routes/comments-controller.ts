import { Response } from "express";
import { HTTP_STATUS } from "../status/status1";
import {
  Content,
  ParamType,
  RequestWithBodyAndParams,
  RequestWithParams,
} from "../models/commonTypes";
import {
  CommentOutType,
  objForCommentDelete,
  objForCommentUpdate,
} from "../models/comments";
import { CommentService } from "../services/comment-service";
import { Result } from "../models/resultTypes";

export class CommentController {
  constructor(protected commentService: CommentService) {}

  async getComment(
    req: RequestWithParams<ParamType>,
    res: Response<CommentOutType | {}>
  ) {
    const id = req.params.id;
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    const comment = await this.commentService.commentsQueryRepository.getById(
      req.params.id
    );
    // commentsQueryRepository.getById(req.params.id);

    if (!comment) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.send(comment);
  }

  async updateComment(
    req: RequestWithBodyAndParams<ParamType, Content>,
    res: Response
  ) {
    const id = req.params.id;
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    const newObjForCommentUpdate: objForCommentUpdate = {
      commentId: req.params.id,
      content: req.body.content,
      userId: req.user!._id,
      userLogin: req.user!.accountData.userName,
    };
    const updatedComment: Result =
      await this.commentService.updateCommentContent(newObjForCommentUpdate);

    if (updatedComment.code === 404) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else if (updatedComment.code === 403) {
      res.sendStatus(HTTP_STATUS.FORBIDDEN_403);
    } else {
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }

  async deleteComment(req: RequestWithParams<ParamType>, res: Response) {
    const id = req.params.id;
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    const newObjForCommentDelete: objForCommentDelete = {
      commentId: req.params.id,
      userId: req.user!._id,
    };
    const commentIsDeleted = await this.commentService.deleteById(
      newObjForCommentDelete
    );
    if (commentIsDeleted.code === 404) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else if (commentIsDeleted.code === 403) {
      res.sendStatus(HTTP_STATUS.FORBIDDEN_403);
    } else {
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
}
