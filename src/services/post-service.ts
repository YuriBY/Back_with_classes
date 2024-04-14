import { PostRepository } from "./../repositories/post-repository";
import { BlogQueryRepository } from "./../repositories/blogQueryRepository";
import { PostCreateType, PostDBType, PostOutType } from "../models/postType";
import crypto from "crypto";
import { BlogOutputType } from "../models/blogsType";

export class PostService {
  // postRepository: PostRepository;
  // blogQueryRepository: BlogQueryRepository;
  // constructor() {
  //   this.postRepository = new PostRepository();
  //   this.blogQueryRepository = new BlogQueryRepository();
  // }
  constructor(
    protected postRepository: PostRepository,
    protected blogQueryRepository: BlogQueryRepository
  ) {}
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

  async createPost(createData: PostCreateType): Promise<PostOutType | null> {
    const { title, shortDescription, content, blogId } = createData;
    const foundBlog: BlogOutputType | null =
      await this.blogQueryRepository.getById(blogId);
    if (!foundBlog) {
      return null;
    }
    const foundBlogName = foundBlog.name;
    const newPost: PostDBType = {
      _id: crypto.randomUUID(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: foundBlogName,
      createdAt: new Date().toISOString(),
    };
    const createdPost = await this.postRepository.createPost(newPost);
    return createdPost;
  }

  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    return await this.postRepository.updatePost(
      id,
      title,
      shortDescription,
      content,
      blogId
    );
  }

  async deletePost(id: string) {
    return await this.postRepository.deletePost(id);
  }
}
