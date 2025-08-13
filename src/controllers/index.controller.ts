import { Request, Response } from 'express'

export const index = async (_: Request, res: Response) => {
  try {
    res.status(200).render('index')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao carregar a página' })
  }
}
