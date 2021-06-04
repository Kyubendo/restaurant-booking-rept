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

const adminCheck = async (req: Request, res: Response) => {
    if ((await getUser(req))?.role !== 'admin') {
        res.statusCode = 403
        res.send('Only admin can do this!')
        return false
    }
    return true
}

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
    res.send({token, role: 'client', name: req.query.name})
}

export const getRequests = async (req: Request, res: Response) => {
    if (!(await adminCheck(req, res))) return
    res.send({
        ...(await db.query(
            `select request.*, u.name user_name, u.phone user_phone
             from request
                      inner join "user" u on u.id = request.user_id
             order by request.id`
        )).rows
    })
}

export const login = async (req: Request, res: Response) => {
    const userData = (await db.query(
        `select token, role, name
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

export const changeStatus = async (req: Request, res: Response) => {
    if (!(await adminCheck(req, res))) return
    const currentStatus = (await db.query(
        `select status
         from request
         where id = ${req.body.requestId}`
    )).rows[0].status
    const status = req.body.status

    if (status === 'pending'
        || ['rejected', 'accepted'].includes(status) && currentStatus !== 'processing'
        || status === 'processing' && currentStatus !== 'pending') {
        res.statusCode = 403
        res.send('Wrong status!')
        return
    }

    await db.query(
        `update request
         set status = '${req.body.status}'
         where id = ${req.body.requestId}`
    )


    res.statusCode = 204
    res.send([])
}
