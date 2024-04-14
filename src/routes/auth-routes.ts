import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "../status/status1";
import { authValidator } from "../validators/auth-validator";
import { authService } from "../services/auth-service";
import { RequestWithBody } from "../models/commonTypes";
import {
  AuthBodyType,
  AuthRegistrationbBodyType,
  AuthUserType,
  CodeConfirmationOfRegistration,
  EmailConfirmationResendingType,
  EmailRecoveryInputType,
} from "../models/authType";
import { jwtService } from "../application/jwt-service";
import { UserAccountDBType, UserAccountOutType } from "../models/usersType";
import { authJWTMiddlewear } from "../middleweares/auth/authJWTmiddlewear";
import { usersQueryRepository } from "../repositories/usersQueryRepository";
import {
  emailValidation,
  newPasswordValidation,
  userValidator,
} from "../validators/user-validators";
import { authREfreshJWTMiddlewear } from "../middleweares/auth/authRefreshJWTmiddlewear";
import { deviceQueryRepository } from "../repositories/deviceQueryRepository";
import { amountOfRequests } from "../middleweares/amountOfRequests/amountOfRequests-middlewear";
import jwt, { JwtPayload } from "jsonwebtoken";
import { deviceRepository } from "../repositories/deviceRepository";
import { bcryprService } from "../services/bcrypt-service";
import { usersRepository } from "../repositories/user-repository";

export const authRoute = Router({});

authRoute.post(
  "/login",
  amountOfRequests,
  authValidator(),
  async (req: RequestWithBody<AuthBodyType>, res: Response) => {
    const receivedCredential: AuthBodyType = {
      loginOrEmail: req.body.loginOrEmail,
      password: req.body.password,
    };

    const user: UserAccountDBType | null = await authService.checkCredential(
      receivedCredential
    );

    if (!user) {
      res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
      return;
    }
    const clientIp = Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const clientTitle = req.headers["user-agent"] || "Unknown device";

    const token_A = await jwtService.createJWT_A(user);
    const token_R = await jwtService.createJWT_R(
      user,
      clientIp || "noIP",
      clientTitle
    );

    res.cookie("refreshToken", token_R, {
      httpOnly: true,
      secure: true,
    });
    res.status(HTTP_STATUS.OK_200).send(token_A.data);
  }
);

authRoute.get("/me", authJWTMiddlewear, async (req: Request, res: Response) => {
  const userOutCredential: AuthUserType = {
    login: req.user!.accountData.userName,
    email: req.user!.accountData.email,
    userId: req.user!._id,
  };
  res.status(HTTP_STATUS.OK_200).send(userOutCredential);
});

authRoute.post(
  "/registration",
  amountOfRequests,
  userValidator(),
  async (req: RequestWithBody<AuthRegistrationbBodyType>, res: Response) => {
    const receivedCredential: AuthRegistrationbBodyType = {
      login: req.body.login,
      email: req.body.email,
      password: req.body.password,
    };

    const isUserEmailExists = await usersQueryRepository.getByLoginOrEmail(
      req.body.email
    );

    if (isUserEmailExists) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).send({
        errorsMessages: [
          {
            message: "Input Email Exists",
            field: "email",
          },
        ],
      });
      return;
    }

    const isUserLoginExists = await usersQueryRepository.getByLoginOrEmail(
      req.body.login
    );

    if (isUserLoginExists) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).send({
        errorsMessages: [
          {
            message: "Input Login Exists",
            field: "login",
          },
        ],
      });
      return;
    }

    const user = await authService.createUser(receivedCredential);

    if (!user) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);

authRoute.post(
  "/registration-confirmation",
  amountOfRequests,
  async (
    req: RequestWithBody<CodeConfirmationOfRegistration>,
    res: Response
  ) => {
    const result = await authService.confirmEmail(req.body.code);

    if (!result) {
      res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .send({ errorsMessages: [{ message: "Bad code", field: "code" }] });
      return;
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);

authRoute.post(
  "/registration-email-resending",
  amountOfRequests,
  emailValidation(),
  async (
    req: RequestWithBody<EmailConfirmationResendingType>,
    res: Response
  ) => {
    const user = await usersQueryRepository.getByLoginOrEmail(req.body.email);

    if (!user) {
      res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .send({ errorsMessages: [{ message: "Bad email", field: "email" }] });
      return;
    }
    if (user.emailConfirmation.isConfirmed) {
      res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .send({ errorsMessages: [{ message: "Bad email", field: "email" }] });
      return;
    } else {
      const result = await authService.reSendEmail(user);
      res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);

authRoute.post(
  "/refresh-token",
  authREfreshJWTMiddlewear,
  async (req: Request, res: Response) => {
    const clientIp = Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const clientTitle = req.headers["user-agent"] || "Unknown device";

    const deviceInfo = await deviceQueryRepository.findDeviceWithUserId(
      req.user!._id
    );

    const token_A = await jwtService.createJWT_A(req.user!);
    const token_R = await jwtService.updateJWT_R(
      req.user!,
      deviceInfo!.deviceId
    );

    res.cookie("refreshToken", token_R, {
      httpOnly: true,
      secure: true,
    });
    res.status(HTTP_STATUS.OK_200).send(token_A.data);
  }
);

authRoute.post(
  "/logout",
  authREfreshJWTMiddlewear,
  async (req: Request, res: Response) => {
    const cookie_refreshtoken = req.cookies.refreshToken;
    const decoded = jwt.decode(cookie_refreshtoken) as JwtPayload;

    const deletedDevice = await deviceRepository.deleteDevice(
      decoded.deviceId,
      decoded.userId
    );

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);

authRoute.post(
  "/password-recovery",
  amountOfRequests,
  emailValidation(),
  async (
    req: RequestWithBody<EmailConfirmationResendingType>,
    res: Response
  ) => {
        
    const user = await usersQueryRepository.getByLoginOrEmail(req.body.email);
    console.log("PR", user);

    if (user) {
      const result = await authService.recoveryEmail(user);

      const deletedOldPasswordHash = await usersRepository.updatePassword(
        user._id,
        ""
      );
      console.log("PR2", deletedOldPasswordHash);
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);

authRoute.post(
  "/new-password",
  amountOfRequests,
  newPasswordValidation(),
  async (req: RequestWithBody<EmailRecoveryInputType>, res: Response) => {
    const passwordHash = await bcryprService.generateHash(req.body.newPassword);
    const user = await usersQueryRepository.findUserCode(req.body.recoveryCode);

    if (!user) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).send({
        errorsMessages: [{ message: "Bad code", field: "recoveryCode" }],
      });
      return;
    }

    const result = await usersRepository.updatePassword(user._id, passwordHash);

    if (!result) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).send({
        errorsMessages: [{ message: "Bad code", field: "recoveryCode" }],
      });
      return;
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);
