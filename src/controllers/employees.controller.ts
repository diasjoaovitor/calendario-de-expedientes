import { Request, Response } from 'express'

import { getEmployees } from '@/models/employees.model'
import { TSituation } from '@/types'
import { getEmployeePositions, getEmployeeSituations } from '@/utils'

export const employees = async (req: Request, res: Response) => {
  const { name, position, situation, showInactive } = req.query

  try {
    const employees = await getEmployees({
      name: name as string,
      position: position as string,
      situation: situation as TSituation,

      showInactive: showInactive === 'on'
    })

    const situationOptions = await getEmployeeSituations()
    const positionOptions = await getEmployeePositions()

    res.status(200).render('employees', {
      employees,
      situationOptions,
      positionOptions,
      name,
      position,
      situation,
      showInactive
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao carregar a página' })
  }
}
