import { BlogRepository } from "../repositories/blog-repository";
import {
  BlogCreateType,
  BlogDBType,
  BlogOutputType,
} from "../models/blogsType";
import crypto from "crypto";
import {
  CreatePostInBlogInputType,
  PostDBType,
  PostOutType,
} from "../models/postType";
import { PostRepository } from "../repositories/post-repository";
import { PostQueryRepository } from "../repositories/postQueryrepository";
import { BlogQueryRepository } from "../repositories/blogQueryRepository";

export class BlogService {
  constructor(
    protected blogRepository: BlogRepository,
    public blogQueryRepository: BlogQueryRepository,
    protected postRepository: PostRepository,
    public postQueryRepository: PostQueryRepository
  ) {}
  async createBlog(createData: BlogCreateType): Promise<BlogOutputType | null> {
    const { name, description, websiteUrl } = createData;
    const newBlog: BlogDBType = {
      _id: crypto.randomUUID(),
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const createdBlog = await this.blogRepository.createBlog(newBlog);
    if (!createdBlog) {
      return null;
    }
    return createdBlog;
  }

  async createPostToBlog(
    blogId: string,
    createPostModel: CreatePostInBlogInputType
  ): Promise<PostOutType | null> {
    const { title, shortDescription, content } = createPostModel;
    const blog = await this.blogQueryRepository.getById(blogId);
    if (!blog) {
      return null;
    }

    const newPost: PostDBType = {
      _id: crypto.randomUUID(),
      title,
      content,
      shortDescription,
      blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const createdPost: PostOutType = await this.postRepository.createPost(
      newPost
    );

    if (!createdPost) {
      return null;
    }

    const post: PostOutType | null = await this.postQueryRepository.getById(
      createdPost.id
    );

    if (!post) {
      return null;
    }
    return post;
  }

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    const blog = await this.blogQueryRepository.getById(id);
    if (!blog) {
      return null;
    }
    return await this.blogRepository.updateBlog(
      id,
      name,
      description,
      websiteUrl
    );
  }

  async deleteBlog(id: string) {
    const blog = await this.blogQueryRepository.getById(id);
    if (!blog) {
      return null;
    }
    return await this.blogRepository.deleteBlog(id);
  }
}
