import express, { Request, Response } from "express";
import { blogRoute } from "./routes/blog-routes";
import { postRoute } from "./routes/post-routes";
import {
  BlogsModel,
  CommentsModel,
  PostsModel,
  UsersModel,
} from "./repositories/db";
import { HTTP_STATUS } from "./status/status1";
import { authRoute } from "./routes/auth-routes";
import { userRoute } from "./routes/users-routes";
import { commentsRoute } from "./routes/comments-routes";
import { emailRouter } from "./routes/email-routes";
import cookieParser from "cookie-parser";
import { devicesRoute } from "./routes/devices-routes";

export const app = express();

const jsonBodyMiddlewear = express.json();
app.set("trust proxy", true);
app.use(jsonBodyMiddlewear);
app.use(cookieParser());

app.use("/blogs", blogRoute);
app.use("/posts", postRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/comments", commentsRoute);
app.use("/email", emailRouter);
app.use("/security/devices", devicesRoute);

app.delete("/testing/all-data", async (req: Request, res: Response) => {
  await BlogsModel.deleteMany({});
  await PostsModel.deleteMany({});
  await UsersModel.deleteMany({});
  await CommentsModel.deleteMany({});
  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});
