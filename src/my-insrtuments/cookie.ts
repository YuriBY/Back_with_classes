// Проинсталлировать cookie-parser:

// yarn add cookie-parser
// yarn add @types/cookie-parser --dev

// Подключить в приложение cookie-parser в качестве middleware.

// import cookieParser from "cookie-parser";
// app.use(cookieParser())

// 1. cookie в Response

// res.cookie('cookie_name', value, {httpOnly: true, secure: true,})
// res.status(200).send('Have a nice day!')

// 2. cookie из Request

// const cookie_name= req.cookies.cookie_name

// Example

// import express, { Request, Response } from 'express'
// import cookieParser from 'cookie-parser'

// export const app = express()
// app.use(cookieParser())

// app.post('/auth/example', (req: Request, res: Response) => {
//     res.cookie('cookie_name', value, {httpOnly: true,secure: true})
//     res.status(204).send('Hello samurai from it-incubator!!!')
// })
// app.get('/auth/result', async (req: Request, res: Response) => {
//     const cookie_name= req.cookies.cookie_name
//     res.sendStatus(CodeResponsesEnum.Not_content_204)
// })
