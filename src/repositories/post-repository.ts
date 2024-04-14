import { PostCreateType, PostDBType, PostOutType } from "../models/postType";
import { PostsModel } from "./db";
import crypto from "crypto";

export class PostRepository {
  postMapper(post: PostDBType): PostOutType {
    return {
      id: post._id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  }

  async createPost(newPost: PostDBType): Promise<PostOutType> {
    const result = await PostsModel.insertMany([newPost]);
    return this.postMapper(newPost);
  }

  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    const result = await PostsModel.updateOne(
      { _id: id },
      { title, shortDescription, content, blogId }
    );
    return result.matchedCount === 1;
  }

  async deletePost(id: string) {
    const result = await PostsModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
