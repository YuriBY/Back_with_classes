import { Router, Response } from "express";
import { authMiddlewear } from "../middleweares/auth/auth-middlewear";
import { HTTP_STATUS } from "../status/status1";
import { userValidator } from "../validators/user-validators";
import {
  Pagination,
  ParamType,
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from "../models/commonTypes";
import {
  UserOutType,
  UserQueryInputType,
  UserSortData,
  inputUserType,
} from "../models/usersType";
import { userService } from "../services/user-service";
import { usersQueryRepository } from "../repositories/usersQueryRepository";
import { logsRepository } from "../repositories/logsRepository";
import { amountOfRequests } from "../middleweares/amountOfRequests/amountOfRequests-middlewear";

export const userRoute = Router({});

userRoute.get(
  "/",
  authMiddlewear,
  async (
    req: RequestWithQuery<UserQueryInputType>,
    res: Response<Pagination<UserOutType> | {}>
  ) => {
    const sortData: UserSortData = {
      searchLoginTerm: req.query.searchLoginTerm ?? null,
      searchEmailTerm: req.query.searchEmailTerm ?? null,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection === "asc" ? "asc" : "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    };
    const users = await usersQueryRepository.getAll(sortData);
    res.send(users);
  }
);

userRoute.post(
  "/",
  authMiddlewear,
  // amountOfRequests,
  userValidator(),
  async (req: RequestWithBody<inputUserType>, res: Response) => {
    const { login, password, email } = req.body;

    const isUserLoginExists = await usersQueryRepository.getByLoginOrEmail(
      req.body.login
    );
    if (isUserLoginExists) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).send({
        errorsMessages: [
          {
            message: "Input Login Exists",
            field: "Login",
          },
        ],
      });
      return;
    }

    const isUserEmailExists = await usersQueryRepository.getByLoginOrEmail(
      req.body.email
    );
    if (isUserEmailExists) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).send({
        errorsMessages: [
          {
            message: "Input Email Exists",
            field: "Email",
          },
        ],
      });
      return;
    }

    const createdUser: UserOutType | null = await userService.createUser({
      login,
      password,
      email,
    });
    res.status(HTTP_STATUS.CREATED_201).send(createdUser);
  }
);

userRoute.delete(
  "/:id",
  authMiddlewear,
  async (req: RequestWithParams<ParamType>, res: Response) => {
    const id = req.params.id;
    const isValidUUID = require("uuid-validate");
    if (!isValidUUID(id)) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }
    const userIsDeleted = await userService.deleteUser(id);
    if (!userIsDeleted) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);
