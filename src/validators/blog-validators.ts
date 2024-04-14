import { body } from "express-validator";
import { inputValidationMiddleware } from "../middleweares/input-validation/input-validation-middleware";

const nameValidator = body("name")
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("Incorrect name");

const descriptionVAlidator = body("description")
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("Incorrect description");

const websiteVAlidator = body("websiteUrl")
  .trim()
  .isLength({ min: 1, max: 100 })
  .matches("^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$")
  .withMessage("Incorrect websiteUrl");

export const blogValidator = () => [
  nameValidator,
  descriptionVAlidator,
  websiteVAlidator,
  inputValidationMiddleware,
];
