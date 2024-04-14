import { Request, Response } from "express";
import {
  BlogCreateType,
  BlogOutputType,
  BlogQueryInputType,
} from "../models/blogsType";
import { HTTP_STATUS } from "../status/status1";
import { BlogService } from "../services/blog-service";
import { CreatePostInBlogInputType, PostOutType } from "../models/postType";
import {
  Pagination,
  ParamType,
  RequestWithBodyAndParams,
  RequestWithQuery,
  RequestWithQueryAndParams,
  ResponseType,
  SortData,
} from "../models/commonTypes";

export class BlogController {
  constructor(protected blogService: BlogService) {}
  async getBlogs(
    req: RequestWithQuery<BlogQueryInputType>,
    res: ResponseType<Pagination<BlogOutputType> | {}>
  ) {
    const sortData: SortData = {
      searchNameTerm: req.query.searchNameTerm ?? null,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection === "asc" ? "asc" : "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    };
    const blogs = await this.blogService.blogQueryRepository.getAll(sortData);
    res.send(blogs);
  }

  async getBlog(req: Request, res: Response) {
    const blog = await this.blogService.blogQueryRepository.getById(
      req.params.id
    );
    if (blog) {
      res.send(blog);
    } else {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
  }

  async getPosts(
    req: RequestWithQueryAndParams<ParamType, BlogQueryInputType>,
    res: ResponseType<Pagination<PostOutType> | {}>
  ) {
    const id = req.params.id;

    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    const sortData: SortData = {
      searchNameTerm: id,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection === "asc" ? "asc" : "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    };
    const posts = await this.blogService.postQueryRepository.getAllPostsOfBlog(
      sortData
    );
    if (Object.keys(posts).length == 0) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.send(posts);
  }

  async createBlog(req: Request, res: Response) {
    const { name, description, websiteUrl }: BlogCreateType = req.body;
    const createdBlog: BlogOutputType | null =
      await this.blogService.createBlog({
        name,
        description,
        websiteUrl,
      });
    if (!createdBlog) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    res.status(HTTP_STATUS.CREATED_201).send(createdBlog);
  }

  async createPost(
    req: RequestWithBodyAndParams<ParamType, CreatePostInBlogInputType>,
    res: Response
  ) {
    const id = req.params.id;

    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }

    const createPostFromBlogModel = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
    };

    const post: PostOutType | null = await this.blogService.createPostToBlog(
      id,
      createPostFromBlogModel
    );

    if (!post) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.status(HTTP_STATUS.CREATED_201).send(post);
  }

  async updateBlog(
    req: RequestWithBodyAndParams<ParamType, BlogCreateType>,
    res: Response
  ) {
    const id = req.params.id;
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    const { name, description, websiteUrl } = req.body;
    const updatedBlog = await this.blogService.updateBlog(
      id,
      name,
      description,
      websiteUrl
    );
    if (!updatedBlog) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }

  async deleteBlog(req: Request, res: Response) {
    const id = req.params.id;
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    const blogIsDeleted = await this.blogService.deleteBlog(id);
    if (!blogIsDeleted) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
}
