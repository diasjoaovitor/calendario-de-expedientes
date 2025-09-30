import { TEmployeeScheduleData } from '@/types'

import { readFile } from './file'

export const getEmployeeSituations = async () => {
  const employees = (await readFile(
    'data/employees.json'
  )) as TEmployeeScheduleData[]

  const situations = Array.from(
    new Set(employees.map((employee) => employee.situation))
  ).sort((a, b) => a.localeCompare(b))

  return situations
}

export const getEmployeePositions = async () => {
  const employees = (await readFile(
    'data/employees.json'
  )) as TEmployeeScheduleData[]

  const positions = Array.from(
    new Set(employees.map((employee) => employee.position))
  ).sort((a, b) => a.localeCompare(b))

  return positions
}
