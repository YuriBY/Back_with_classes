import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../status/status1";
import { logsRepository } from "../../repositories/logsRepository";
import { IPandURLDbType } from "../../models/commonTypes";
import { ObjectId } from "mongodb";

export const amountOfRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientIp = Array.isArray(req.headers["x-forwarded-for"])
    ? req.headers["x-forwarded-for"][0]
    : req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const url = req.originalUrl;

  const requestData: IPandURLDbType = {
    _id: new ObjectId(),
    ip: clientIp || "noIP",
    URL: url,
    date: new Date(),
  };

  const result: number = await logsRepository.countRequests(requestData);
    
  const savedData = await logsRepository.saveToDb(requestData);

  if (!savedData) {
    console.error("Error saving request data to the database:");
    res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
    return;
  }

  if (result >= 5) {
    res.sendStatus(HTTP_STATUS.TOO_MANY_REQEUSTS_429);
    return;
  }

  next();
};
