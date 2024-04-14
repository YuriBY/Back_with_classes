import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "../status/status1";
import { ParamType, RequestWithParams } from "../models/commonTypes";
import { authREfreshJWTMiddlewear } from "../middleweares/auth/authRefreshJWTmiddlewear";
import { deviceQueryRepository } from "../repositories/deviceQueryRepository";
import { deviceRepository } from "../repositories/deviceRepository";
import jwt, { JwtPayload } from "jsonwebtoken";

export const devicesRoute = Router({});

devicesRoute.get(
  "/",
  authREfreshJWTMiddlewear,
  async (req: Request, res: Response) => {
    const result = await deviceQueryRepository.getAll(req.user!._id);

    res.status(HTTP_STATUS.OK_200).send(result);
  }
);

devicesRoute.delete(
  "/",
  authREfreshJWTMiddlewear,
  async (req: Request, res: Response) => {
    const cookie_refreshtoken = req.cookies.refreshToken;
   

    const decoded = jwt.decode(cookie_refreshtoken) as JwtPayload;
      

    const result = await deviceRepository.deleteAllDeviceExceptOne(
      decoded.userId,
      decoded.deviceId
    );
   
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);

devicesRoute.delete(
  "/:id",
  authREfreshJWTMiddlewear,
  async (req: RequestWithParams<ParamType>, res: Response) => {
    const cookie_refreshtoken = req.cookies.refreshToken;
    const decoded = jwt.decode(cookie_refreshtoken) as JwtPayload;

    const foundDevice = await deviceQueryRepository.findDeviceWithDeviceId(
      req.params.id
    );

    if (!foundDevice) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }

    const result = await deviceRepository.deleteDevice(
      req.params.id,
      decoded.userId
    );
    if (!result) {
      res.sendStatus(HTTP_STATUS.FORBIDDEN_403);
    } else {
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);
