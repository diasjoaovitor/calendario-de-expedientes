import { Router } from 'express'

import { calendar, employeesSchedule, index } from './controllers'

const router = Router()

router.get('/', index)
router.get('/calendar', calendar)
router.get('/employees-schedule', employeesSchedule)

export default router
