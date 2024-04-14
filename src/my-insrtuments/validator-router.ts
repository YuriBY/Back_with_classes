// создать папку routes и файл blog-routes.ts
// import { Router } from "express";
// пример
// export const blogRoute = Router({});
// blogRoute.get("/", () => {});
// blogRoute.post("/", authMiddlewear, blogValidator(), () => {});

//  yarn add express-validator
// создать папку validators и файлы для валидации, например, blog-validator.ts
// import { body } from "express-validator";

// пример
// const websiteVAlidator = body("websiteUrl")
//   .isString()
//   .withMessage("WebsiteUrl must be string")
//   .trim()
//   .isLength({ min: 1, max: 100 })
//   .matches("^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$")
//   .withMessage("Incorrect websiteUrl");

// собираем все валидаторы в фунцкию
// export const blogValidator = () => [
//   nameValidator,
//   descriptionVAlidator,
//   websiteVAlidator,
// ];

// создаем middleware для обработки ошибок
// import { Request, Response, NextFunction } from "express";
// import { ValidationError, validationResult } from "express-validator";

// export const inputValidationMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const formattedError = validationResult(req).formatWith(
//     (error: ValidationError) => ({
//       message: error.msg,
//       field: error.type === "field" ? error.path : "unknown",
//     })
//   );

//   if (!formattedError.isEmpty()) {
//     const errorMessages = formattedError.array({ onlyFirstError: true });
//     res
//       .status(HTTP_STATUS.BAD_REQUEST_400)
//       .send({ errorsMessages: errorMessages });
//     return;
//   }
//   return next();
// };
// засовываем созданный MW в фунцкию валидации, включающей все проверки, чтобы в конце после валидаций получить все ошибки
