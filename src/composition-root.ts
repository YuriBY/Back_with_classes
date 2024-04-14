import { CommentService } from "./services/comment-service";
import { PostService } from "./services/post-service";
import { CommentsQueryRepository } from "./repositories/commetsQueryRepository";
import { CommentRepository } from "./repositories/comment-repository";
import { PostQueryRepository } from "./repositories/postQueryrepository";
import { PostRepository } from "./repositories/post-repository";
import { BlogQueryRepository } from "./repositories/blogQueryRepository";
import { BlogRepository } from "./repositories/blog-repository";
import { BlogService } from "./services/blog-service";
import { PostController } from "./routes/post-controller";
import { CommentController } from "./routes/comments-controller";
import { BlogController } from "./routes/blog-controller";

const blogrepository = new BlogRepository();
const blogQueryRepository = new BlogQueryRepository();

const postRepository = new PostRepository();
const postQueryRepository = new PostQueryRepository();

const commentRepository = new CommentRepository();
const commentsQueryRepository = new CommentsQueryRepository();

const blogService = new BlogService(
  blogrepository,
  blogQueryRepository,
  postRepository,
  postQueryRepository
);
const postService = new PostService(postRepository, blogQueryRepository);
const commentService = new CommentService(
  commentRepository,
  commentsQueryRepository,
  postQueryRepository
);

export const postController = new PostController(
  commentService,
  postService,
  postQueryRepository
);
export const commentsController = new CommentController(commentService);

export const blogController = new BlogController(blogService);
