import { HTTP_STATUS } from "./../status/status1";
import { PostOutType } from "../models/postType";
import crypto from "crypto";
import {
  CommentDBType,
  CommentOutType,
  InputObjForComment,
  objForCommentDelete,
  objForCommentUpdate,
} from "../models/comments";
import { PostQueryRepository } from "../repositories/postQueryrepository";
import { CommentRepository } from "../repositories/comment-repository";
import { CommentsQueryRepository } from "../repositories/commetsQueryRepository";
import { Result } from "../models/resultTypes";

export class CommentService {
  // commentRepository: CommentRepository;
  // commentsQueryRepository: CommentsQueryRepository;
  // postQueryRepository: PostQueryRepository;

  // constructor() {
  //   this.commentRepository = new CommentRepository();
  //   this.commentsQueryRepository = new CommentsQueryRepository();
  //   this.postQueryRepository = new PostQueryRepository();
  // }

  constructor(
    protected commentRepository: CommentRepository,
    public commentsQueryRepository: CommentsQueryRepository,
    protected postQueryRepository: PostQueryRepository
  ) {}
  async sendComment(
    createData: InputObjForComment
  ): Promise<CommentOutType | null> {
    const { postId, content, userId, userLogin } = createData;

    const foundPost: PostOutType | null =
      await this.postQueryRepository.getById(postId);
    if (!foundPost) {
      return null;
    }

    const newComment = new CommentDBType(
      crypto.randomUUID(),
      content,
      { userId, userLogin, postId },
      new Date().toISOString(),
      [],
      0,
      0
    );

    const createdComment = await this.commentRepository.createComment(
      newComment
    );
    return createdComment;
  }

  async updateCommentContent(newObjForCommentUpdate: objForCommentUpdate) {
    const { commentId, content, userId, userLogin } = newObjForCommentUpdate;
    const foundedComment: CommentDBType | Result =
      await this.commentsQueryRepository.findDbTypeById(commentId);
    if ("code" in foundedComment) {
      return {
        code: HTTP_STATUS.NOT_FOUND_404,
      };
    }
    if (foundedComment.commentatorInfo.userId !== userId) {
      return {
        code: HTTP_STATUS.FORBIDDEN_403,
      };
    }
    this.commentRepository.updateComment(foundedComment._id, content);
    return {
      code: HTTP_STATUS.NO_CONTENT_204,
    };
  }

  async deleteById(newObjToDelete: objForCommentDelete) {
    const { commentId, userId } = newObjToDelete;
    const foundedComment: CommentDBType | Result =
      await this.commentsQueryRepository.findDbTypeById(commentId);
    if ("code" in foundedComment) {
      return {
        code: HTTP_STATUS.NOT_FOUND_404,
      };
    }
    if (foundedComment.commentatorInfo.userId !== userId) {
      return {
        code: HTTP_STATUS.FORBIDDEN_403,
      };
    }
    this.commentRepository.deleteComment(foundedComment._id);
    return {
      code: HTTP_STATUS.NO_CONTENT_204,
    };
  }

  async updateLikesContent(
    commentId: string,
    likeStatus: string,
    userId: string
  ) {
    const foundedComment: CommentDBType | Result =
      await this.commentsQueryRepository.findDbTypeById(commentId);
    if ("code" in foundedComment) {
      return {
        code: HTTP_STATUS.NOT_FOUND_404,
      };
    }
    const likeInfo = foundedComment.likes.find(
      (like) => like.authorId === userId
    );
    if (likeInfo === undefined) {
      const result = await this.commentRepository.updateCommentLikes(
        commentId,
        likeStatus,
        userId
      );
      return {
        code: HTTP_STATUS.NO_CONTENT_204,
      };
    } else {
      if (likeInfo!.status === likeStatus) {
        return {
          code: HTTP_STATUS.NO_CONTENT_204,
        };
      }

      if (likeInfo!.status === "None" && likeStatus === "Like") {
        await this.commentRepository.increaseLikes(commentId);
        return {
          code: HTTP_STATUS.NO_CONTENT_204,
        };
      }

      if (likeInfo!.status === "None" && likeStatus === "Dislike") {
        await this.commentRepository.increaseDislikes(commentId);
        return {
          code: HTTP_STATUS.NO_CONTENT_204,
        };
      }

      if (likeInfo!.status === "Like" && likeStatus === "Dislike") {
        await this.commentRepository.increaseDislikes(commentId);
        await this.commentRepository.reduceLikes(commentId);
        return {
          code: HTTP_STATUS.NO_CONTENT_204,
        };
      }

      if (likeInfo!.status === "Dislike" && likeStatus === "Like") {
        await this.commentRepository.reduceDislikes(commentId);
        await this.commentRepository.increaseLikes(commentId);
        return {
          code: HTTP_STATUS.NO_CONTENT_204,
        };
      }
    }
  }
}

// export const commentService = new CommentService();
