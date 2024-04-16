import { CommentOutType, LikeStatus } from "./../models/comments";
import { CommentDBType } from "../models/comments";
import { CommentsModel } from "./db";

export class CommentRepository {
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

  async createComment(newComment: CommentDBType, userId?: string): Promise<CommentOutType> {
    const result = await CommentsModel.insertMany({ newComment });
    return this.commentMapper(newComment, userId);
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

  async updateLikes(
    commentId: string,
    likeStatus: string,
    userId: string
  ) {
    const result = await CommentsModel.updateOne(
      { _id: commentId },
      {
        $push: {
          likes: {
            createdAt: new Date(),
            status: likeStatus,
            authorId: userId,
          },
        },
      },
    );
   
    if (result.matchedCount === 1) {
      const comment = await CommentsModel.findById(commentId);
      if (comment) {
        if (likeStatus === "Like") {
          comment.likesCount++;
        } else if (likeStatus === "Dislike") {
          comment.dislikesCount++;
        }
        await comment.save();
      }
    }
    return result.matchedCount === 1;
  }

  async addAnonimLikes(
    commentId: string,
    likeStatus: string    
  ) {
    const result = await CommentsModel.updateOne(
      { _id: commentId },
      {
        $push: {
          likes: {
            createdAt: new Date(),
            status: likeStatus,
            authorId: 'None',
          },
        },
      },
    );
   
    if (result.matchedCount === 1) {
      const comment = await CommentsModel.findById(commentId);
      if (comment) {
        if (likeStatus === "Like") {
          comment.likesCount++;
        } else if (likeStatus === "Dislike") {
          comment.dislikesCount++;
        }
        await comment.save();
      }
    }
    return result.matchedCount === 1;
  }

  async increaseLikes(commentId: string) {
    const comment = await CommentsModel.findById(commentId);
    if (comment) {
      comment.likesCount++;
      await comment.save();
    }
    return 1     
    }
  

  async reduceLikes(commentId: string) {
    const comment = await CommentsModel.findById(commentId);
    if (comment) {
      comment.likesCount--;
      await comment.save();
    }
      return 1;
    }

  async increaseDislikes(commentId: string) {
    const comment = await CommentsModel.findById(commentId);
    if (comment) {
      comment.dislikesCount++;
      await comment.save();
    }
      return 1;
    }
  
  async reduceDislikes(commentId: string) {
    const comment = await CommentsModel.findById(commentId);
    if (comment) {
      comment.dislikesCount--;
      await comment.save();
    }
      return 1;
    }
}

// export const commentRepository = new CommentRepository();
