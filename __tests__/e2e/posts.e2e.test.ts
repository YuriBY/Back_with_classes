import request from "supertest";
import { HTTP_STATUS } from "../../src/status/status1";
import { app } from "../../src/app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { appConfig } from "../../src/common/config/appConfi";
import { runDB, stopDB } from "../../src/repositories/db";

describe("/posts", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    appConfig.MONGO_URL = mongoServer.getUri();
    await runDB();
    await request(app).delete("/testing/all-data");
  });

  afterAll(async () => {
    await stopDB();
  });

  it("should return 200 and empty postsArray as items", async () => {
    await request(app).get("/posts").expect(HTTP_STATUS.OK_200).expect({
      pagesCount: 0,
      pageSize: 10,
      page: 1,
      totalCount: 0,
      items: [],
    });
  });

  it("should return 404 for not existing videos", async () => {
    await request(app).get("/posts/-9999999").expect(HTTP_STATUS.NOT_FOUND_404);
  });

  it("shouldn't create post with incorrect data", async () => {
    const login = "admin";
    const password = "qwerty";
    await request(app)
      .post("/posts")
      .auth(login, password)
      .send({
        title: 23,
        shortDescription: "aaa",
        content: "a",
        blogId: "XXX",
      })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  let postIdForTest: string;
  let blogIdForTest: string;

  it("should create post", async () => {
    const login = "admin";
    const password = "qwerty";

    const blog = await request(app)
      .post("/blogs")
      .auth(login, password)
      .send({
        name: "1",
        description: "первый блог",
        websiteUrl: "https://google.com",
      })
      .expect(HTTP_STATUS.CREATED_201);

    const { id: blogId } = blog.body;
    blogIdForTest = blogId;

    const res = await request(app)
      .post("/posts")
      .auth(login, password)
      .send({
        title: "aaaaa",
        shortDescription: "bbbbbbb",
        content: "cccccc",
        blogId,
      })
      .expect(HTTP_STATUS.CREATED_201);
    const { id } = res.body;
    postIdForTest = id;
  });

  it("should update post", async () => {
    const login = "admin";
    const password = "qwerty";
    const blogId = blogIdForTest;
    const res = await request(app)
      .put(`/posts/${postIdForTest}`)
      .auth(login, password)
      .send({
        title: 1111,
        shortDescription: "1111",
        content: "11111",
        blogId,
      })
      .expect(HTTP_STATUS.NO_CONTENT_204);
  });

  it("shouldn't create post with incorrect title", async () => {
    const login = "admin";
    const password = "qwerty";

    const res = await request(app)
      .post("/posts")
      .auth(login, password)
      .send({
        id: 123,
        name: "555",
        description: "qnsvdlbvfl",
        websiteUrl: "https://google.com",
      })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it("should find posts of blog", async () => {
    const login = "admin";
    const password = "qwerty";

    const blog = await request(app)
      .post("/blogs")
      .auth(login, password)
      .send({
        name: "5",
        description: "qnsvdlbvfl",
        websiteUrl: "https://google.com",
      })
      .expect(HTTP_STATUS.CREATED_201);

    const { id: blogId } = blog.body;

    const postToBlog = await request(app)
      .post(`/blogs/${blogId}/posts`)
      .auth(login, password)
      .send({
        title: 23,
        shortDescription: "aaa",
        content: "a",
      })
      .expect(HTTP_STATUS.CREATED_201);

    const { id: postID } = postToBlog.body;

    const res = await request(app)
      .get(`/posts/${postID}`)
      .expect(HTTP_STATUS.OK_200);
  });

  it("shouldn't find posts of blog because wrong blogId", async () => {
    const blogId = "12345556";
    const res = await request(app)
      .get(
        `/blogs/${blogId}/posts?pageNumber=1&pageSize=10&sortBy=createdAt&sortDirection=desc`
      )
      .expect(HTTP_STATUS.NOT_FOUND_404);
  });

  it("should delete post", async () => {
    const login = "admin";
    const password = "qwerty";
    const res = await request(app)
      .delete(`/posts/${postIdForTest}`)
      .auth(login, password)
      .expect(HTTP_STATUS.NO_CONTENT_204);
  });
});
