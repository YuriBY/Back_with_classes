// yarn add mongoose

// in file db.ts
// import mongoose from 'mongoose'
// import dotenv from 'dotenv'
// dotenv.config()

// const dbName = 'home_works'
// const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`

// export async function runDb() {
//     try {
//         await mongoose.connect(mongoURI)
//         console.log('it is ok')
//     } catch (e) {
//         console.log('no connection')
//         await mongoose.disconnect()
//     }
// }

// in file index.ts
// import { app } from './settings'
// import { runDb } from './mongo/db'

// const port = process.env.PORT || 3999

// const startApp = async () => {
//     await runDb()
//     app.listen(port, () => {
//         console.log(`Example app listening on port ${port}`)
//     })
// }

// startApp()

// app импортируется из файла settings.ts
// import express, { Request, Response } from 'express'

// export const app = express()
// app.use('/blogs', blogsRouter)

// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello back-end HomeWorks in it-incubator!!!')
// })

// 2) Schema, Model

// import mongoose from 'mongoose'
// import { WithId } from 'mongodb'
// import { BlogType } from '../../routes/blogs-router'

// export const BlogSchema = new mongoose.Schema<WithId<BlogType>>({
//     id: { type: String, require: true },
//     name: { type: String, require: true },
//     description: { type: String, require: true }
// })
// export const BlogModel = mongoose.model<BlogType>('blogs', BlogSchema)

// 3) в BlogsRepository используем BlogModel вместо blogsCollection из db.collection
// // export const blogsCollection = db.collection<BlogType>('blogs')

// import { BlogType } from '../routes/blogs-router'
// import { BlogModel } from '../mongo/blog/blog.model'

// export const BlogsRepository = {
//     async getBlogs(): Promise<BlogType[]> {
//         return BlogModel.find({},{_id: 0 })
//     },

//     async getBlogById(id: string): Promise<BlogType | null> {
//         return BlogModel.findOne({ id },{ _id: 0 })
//     },

//     async updateBlog(
//         id: string,
//         body: {name: 'string',description: 'string'}
//     ): Promise<boolean> {
//         const res = await BlogModel.updateOne({ id }, body)
//         return res.matchedCount === 1
//     },

//     async deleteBlog(id: string): Promise<boolean> {
//         const res = await BlogModel.deleteOne({ id })
//         return res.deletedCount === 1
//     },
// }
