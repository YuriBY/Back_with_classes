import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../status/status1";


const login1 = "admin";
const pass1 = "qwerty";

export const authMiddlewear = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if (req.headers['authorization'] !== 'Basic YWRtaW46cXdlcnR5') {
  //     res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
  //     return
  // }

  const auth = req.headers["authorization"];
  if (!auth) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const [basic, token] = auth.split(" ");
  if (basic !== "Basic") {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const decodedToken = Buffer.from(token, "base64").toString();

  const [login, pass] = decodedToken.split(":");
  if (login !== login1 || pass !== pass1) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }
  return next();
};
