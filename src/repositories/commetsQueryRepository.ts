import { CommentsModel } from "./db";
import { Pagination } from "../models/commonTypes";
import {
  CommentDBType,
  CommentOutType,
  CommentsQueryInputType,
  LikeStatus,
} from "../models/comments";
import { Result } from "../models/resultTypes";
import { HTTP_STATUS } from "../status/status1";

export class CommentsQueryRepository {
  async getAllComments(
    postId: string,
    sortData: CommentsQueryInputType,
    userId: string | undefined
  ): Promise<Pagination<CommentOutType>> {
    const { sortBy, sortDirection, pageNumber, pageSize } = sortData;
    let filter = {
      "commentatorInfo.postId": postId,
    };

    const result: CommentDBType[] = await CommentsModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const totalCount = await CommentsModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    if (!result)
      return {
        pagesCount,
        pageSize,
        page: pageNumber,
        totalCount,
        items: [],
      };

      return {
        pagesCount,
        pageSize,
        page: pageNumber,
        totalCount,
        items: result.map(({ _id, content, commentatorInfo, createdAt, likes, likesCount, dislikesCount}) => {
          const myStatus = likes.find(like => like.authorId === userId)?.status || LikeStatus.None;
      
          return {
            id: _id,
            content: content,
            commentatorInfo: {
              userId: commentatorInfo.userId,
              userLogin: commentatorInfo.userLogin,
            },
            createdAt: createdAt,
            likesInfo: {
              likesCount: likesCount,
              dislikesCount: dislikesCount,
              myStatus: myStatus,
            },           
          };
        }),
      };
      
  }
  
  commentMapper(comment: CommentDBType, userId?: string): CommentOutType {
    return {
      id: comment._id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus: comment.likes.find((like) => like.authorId === userId)?.status || LikeStatus.None
      }
    };
  }

  async getById(commentId: string, userId?: string | undefined ): Promise<CommentOutType | null> {
    const result: CommentDBType | null = await CommentsModel.findOne({
      _id: commentId,
    });
    if (!result) return null;
    return this.commentMapper(result, userId);
  }

  async findDbTypeById(id: string): Promise<CommentDBType | Result> {
    const result: CommentDBType | null = await CommentsModel.findOne({
      _id: id,
    });
    if (!result)
      return {
        code: HTTP_STATUS.NOT_FOUND_404,
      };
    return result;
  }
}

// export const commentsQueryRepository = new CommentsQueryRepository();
