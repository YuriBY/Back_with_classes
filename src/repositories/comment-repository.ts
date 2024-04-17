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
    // console.log('qqqqq', newComment);
    
    const result = await CommentsModel.create(newComment);
    // console.log('w', result);
    
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
    console.log('r1', result);
    
    if (result.matchedCount === 1) {
      const comment = await CommentsModel.findById(commentId);
      
      if (comment) {
        if (likeStatus === "Like") {
          const result = await CommentsModel.updateOne(
            { _id: commentId },
            { $inc: { likesCount: 1 } }
          );
        } else if (likeStatus === "Dislike") {
          const result = await CommentsModel.updateOne(
            { _id: commentId },
            { $inc: { dislikesCount: 1 } }
          );
        }       
      }
    }
    return result.matchedCount === 1;
  }

  async addAnonimLikes(
    commentId: string,
    likeStatus: string    
  ) {
    console.log('a1', commentId, likeStatus);
    
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
   console.log('a2', result.modifiedCount);
   
    if (result.modifiedCount === 1) {
      if (likeStatus === "Like") {
        const result = await CommentsModel.updateOne(
          { _id: commentId },
          { $inc: { likesCount: 1 } }
        );
      } else if (likeStatus === "Dislike") {
        const result = await CommentsModel.updateOne(
          { _id: commentId },
          { $inc: { dislikesCount: 1 } }
        );
      }
    }
    return result.modifiedCount === 1;
  }

  async increaseLikes(commentId: string) {
    const result = await CommentsModel.updateOne(
      { _id: commentId },
      { $inc: { likesCount: 1 } }
    )
    return 1     
    }
  

  async reduceLikes(commentId: string) {
    const result = await CommentsModel.updateOne(
      { _id: commentId },
      { $inc: { likesCount: -1 } }
    );
      return 1;
    }

  async increaseDislikes(commentId: string) {
    const result = await CommentsModel.updateOne(
      { _id: commentId },
      { $inc: { dislikesCount: 1 } }
    );
      return 1;
    }
  
  async reduceDislikes(commentId: string) {
    const result = await CommentsModel.updateOne(
      { _id: commentId },
      { $inc: { dislikesCount: -1 } }
    );
      return 1;
    }
}

// export const commentRepository = new CommentRepository();
