import { Response } from "express";
import { HTTP_STATUS } from "../status/status1";
import {
  Content,
  LikeStatusType,
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
import { log } from "console";

export class CommentController {
  constructor(protected commentService: CommentService) {}

  async getComment(
    req: RequestWithParams<ParamType>,
    res: Response<CommentOutType | {}>
  ) {
    const id = req.params.id;
    console.log('id', id);
    
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    const comment = await this.commentService.commentsQueryRepository.getById(
      req.params.id,
      req.user?._id
    );
    console.log('comm', comment);
    
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
      return;
    } else if (updatedComment.code === 403) {
      res.sendStatus(HTTP_STATUS.FORBIDDEN_403);
      return;
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
      return;
    } else if (commentIsDeleted.code === 403) {
      res.sendStatus(HTTP_STATUS.FORBIDDEN_403);
      return;
    } else {
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);      
    }
  }

  async addLikeStatus(
    req: RequestWithBodyAndParams<ParamType, LikeStatusType>,
    res: Response
  ) {
    console.log("3333");

    const id = req.params.id;
    console.log('commentID', id);
    
    const likeStatus = req.body.likeStatus;
    console.log('a', likeStatus);
    console.log('req.user.id', req.user?._id);
    
    const foundedComment = await this.commentService.updateLikesContent(
      id,
      likeStatus,
      req.user?._id
    );
    console.log('f', foundedComment);


    if (foundedComment.code === 404) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return
    } else {
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);      
    }
   
  }
}
