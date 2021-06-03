import express from 'express'
import * as requests from '../requests/main'

const router = express.Router();

router.get('/tables', requests.emptyTables)
router.get('/registration', requests.registration)
router.get('/registration/admin', requests.registrationAdmin)
router.get('/login', requests.login)
router.post('/request', requests.makeRequest)
router.get('/requests', requests.requests)

export default router
