import { TEmployeeScheduleData, TSituation } from '@/types'
import { readFile, removeSpecialCharacters } from '@/utils'

type TEmployee = {
  id: number
  name: string
  cpf: string
  situation: TSituation
  position: string
}

type TScheduleFilters = {
  name?: string
  position?: string
  situation?: TSituation
  startOfWork?: string
  endOfWork?: string
  low?: boolean
  full?: boolean
  sunday?: boolean
  showInactive?: boolean
}

const getFilteredEmployees = (
  employees: TEmployee[],
  filters: TScheduleFilters
) => {
  const validFilters = Object.entries(filters).filter(([, value]) => value)
  if (validFilters.length === 0) {
    return employees.filter((employee) => employee.situation !== 'AFASTADO')
  }

  const filteredEmployees = employees.filter((employee) => {
    const isValid: boolean[] = []

    validFilters.forEach(([key, value]) => {
      if (key === 'name') {
        isValid.push(
          !!removeSpecialCharacters(employee.name.toLocaleLowerCase()).includes(
            removeSpecialCharacters((value as string).toLocaleLowerCase())
          )
        )
      }
      if (key === 'position') {
        isValid.push(employee.position === value)
      }
      if (key === 'situation') {
        isValid.push(employee.situation === value)
      }
    })

    if (!filters.showInactive && employee.situation === 'AFASTADO') {
      isValid.push(false)
    }

    return isValid.every((isValid) => isValid)
  })

  return filteredEmployees
}

const sortEmployees = (employees: TEmployee[]) =>
  employees
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort((a, b) => a.position.localeCompare(b.position))

export const getEmployees = async (filters: TScheduleFilters) => {
  const employees = (await readFile(
    'data/employees.json'
  )) as TEmployeeScheduleData[]

  const data: TEmployee[] = employees.map((employee) => {
    return {
      id: employee.id,
      name: employee.name,
      cpf: employee.cpf,
      situation: employee.situation,
      position: employee.position
    }
  })

  if (filters) {
    return sortEmployees(getFilteredEmployees(data, filters))
  }

  return sortEmployees(data)
}
