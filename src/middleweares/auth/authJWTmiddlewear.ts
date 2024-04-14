import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../status/status1";
import { jwtService } from "../../application/jwt-service";
import { userService } from "../../services/user-service";

export const authJWTMiddlewear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const token = req.headers.authorization.split(" ")[1];

  const userId = await jwtService.getUserIdByToken(token);

  if (!userId) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  } else {
    req.user = await userService.findUserById(userId);
    next();
  }
};
