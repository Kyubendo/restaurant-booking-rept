import express from 'express'
import * as requests from './../controllers/main'
const router = express.Router();

router.get('/tables', requests.emptyTables)
router.get('/registration', requests.registration)
router.get('/registration/admin', requests.registrationAdmin)
router.get('/request', requests.makeRequest)
export default router
