import {getConnection} from "../dbConnection";
import {Response, Request} from "express";
import {FilterOptions} from "../types/types";

type GetReq<T> = Request<{}, {}, {}, T>

const db = getConnection()

export const registrationForm = async (req: Request, res: Response) => {
    let a = getConnection()

    res.send((await a.query('select now()')).rows)
}

export const emptyTables = async (req: GetReq<FilterOptions>, res: Response) => {
    const filterOptions = req.query
    const response = (await db.query(
        `select *
         from "table" t
                  left join request r
                            on t.id = r.table_id
                                and '${filterOptions.time}'::timestamp between
                                   r.time - interval '2 hours' and r.time + interval '2 hours'
         where r.id is null`
    )).rows
    res.send(response)
}

export const qweqwe = async (req: Request, res: Response) => {

}