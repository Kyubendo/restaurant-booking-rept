import crypto from "crypto";
import {getConnection} from "../dbConnection";
import {Response, Request} from "express";

const db = getConnection()

export const createToken = (value: string) => crypto.createHash('sha1').update(value).digest('hex');

export const getUser = async (req: Request) => (await db.query(
    `select *
     from "user"
     where token = '${req.header('Authorization')}'`
)).rows[0]

export const getAdmin = async (req: Request) => {
    const user = (await getUser(req))
    if (!user) return null
    return (await db.query(
        `select *
         from admin
         where user_id = ${user.id}`
    )).rows[0] ?? null
}

export const getClient = async (req: Request) => {
    const user = (await getUser(req))
    if (!user) return null
    return (await db.query(
        `select *
         from client
         where user_id = ${user.id}`
    )).rows[0] ?? null
}

export const adminCheck = async (req: Request, res: Response) => {
    const admin = await getAdmin(req)
    if (!admin) {
        res.statusCode = 403
        res.send('Only admin can do this!')
        return false
    }
    return admin
}

export const getStatus = async (requestId: number) => (
    await db.query(
        `select status
         from request
         where id = ${requestId}`
    )
).rows[0].status