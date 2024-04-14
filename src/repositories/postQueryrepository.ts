import { Pagination, SortData } from "../models/commonTypes";
import { PostDBType, PostOutType } from "../models/postType";
import { PostsModel } from "./db";

export class PostQueryRepository {
  async getAll(sortdata: SortData) {
    const { pageNumber, pageSize, sortBy, sortDirection } = sortdata;

    const posts: PostDBType[] = await PostsModel.find({})
      .sort({ sortBy: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const totalCount = await PostsModel.countDocuments({});
    const pagesCount = Math.ceil(totalCount / pageSize);

    if (!posts) return [];
    return {
      pagesCount,
      pageSize,
      page: pageNumber,
      totalCount,
      items: posts.map(({ _id, ...rest }) => ({ id: _id, ...rest })),
    };
  }

  async getById(id: string): Promise<PostOutType | null> {
    const result: PostDBType | null = await PostsModel.findOne({ _id: id });
    if (!result) return null;
    return this.postMapper(result);
  }

  async getAllPostsOfBlog(
    sortData: SortData
  ): Promise<Pagination<PostOutType> | {}> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      sortData;

    let filter = {};
    if (searchNameTerm) {
      filter = {
        blogId: {
          $regex: sortData.searchNameTerm,
        },
      };
    }
    const result: PostDBType[] = await PostsModel.find(filter)
      .sort({ sortBy: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const totalCount = await PostsModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    if (!result.length) return {};
    return {
      pagesCount,
      pageSize,
      page: pageNumber,
      totalCount,
      items: result.map(({ _id, ...rest }) => ({ id: _id, ...rest })),
    };
  }

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
}
