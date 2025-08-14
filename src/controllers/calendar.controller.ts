import { Request, Response } from 'express'

import { getYearCalendar } from '@/models/calendar.model'
import { getCurrentYear } from '@/utils'

export const calendar = async (req: Request, res: Response) => {
  try {
    const year = Number(req.query.year) || getCurrentYear()
    const calendar = getYearCalendar(year)
    res.status(200).render('calendar', { year, calendar })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao carregar a página' })
  }
}
