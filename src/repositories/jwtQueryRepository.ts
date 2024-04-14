import { ObjectId } from "mongodb";
import { DevicesModel } from "./db";
import { DevicesDbType, RefreshTokenDbType } from "../models/commonTypes";

export const jwtQueryRepository = {
  // async addRefrshTokenInBlackList(
  //   refreshToken: string,
  //   exp: number
  // ): Promise<string | null> {
  //   const token = await refreshTokenCollection.insertOne({
  //     _id: new ObjectId(),
  //     refreshToken,
  //     exp,
  //   });
  //   if (!token) return null;
  //   return refreshToken;
  // },
  // async checkRefrshTokenInBlackList(refreshToken: string): Promise<boolean> {
  //   const token = await refreshTokenCollection.findOne({
  //     refreshToken: refreshToken,
  //   });
  //   if (token) return true;
  //   return false;
  // },
};
