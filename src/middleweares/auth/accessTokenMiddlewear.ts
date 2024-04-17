import { Request, Response, NextFunction } from "express";
import { jwtService } from "../../application/jwt-service";
import { userService } from "../../services/user-service";
import { ParamType, RequestWithParams, RequestWithQueryAndParams } from "../../models/commonTypes";
import { CommentsQueryInputType } from "../../models/comments";

export type RequestType<ParamType, QueryType> = 
  QueryType extends undefined ? RequestWithParams<ParamType> : RequestWithQueryAndParams<ParamType, QueryType>;


export const accessTokenMiddlewear = async (
  req: RequestType<ParamType, CommentsQueryInputType>,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    const userId = await jwtService.getUserIdByToken(token);
  
    if (userId) {
      req.user = await userService.findUserById(userId);
      next();
      return
    }    
  }
  next()
};
