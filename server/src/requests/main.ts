import {getConnection} from "../dbConnection";
import {Response, Request} from "express";
import {FilterOptions} from "../types/types";
import {adminCheck, createToken, getClient} from "../utils/requests";

type GetReq<T> = Request<{}, {}, {}, T>

const db = getConnection()

export const emptyTables = async (req: GetReq<FilterOptions>, res: Response) => {
    let query =
        `with reserved_tables as (
            select r.table_id
            from request r
            where '${req.query.time}'::timestamp between r.time - interval '2 hours' and r.time + interval '2 hours'
        )
         select t.id, z.max_chair_count, z.name as zone, r.time reserved_time
         from "table" t
                  inner join zone z on z.id = t.zone_id
                  left join request r on t.id = r.table_id
                  left join reserved_tables rt on rt.table_id = r.table_id
         where rt is null`
    const response = (await db.query(query)).rows
    res.send(response)
}

export const registration = async (req: Request, res: Response) => {
    const token = createToken(`${req.query.phone}${req.query.password}`)
    const userId = (await db.query(
        `insert into "user" (phone, name, password, token)
         values ('${req.query.phone}', '${req.query.name}', '${req.query.password}', '${token}')
         returning id`
    )).rows[0].id;
    await db.query(
        `insert into client
         values (${userId})`
    )
    res.send({token, role: 'client', name: req.query.name})
}

export const getRequests = async (req: Request, res: Response) => {
    if (!(await adminCheck(req, res))) return
    res.send({
        ...(await db.query(
            `select request.*, u.name user_name, u.phone user_phone
             from request
                      inner join "user" u on u.id = request.client_id
             order by request.id`
        )).rows
    })
}

export const login = async (req: Request, res: Response) => {
    const userData = (await db.query(
        `select token, name, case u.id when c.user_id then 'client' when a.user_id then 'admin' end as role
         from "user" u
                  left join admin a on u.id = a.user_id
                  left join client c on u.id = c.user_id
         where phone = '${req.query.phone}'
           and password = '${req.query.password}'`)).rows[0]
    res.send({...userData})
}

export const cancelRequest = async (req: Request, res: Response) => {
    const client = await getClient(req)
    await db.query(
        `update request
         set status='canceled'
         where id = ${req.body.requestId}
           and client_id = ${client.user_id}`
    )
    res.status(205)
    res.send([])
}

export const generateReport = async (req: Request, res: Response) => {
    const admin = await adminCheck(req, res)
    if (!admin) return

    res.send((await db.query(
        `select t.id as table_id, z.name as zone, r.time, u.name, z.max_chair_count
         from request r
                  inner join "table" t on r.table_id = t.id
                  inner join zone z on z.id = t.zone_id
                  inner join "user" u on u.id = r.client_id
         where r.time > current_timestamp
           and r.status = 'accepted'`
    )).rows)
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
    const clientId = (await getClient(req)).user_id

    await db.query(
        `insert into request(client_id, table_id, time, status)
         values ('${clientId}', '${req.body.tableId}', '${req.body.dateTime}', 'pending')`
    )
    res.statusCode = 204
    res.send([])
}

export const changeStatus = async (req: Request, res: Response) => {
    const admin = await adminCheck(req, res)
    if (!admin) return
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
         set status   = '${req.body.status}',
             admin_id = ${admin.user_id}
         where id = ${req.body.requestId}`
    )

    res.statusCode = 204
    res.send([])
}

export const getStatuses = async (req: Request, res: Response) => {
    const client = await getClient(req)
    res.send((await db.query(
        `select request.id as request_id, table_id as id, time, status
         from request
         where client_id = ${client.user_id}`
    )).rows)
}