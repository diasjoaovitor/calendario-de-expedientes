import { Request, Response } from 'express'

import { getEmployeesSchedule } from '@/models/employees-schedule.model'

export const employeesSchedule = async (_: Request, res: Response) => {
  try {
    const schedule = await getEmployeesSchedule()
    res.status(200).render('employees-schedule', { schedule })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao carregar a página' })
  }
}
