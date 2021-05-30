import {getConnection} from "../dbConnection";

export const registrationForm = async (req: any, res: any) => {
    let a = getConnection()

    res.send((await a.query('select now()')).rows)
}