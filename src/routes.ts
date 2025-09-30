import { Router } from 'express'

import { calendar, employees, employeesSchedule, index } from './controllers'

const router = Router()

router.get('/', index)
router.get('/calendar', calendar)
router.get('/employees', employees)
router.get('/employees-schedule', employeesSchedule)

export default router
