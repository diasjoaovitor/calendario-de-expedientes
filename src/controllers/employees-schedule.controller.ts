import { Request, Response } from 'express'

import {
  getEmployeesSchedule,
  getStartOfWork
} from '@/models/employees-schedule.model'
import { getEndOfWork } from '@/models/employees-schedule.model'
import { TSituation } from '@/types'
import { getEmployeePositions, getEmployeeSituations } from '@/utils'

export const employeesSchedule = async (req: Request, res: Response) => {
  const {
    name,
    position,
    situation,
    startOfWork,
    endOfWork,
    low,
    full,
    sunday,
    showInactive
  } = req.query

  try {
    const schedule = await getEmployeesSchedule({
      name: name as string,
      position: position as string,
      situation: situation as TSituation,
      startOfWork: startOfWork as string,
      endOfWork: endOfWork as string,
      low: low === 'on',
      full: full === 'on',
      sunday: sunday === 'on',
      showInactive: showInactive === 'on'
    })

    const situationOptions = await getEmployeeSituations()
    const positionOptions = await getEmployeePositions()
    const startOfWorkOptions = await getStartOfWork()
    const endOfWorkOptions = await getEndOfWork()

    res.status(200).render('employees-schedule', {
      schedule,
      situationOptions,
      positionOptions,
      startOfWorkOptions,
      endOfWorkOptions,
      name,
      position,
      situation,
      startOfWork,
      endOfWork,
      low,
      full,
      sunday,
      showInactive
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao carregar a página' })
  }
}
