import request from "supertest";
import { HTTP_STATUS } from "../../src/status/status1";
import { app } from "../../src/app";
import { usersQueryRepository } from "../../src/repositories/usersQueryRepository";
import { MongoMemoryServer } from "mongodb-memory-server";
import { appConfig } from "../../src/common/config/appConfi";
import { runDB, stopDB } from "../../src/repositories/db";
import { testingDtos } from "../utils/testingDtos";

describe("/auth/login", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    appConfig.MONGO_URL = mongoServer.getUri();
    await runDB();
    await request(app).delete("/testing/all-data");
  });

  afterAll(async () => {
    await stopDB();
  });

  it("should return 200", async () => {
    const login1 = "admin";
    const password1 = "qwerty";
    const createdUser = await request(app)
      .post("/users")
      .auth(login1, password1)
      .send(testingDtos.createUserDto);

    await request(app)
      .post("/auth/login")
      .send({
        login: "Misha",
        password: "qwerty",
      })
      .expect(HTTP_STATUS.OK_200);
  });
});
