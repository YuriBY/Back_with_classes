import request from "supertest";
import { HTTP_STATUS } from "../../src/status/status1";
import { app } from "../../src/app";
import { usersQueryRepository } from "../../src/repositories/usersQueryRepository";
import { MongoMemoryServer } from "mongodb-memory-server";
import { appConfig } from "../../src/common/config/appConfi";
import { runDB, stopDB } from "../../src/repositories/db";

describe("/users", () => {
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
    const login1 = "admin";
    const password1 = "qwerty";
    const createdUser = await request(app)
      .get("/users")
      .auth(login1, password1)
      .expect(HTTP_STATUS.OK_200)
      .expect({
        pagesCount: 0,
        pageSize: 10,
        page: 1,
        totalCount: 0,
        items: [],
      });
  });

  it("should return 404 for not existing users", async () => {
    const login1 = "admin";
    const password1 = "qwerty";
    await request(app)
      .get("/users/-9999999")
      .auth(login1, password1)
      .expect(HTTP_STATUS.NOT_FOUND_404);
  });

  it("shouldn't create user with incorrect login", async () => {
    const login1 = "admin";
    const password1 = "qwerty";
    await request(app)
      .post("/users")
      .auth(login1, password1)
      .send({
        login: "ыфваапы",
        password: "string",
        email: "qeq@on.by",
      })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it("shouldn't create user with incorrect password", async () => {
    const login1 = "admin";
    const password1 = "qwerty";
    await request(app)
      .post("/users")
      .auth(login1, password1)
      .send({
        login: "ASFee",
        password: "122",
        email: "qeq@on.by",
      })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it("shouldn't create user with incorrect email", async () => {
    const login1 = "admin";
    const password1 = "qwerty";
    await request(app)
      .post("/users")
      .auth(login1, password1)
      .send({
        login: "ASFee",
        password: "sggggggh",
        email: "qeqon.by",
      })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it("shouldn't create user without auth", async () => {
    await request(app)
      .post("/users")
      .send({
        login: "ASFee",
        password: "sggggggh",
        email: "qeqon.by",
      })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  let userIdForTest: string;
  let hashUserForTest: string;
  it("should create user", async () => {
    const login1 = "admin";
    const password1 = "qwerty";
    const login = "ASFee";
    const user = await request(app)
      .post("/users")
      .auth(login1, password1)
      .send({
        login,
        password: "gddh2334",
        email: "qeq@on.by",
      })
      .expect(HTTP_STATUS.CREATED_201);
    const { id: userId } = user.body;
    userIdForTest = userId;

    const foundedUser = await usersQueryRepository.getByLoginOrEmail(login);
    if (foundedUser) {
      hashUserForTest = foundedUser.hash;
    }
  });

  it("should get users", async () => {
    const login1 = "admin";
    const password1 = "qwerty";
    const login = "ASFee";
    await request(app)
      .get(`/users?searchLoginTerm=${login}`)
      .auth(login1, password1)
      .expect(HTTP_STATUS.OK_200);
  });

  it("should not get users", async () => {
    const login1 = "admin";
    const password1 = "qwerty";
    await request(app)
      .get(`/users?searchLoginTerm=asdfsg`)
      .auth(login1, password1)
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it("should create user by SuperAdmin", async () => {
    const login1 = "admin";
    const password1 = "qwerty";
    const login = "ASFee";
    const user = await request(app)
      .post("/auth/login")
      .auth(login1, password1)
      .send({
        login,
        password: "gddh2334",
        email: "1234@on.by",
      })
      .expect(HTTP_STATUS.NO_CONTENT_204);
  });

  it("should delete user", async () => {
    const login1 = "admin";
    const password1 = "qwerty";
    const res = await request(app)
      .delete(`/users/${userIdForTest}`)
      .auth(login1, password1)
      .expect(HTTP_STATUS.NO_CONTENT_204);
  });
});
