import { body } from "express-validator";
import { inputValidationMiddleware } from "../middleweares/input-validation/input-validation-middleware";

const emaiLoginlValidator = body("loginOrEmail")
  .trim()
  .isString()
  .withMessage("Incorrect loginOrEmail");

export const authValidator = () => [
  emaiLoginlValidator,
  inputValidationMiddleware,
];
