import express from 'express'
import {getConnection} from "../dbConnection";
import * as requests from './../controllers/main'

const router = express.Router();

router.get('/tables', requests.emptyTables)


export default router