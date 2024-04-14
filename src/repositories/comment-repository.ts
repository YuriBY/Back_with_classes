import { CommentOutType } from "./../models/comments";
import { CommentDBType } from "../models/comments";
import { CommentsModel } from "./db";

export class CommentRepository {
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

  async createComment(newComment: CommentDBType): Promise<CommentOutType> {
    const result = await CommentsModel.insertMany({ newComment });
    return this.commentMapper(newComment);
  }

  async updateComment(commentId: string, content: string) {
    const result = await CommentsModel.updateOne(
      { _id: commentId },
      { content }
    );
    return result.matchedCount === 1;
  }

  async deleteComment(id: string) {
    const result = await CommentsModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}

// export const commentRepository = new CommentRepository();
