import { PostQueryRepository } from "../repositories/postQueryrepository";
import { Request, Response } from "express";
import { PostCreateType, PostQueryInputType } from "../models/postType";
import { HTTP_STATUS } from "../status/status1";
import { PostService } from "../services/post-service";
import {
  Content,
  Pagination,
  ParamType,
  RequestWithBodyAndParams,
  RequestWithQuery,
  RequestWithQueryAndParams,
  SortData,
} from "../models/commonTypes";
import { CommentService } from "../services/comment-service";
import {
  CommentOutType,
  CommentsQueryInputType,
  InputObjForComment,
} from "../models/comments";

export class PostController {
  // commentService: CommentService;
  // postService: PostService;
  // postQueryRepository: PostQueryRepository;

  // constructor() {
  //   this.commentService = new CommentService();
  //   this.postService = new PostService();
  //   this.postQueryRepository = new PostQueryRepository();
  // }

  constructor(
    protected commentService: CommentService,
    protected postService: PostService,
    protected postQueryRepository: PostQueryRepository
  ) {}
  async getPosts(req: RequestWithQuery<PostQueryInputType>, res: Response) {
    const sortData: SortData = {
      searchNameTerm: null,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection === "asc" ? "asc" : "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    };

    const posts = await this.postQueryRepository.getAll(sortData);
    res.send(posts);
  }

  async getPost(req: Request, res: Response) {
    const post = await this.postQueryRepository.getById(req.params.id);
    if (post) {
      res.send(post);
    } else {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
  }

  async createPost(req: Request, res: Response) {
    const { title, shortDescription, content, blogId } = req.body;
    const createdPost: PostCreateType | null =
      await this.postService.createPost({
        title,
        shortDescription,
        content,
        blogId,
      });
    if (!createdPost) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.status(HTTP_STATUS.CREATED_201).send(createdPost);
  }

  async updatePost(req: Request, res: Response) {
    const post = await this.postQueryRepository.getById(req.params.id);
    if (!post) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      const { title, shortDescription, content, blogId } = req.body;
      // const id = +req.params.id;
      this.postService.updatePost(
        req.params.id,
        title,
        shortDescription,
        content,
        blogId
      );
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }

  async deletePost(req: Request, res: Response) {
    const post = await this.postQueryRepository.getById(req.params.id);
    if (!post) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      this.postService.deletePost(req.params.id);
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }

  async createComment(
    req: RequestWithBodyAndParams<ParamType, Content>,
    res: Response
  ) {
    const newObjForComment: InputObjForComment = {
      postId: req.params.id,
      content: req.body.content,
      userId: req.user!._id,
      userLogin: req.user!.accountData.userName,
    };
    const newComment: CommentOutType | null =
      await this.commentService.sendComment(newObjForComment);
    if (!newComment) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.status(HTTP_STATUS.CREATED_201).send(newComment);
  }

  async getComments(
    req: RequestWithQueryAndParams<ParamType, CommentsQueryInputType>,
    res: Response
  ) {
    const sortData: CommentsQueryInputType = {
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection === "asc" ? "asc" : "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    };
    const commentsToPost: Pagination<CommentOutType> =
      await this.commentService.commentsQueryRepository.getAllComments(
        req.params.id,
        sortData
      );
    if (commentsToPost.items.length == 0) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.send(commentsToPost);
  }
}
