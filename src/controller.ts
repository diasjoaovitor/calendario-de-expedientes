import { Request, Response } from 'express'

import { getYearCalendar } from './model'

export const index = async (_: Request, res: Response) => {
  try {
    const year = 2025
    const calendar = getYearCalendar(year)
    res.status(200).render('index', { year, calendar })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao carregar a página' })
  }
}
