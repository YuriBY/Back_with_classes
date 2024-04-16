import { HTTP_STATUS } from "./../status/status1";
import { PostOutType } from "../models/postType";
import crypto from "crypto";
import {
  CommentDBType,
  CommentOutType,
  InputObjForComment,
  LikeStatus,
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
    userId: string | undefined
  ) {
    const foundedComment: CommentDBType | Result =
      await this.commentsQueryRepository.findDbTypeById(commentId);
    if ("code" in foundedComment) {
      return {
        code: HTTP_STATUS.NOT_FOUND_404,
      };
    }
    if (!userId) {
      const result = await this.commentRepository.addAnonimLikes(
        commentId,
        likeStatus,
      );
      return {
        code: HTTP_STATUS.NO_CONTENT_204,
      };
    }

    //попадаем сюда только в случае, если комментарий нашелся
    // дальше проверяем свойство likes. 
    let likeInfo = foundedComment.likes.find(
      (like) => like.authorId === userId
    );
    // Если массив пуст или отсуствует сведения о лайке от определенного автора, то вернется undefined
    if (!likeInfo) {
      const result = await this.commentRepository.updateLikes(
        commentId,
        likeStatus,
        userId
      );
      return {
        code: HTTP_STATUS.NO_CONTENT_204,
      }; //дальше рассматриваем случай, когда находится элемент по автору
    } else {
      if (likeInfo!.status === likeStatus) { //если повторно пришел тот же статус, то ничего не делаем
        return {
          code: HTTP_STATUS.NO_CONTENT_204,
        };
      }

      if (likeInfo.status !== likeStatus && likeStatus === LikeStatus.Like) {
        await this.commentRepository.increaseLikes(commentId);        
        if (likeInfo.status === LikeStatus.Dislike) {
          await this.commentRepository.reduceDislikes(commentId)
        }
        likeInfo.status = likeStatus
        return {
          code: HTTP_STATUS.NO_CONTENT_204,
        };
      }

      if (likeInfo.status !== likeStatus && likeStatus === LikeStatus.Dislike) {
        await this.commentRepository.increaseDislikes(commentId);
        if (likeInfo.status === LikeStatus.Like) {
          await this.commentRepository.reduceLikes(commentId)
        }
        likeInfo.status = likeStatus
        return {
          code: HTTP_STATUS.NO_CONTENT_204,
        };
      }

      if (likeInfo.status !== likeStatus && likeStatus === LikeStatus.None) {
        if (likeInfo.status === LikeStatus.Like) {
          await this.commentRepository.reduceLikes(commentId)
        } else {
          await this.commentRepository.reduceDislikes(commentId)
        }
        likeInfo.status = likeStatus
        return {
          code: HTTP_STATUS.NO_CONTENT_204,
        };
      }
    }
    return {
      code: HTTP_STATUS.NO_CONTENT_204,
    };
  }
}

// export const commentService = new CommentService();
