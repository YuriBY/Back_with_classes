import {
  DevicesDbType,
  IPandURLDbType,
  RefreshTokenDbType,
} from "./../models/commonTypes";
import { BlogDBType } from "../models/blogsType";
import { PostDBType } from "./../models/postType";
import { MongoClient } from "mongodb";
import { UserAccountDBType } from "../models/usersType";
import { appConfig } from "../common/config/appConfi";
import { CommentDBType, LikeSchemaType, LikeStatus } from "../models/comments";
// import { scheduleNextTuesdayEvent } from "../application/clenerOfBlackList";
import mongoose from "mongoose";

const mongoURI = appConfig.MONGO_URL;

if (!mongoURI) {
  throw new Error("!URL does not found");
}

// export const client = new MongoClient(mongoURI);

// export const blogsCollection = client.db().collection<BlogDBType>("blogs");

// const { Schema } = mongoose;
const blogSchema = new mongoose.Schema<BlogDBType>({
  _id: String,
  name: String,
  description: String,
  websiteUrl: String,
  createdAt: String,
  isMembership: Boolean,
});

export const BlogsModel = mongoose.model("blogs", blogSchema);
// export const postCollection = client.db().collection<PostDBType>("posts");
const postSchema = new mongoose.Schema<PostDBType>({
  _id: String,
  title: String,
  shortDescription: String,
  content: String,
  blogId: String,
  blogName: String,
  createdAt: String,
});

export const PostsModel = mongoose.model("posts", postSchema);

// export const usersCollection = client
//   .db()
//   .collection<UserAccountDBType>("users");

const userSchema = new mongoose.Schema<UserAccountDBType>({
  _id: String,
  accountData: {
    userName: String,
    email: String,
    passwordHash: String,
    created: String,
  },
  emailConfirmation: {
    confirmationCode: String,
    expirationDAte: Date,
    isConfirmed: Boolean,
  },
});

export const UsersModel = mongoose.model("users", userSchema);

// export const commentsCollection = client
//   .db()
//   .collection<CommentDBType>("comments");
const likesSchema = new mongoose.Schema<LikeSchemaType>({
  createdAt: { type: Date, required: true },
  status: { type: String, enum: ["None", "Like", "Dislike"], required: true },
  authorId: { type: String, required: true },
});

const commentSchema = new mongoose.Schema<CommentDBType>({
  _id: String,
  content: String,
  commentatorInfo: {
    userId: String,
    userLogin: String,
    postId: String,
  },
  createdAt: String,
  likes: [likesSchema],
  likesCount: { type: Number, required: true },
  dislikesCount: { type: Number, required: true },
});

export const CommentsModel = mongoose.model("comments", commentSchema);

// export const refreshTokenCollection = client
//   .db()
//   .collection<RefreshTokenDbType>("blackList");

// export const logsCollection = client.db().collection<IPandURLDbType>("logs");

const logSchema = new mongoose.Schema<IPandURLDbType>({
  _id: mongoose.Schema.Types.ObjectId,
  ip: String,
  URL: String,
  date: Date,
});

export const LogsModel = mongoose.model("logs", logSchema);

// export const deviceCollection = client
//   .db()
//   .collection<DevicesDbType>("devices");
const deviceSchema = new mongoose.Schema<DevicesDbType>({
  _id: mongoose.Schema.Types.ObjectId,
  ip: String,
  title: String,
  lastActiveDate: String,
  deviceId: String,
  expDate: String,
  userId: String,
});

export const DevicesModel = mongoose.model("devices", deviceSchema);

export async function runDB() {
  try {
    // scheduleNextTuesdayEvent();
    await mongoose.connect(mongoURI);

    // await client.connect();

    // await client.db("project").command({ ping: 1 });
    console.log("Connected successfully to mongoserver");
  } catch {
    console.log("Can not connect to db");

    await mongoose.disconnect();
    // await client.close();
  }
}

export async function stopDB() {
  await mongoose.disconnect();
  // await client.close();
}
