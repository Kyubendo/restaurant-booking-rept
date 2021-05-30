import express from 'express'
import {getConnection} from "../dbConnection";

const router = express.Router();

router.get('/', async (req, res) => {
    let a = getConnection()

    res.send((await a.query('select now()')).rows)
})


export default router