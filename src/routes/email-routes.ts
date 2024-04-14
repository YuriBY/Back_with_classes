import { Router, Response } from "express";
import { HTTP_STATUS } from "../status/status1";
import { RequestWithBody } from "../models/commonTypes";
import { EmailToSendType } from "../models/emailToSendType";
import { emailAdapter } from "../adapters/emailAdapter";

export const emailRouter = Router({});

emailRouter.post(
  "/send",

  async (req: RequestWithBody<EmailToSendType>, res: Response) => {
    await emailAdapter.sendMail(req.body.email, req.body.subject);

    res
      .status(HTTP_STATUS.OK_200)
      .send({ email: req.body.email, subject: req.body.subject });
  }
);
