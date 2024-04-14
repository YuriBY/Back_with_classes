import { CommentsModel } from "./db";
import { Pagination } from "../models/commonTypes";
import {
  CommentDBType,
  CommentOutType,
  CommentsQueryInputType,
} from "../models/comments";
import { Result } from "../models/resultTypes";
import { HTTP_STATUS } from "../status/status1";

export class CommentsQueryRepository {
  async getAllComments(
    postId: string,
    sortData: CommentsQueryInputType
  ): Promise<Pagination<CommentOutType>> {
    const { sortBy, sortDirection, pageNumber, pageSize } = sortData;
    let filter = {
      "commentatorInfo.postId": postId,
    };

    const result: CommentDBType[] = await CommentsModel.find(filter)
      .sort({ sortBy: sortDirection })
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
      items: result.map(({ _id, commentatorInfo, ...rest }) => ({
        id: _id,
        commentatorInfo: {
          userId: commentatorInfo.userId,
          userLogin: commentatorInfo.userLogin,
        },
        ...rest,
      })),
    };
  }

  commentMapper(comment: CommentDBType): CommentOutType {
    return {
      id: comment._id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
    };
  }

  async getById(id: string): Promise<CommentOutType | null> {
    const result: CommentDBType | null = await CommentsModel.findOne({
      _id: id,
    });
    if (!result) return null;
    return this.commentMapper(result);
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
