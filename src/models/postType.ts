export type PostDBType = {
  _id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostCreateType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
};

export type PostOutType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostQueryInputType = {
  searchNameTerm?: string | null;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type CreatePostInBlogInputType = {
  title: string;
  shortDescription: string;
  content: string;
};
