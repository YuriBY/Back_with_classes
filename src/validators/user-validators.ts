import { body } from "express-validator";
import { inputValidationMiddleware } from "../middleweares/input-validation/input-validation-middleware";

const loginValidator = body("login")
  .trim()
  .isLength({ min: 3, max: 10 })
  .matches("^[a-zA-Z0-9_-]*$")
  .withMessage("Incorrect login");

const passwordValidator = body("password")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Incorrect password");

const emailValidator = body("email")
  .trim()
  .matches("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
  .withMessage("Incorrect email");

export const userValidator = () => [
  loginValidator,
  passwordValidator,
  emailValidator,
  inputValidationMiddleware,
];

export const emailValidation = () => [
  emailValidator,
  inputValidationMiddleware,
];

const newPasswordValidator = body("newPassword")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Incorrect password");

export const newPasswordValidation = () => [
  newPasswordValidator,
  inputValidationMiddleware,
];
