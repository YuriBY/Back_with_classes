import { Request } from "express";
import { UserAccountDBType } from "./../models/usersType";

declare global {
  declare namespace Express {
    export interface Request {
      user: UserAccountDBType | null;
    }
  }
}
