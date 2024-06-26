export type InputObjForComment = {
  postId: string;
  content: string;
  userId: string;
  userLogin: string;
};

// export type CommentDBType = {
//   _id: string;
//   content: string;
//   commentatorInfo: {
//     userId: string;
//     userLogin: string;
//     postId: string;
//   };
//   createdAt: string;
// };

export enum LikeStatus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

export class CommentDBType {
  constructor(
    public _id: string,
    public content: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
      postId: string;
    },
    public createdAt: string,
    public likes: LikeSchemaType[],
    public likesCount: number,
    public dislikesCount: number
  ) {}
}

export type LikeSchemaType = {
  createdAt: Date;
  status: LikeStatus.None | LikeStatus.Like | LikeStatus.Dislike;
  authorId: string;
};

export type CommentOutType = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus.None | LikeStatus.Like | LikeStatus.Dislike
  }
};

export type CommentsQueryInputType = {
  sortBy: string;
  sortDirection: "asc" | "desc";
  pageNumber: number;
  pageSize: number;
};

export type objForCommentUpdate = {
  commentId: string;
  content: string;
  userId: string;
  userLogin: string;
};

export type objForCommentDelete = {
  commentId: string;
  userId: string;
};
