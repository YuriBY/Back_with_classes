import { Request, Response, NextFunction } from "express";
import { ValidationError, validationResult } from "express-validator";
import { HTTP_STATUS } from "../../status/status1";

export const inputValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const formattedError = validationResult(req).formatWith(
    (error: ValidationError) => ({
      message: error.msg,
      field: error.type === "field" ? error.path : "unknown",
    })
  );

  if (!formattedError.isEmpty()) {
    const errorMessages = formattedError.array({ onlyFirstError: true });
    res
      .status(HTTP_STATUS.BAD_REQUEST_400)
      .send({ errorsMessages: errorMessages });
    return;
  }
  return next();
};
