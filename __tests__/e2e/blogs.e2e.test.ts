import request from "supertest";
import { HTTP_STATUS } from "../../src/status/status1";
import { app } from "../../src/app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { appConfig } from "../../src/common/config/appConfi";
import { runDB, stopDB } from "../../src/repositories/db";

describe("/blogs", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    appConfig.MONGO_URL = mongoServer.getUri();
    await runDB();
    await request(app).delete("/testing/all-data");
  });

  afterAll(async () => {
    await stopDB();
  });

  it("should return 200 and empty blogsArray as items", async () => {
    await request(app).get("/blogs").expect(HTTP_STATUS.OK_200).expect({
      pagesCount: 0,
      pageSize: 10,
      page: 1,
      totalCount: 0,
      items: [],
    });
  });

  it("should return 404 for not existing blogs", async () => {
    await request(app).get("/blogs/-9999999").expect(HTTP_STATUS.NOT_FOUND_404);
  });

  it("shouldn't create blog with incorrect data", async () => {
    const login = "admin";
    const password = "qwerty";

    // // Формируем строку аутентификации в формате "логин:пароль"
    // const authString = `${login}:${password}`;

    // // Кодируем строку аутентификации в формате Base64
    // const encodedAuthString = Buffer.from(authString).toString("base64");

    await request(app)
      .post("/blogs")
      .auth(login, password)
      .send({
        name: "55",
        description: "q",
        websiteUrl: "https:getPositionOfLineAndCharacter.com",
      })
      // Добавляем заголовок Authorization с закодированной строкой аутентификации
      // .set("Authorization", `Basic ${encodedAuthString}`)
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it("should create blog with correct data", async () => {
    const login = "admin";
    const password = "qwerty";

    const res = await request(app)
      .post("/blogs")
      .auth(login, password)
      .send({
        name: "5",
        description: "qnsvdlbvfl",
        websiteUrl: "https://google.com",
      })
      .expect(HTTP_STATUS.CREATED_201);
  });

  let blogidForTest: string;

  it("should create second blog with correct data", async () => {
    const login = "admin";
    const password = "qwerty";

    const res = await request(app)
      .post("/blogs")
      .auth(login, password)
      .send({
        name: "2",
        description: "2222",
        websiteUrl: "https://google.com",
      })
      .expect(HTTP_STATUS.CREATED_201);

    const { id } = res.body;

    // Проверяем, что id существует и не пустой
    expect(id).toBeDefined();
    expect(id).not.toBeNull();
    blogidForTest = id;
  });

  it("should find blog by id (good UUID)", async () => {
    const login = "admin";
    const password = "qwerty";
    const id = blogidForTest;

    const res = await request(app)
      .get(`/blogs/${id}`)
      .auth(login, password)
      .expect(HTTP_STATUS.OK_200);
  });

  it("should update blog with correct data", async () => {
    const login = "admin";
    const password = "qwerty";
    const id = blogidForTest;

    const res = await request(app)
      .put(`/blogs/${id}`)
      .auth(login, password)
      .send({
        name: "15",
        description: "after updating",
        websiteUrl: "https://onlener.by",
      })
      .expect(HTTP_STATUS.NO_CONTENT_204);
  });

  it("should not delete blog because wrong id (not UUID)", async () => {
    const login = "admin";
    const password = "qwerty";
    const id = "1234";

    const res = await request(app)
      .delete(`/blogs/${id}`)
      .auth(login, password)
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it("should not delete blog because wrong id (good UUID)", async () => {
    const login = "admin";
    const password = "qwerty";
    const id = "d15e1d7c-dad3-4f15-819d-cc8e01e51a6d";

    const res = await request(app)
      .delete(`/blogs/${id}`)
      .auth(login, password)
      .expect(HTTP_STATUS.NOT_FOUND_404);
  });

  it("shouldn't create blog with incorrect title", async () => {
    const login = "admin";
    const password = "qwerty";

    // // Формируем строку аутентификации в формате "логин:пароль"
    // const authString = `${login}:${password}`;

    // // Кодируем строку аутентификации в формате Base64
    // const encodedAuthString = Buffer.from(authString).toString("base64");
    const res = await request(app)
      .post("/blogs")
      .auth(login, password)
      .send({
        title: 23,
        shortDescription: "aaa",
        content: "a",
        blogId: "XXX",
      })
      // .set("Authorization", `Basic ${encodedAuthString}`)
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it("shouldn't create post to blog with incorrect blogId (not UUID)", async () => {
    const login = "admin";
    const password = "qwerty";
    const blogId = "12233245";
    const res = await request(app)
      .post(`/blogs/${blogId}/posts`)
      .auth(login, password)
      .send({
        title: 23,
        shortDescription: "aaa",
        content: "a",
      })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it("shouldn't create post to blog with incorrect blogId (UUID not found)", async () => {
    const login = "admin";
    const password = "qwerty";
    const blogId = "d15e1d7c-dad3-4f15-819d-cc8e01e51a6d";
    const res = await request(app)
      .post(`/blogs/${blogId}/posts`)
      .auth(login, password)
      .send({
        title: 23,
        shortDescription: "aaa",
        content: "a",
      })
      .expect(HTTP_STATUS.NOT_FOUND_404);
  });

  it("should create post to blog", async () => {
    const login = "admin";
    const password = "qwerty";
    const blogId = blogidForTest;

    const res = await request(app)
      .post(`/blogs/${blogId}/posts`)
      .auth(login, password)
      .send({
        title: 23,
        shortDescription: "aaa",
        content: "a",
      })
      .expect(HTTP_STATUS.CREATED_201);
  });

  it("should delete blog", async () => {
    const login = "admin";
    const password = "qwerty";
    const id = blogidForTest;

    const res = await request(app)
      .delete(`/blogs/${id}`)
      .auth(login, password)
      .expect(HTTP_STATUS.NO_CONTENT_204);
  });
});
