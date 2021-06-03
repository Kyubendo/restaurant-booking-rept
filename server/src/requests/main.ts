import {getConnection} from "../dbConnection";
import {Response, Request} from "express";
import {FilterOptions} from "../types/types";
import * as crypto from 'crypto'

type GetReq<T> = Request<{}, {}, {}, T>

const db = getConnection()

const createToken = (value: string) => crypto.createHash('sha1').update(value).digest('hex');

const getUser = async (req: Request) => (await db.query(
    `select *
     from "user"
     where token = '${req.header('Authorization')}'`
)).rows[0]

export const registrationForm = async (req: Request, res: Response) => {
    let a = getConnection()

    res.send((await a.query('select now()')).rows)
}

export const emptyTables = async (req: GetReq<FilterOptions>, res: Response) => {
    let query =
        `select t.id, t.chair_count, t.zone, r.time reserved_time
         from "table" t
                  left join request r on t.id = r.table_id`
    if (req.query.time) query +=
        ` where '${req.query.time}'::timestamp not between r.time - interval '2 hours' and r.time + interval '2 hours' or
                r.id is null`
    const response = (await db.query(query)).rows
    res.send(response)
}

export const registration = async (req: Request, res: Response) => {
    const token = createToken(`${req.query.phone}${req.query.password}`)
    await db.query(
        `insert into "user" (phone, name, password, role, token)
         values ('${req.query.phone}', '${req.query.name}', '${req.query.password}', 'client', '${token}')`
    );
    res.send({token, role: 'client'})
}

export const requests = async (req: Request, res: Response) => {
    if ((await getUser(req)).role) {
        res.statusCode = 403
        res.send('Only admin can review requests!')
        return
    }
    return (await db.query(
        `select *
         from request`
    )).rows
}

export const login = async (req: Request, res: Response) => {
    const userData = (await db.query(
        `select token, role
         from "user"
         where phone = '${req.query.phone}'
           and password = '${req.query.password}'`)).rows[0]
    res.send({...userData})
}


export const registrationAdmin = async (req: Request, res: Response) => {
    if (req.query.secret !== 'secret') {
        res.statusCode = 403
        res.send('Wrong secret key!')
        return
    }
    const token = createToken(`${req.query.phone}${req.query.password}`)
    await db.query(
        `insert into "user" (phone, name, password, role, token)
         values ('${req.query.phone}', '${req.query.name}', '${req.query.password}', 'admin', '${token}')`
    );
    res.send({token})
}

export const makeRequest = async (req: Request, res: Response) => {

    const isReserved = (await db.query(
        `select r.id
         from request r
         where '${req.body.dateTime}'::timestamp between r.time - interval '2 hours' and r.time + interval '2 hours'
           and r.table_id = ${req.body.tableId}`
    )).rows[0]?.id

    if (isReserved) {
        res.statusCode = 400
        res.send('This table is already reserved!')
        return
    }
    const userId = (await getUser(req)).id

    await db.query(
        `insert into request(user_id, table_id, time, status)
         values ('${userId}', '${req.body.tableId}', '${req.body.dateTime}', 'pending')`
    )
    res.statusCode = 204
    res.send([])
}
