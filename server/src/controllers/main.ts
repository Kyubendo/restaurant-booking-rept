import {getConnection} from "../dbConnection";
import {Response, Request} from "express";
import {FilterOptions} from "../types/types";
import * as crypto from 'crypto'

type GetReq<T> = Request<{}, {}, {}, T>

const db = getConnection()

const createToken = (value: string) => crypto.createHash('sha1').update(value).digest('hex');

export const registrationForm = async (req: Request, res: Response) => {
    let a = getConnection()

    res.send((await a.query('select now()')).rows)
}

export const request = async (req: GetReq<FilterOptions>, res: Response) => {
    const userId = req.header('')
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
    res.send({token})
}

export const login = async (req: Request, res: Response) => {
    const token = (await db.query(
        `select token
         from "user"
         where phone = '${req.query.phone}'
           and password = '${req.query.password}'`)).rows[0].token
    res.send({token})
}


export const registrationAdmin = async (req: Request, res: Response) => {
    if (req.query.secret !== 'secret') {
        res.statusCode = 403
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
    await db.query(
        `insert into request(user_id, table_id, time, status)
         values ('', '${req.query.tableId}', '${req.query.time}', 'pending')`
    )
}
