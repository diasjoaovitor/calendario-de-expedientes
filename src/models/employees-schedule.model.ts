import { TEmployeeScheduleData, TSituation, TWorkSchedule } from '@/types'
import {
  formatHoursAndMinutesToMinutes,
  formatToHoursAndMinutes,
  formatToMinutesAndSeconds,
  readFile,
  removeSpecialCharacters,
  sum
} from '@/utils'

export type TWorkScheduleKey = 'full' | 'low' | 'sunday'

type TFullWorkSchedule = {
  hoursOfDay: string[]
  hoursOfBreak: string[]
  totalHoursOfDay: string
  totalHoursOfLunch: string
  totalMinutesOfBreak: string
  isLunchOverTime: boolean
  isWorkOverTime: boolean
}

type TEmployeeSchedule = {
  id: number
  name: string
  workMinutes: {
    full: TFullWorkSchedule
    low: TFullWorkSchedule
    sunday: TFullWorkSchedule
  }
  situation: TSituation
  position: string
}

const getIsLunchOverTime = (minutesOfLunch: number) => minutesOfLunch > 120

const getIsWorkOverTime = (minutesOfWork: number) => minutesOfWork > 480

const sortEmployees = (employees: TEmployeeSchedule[], key: TWorkScheduleKey) =>
  employees
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort((a, b) => a.position.localeCompare(b.position))
    .sort((a, b) => {
      if (
        a.workMinutes[key].hoursOfDay[0] === '-' ||
        b.workMinutes[key].hoursOfDay[0] === '-'
      ) {
        return -Infinity
      }

      return (
        formatHoursAndMinutesToMinutes(a.workMinutes[key].hoursOfDay[0]) -
        formatHoursAndMinutesToMinutes(b.workMinutes[key].hoursOfDay[0])
      )
    })

const getWorkMinutes = (workSchedule: TWorkSchedule): TFullWorkSchedule => {
  const { breakMinutes, minutes } = workSchedule

  let hoursOfDay = minutes.map((minute) => formatToHoursAndMinutes(minute))

  if (hoursOfDay.length < 4) {
    const [start, end] = hoursOfDay
    hoursOfDay = []
    for (let i = 0; i < 4; i++) {
      if (i === 0 && start) hoursOfDay.push(start)
      if (i === 2 && end) hoursOfDay.push(end)
      hoursOfDay.push('-')
    }
  }

  const hoursOfBreak = breakMinutes.map((minute) =>
    formatToHoursAndMinutes(minute)
  )

  const totalMinutesOfWork =
    minutes.length > 2
      ? minutes[3] - minutes[2] + minutes[1] - minutes[0]
      : minutes[1] - minutes[0]
  const isWorkOverTime = getIsWorkOverTime(totalMinutesOfWork)

  const totalHoursOfDay = formatToHoursAndMinutes(totalMinutesOfWork)

  const hasBreakForLunch = minutes.length > 2
  const totalHoursOfLunch = formatToHoursAndMinutes(
    hasBreakForLunch ? minutes[2] - minutes[1] : 0
  )

  const totalMinutesOfBreak = formatToMinutesAndSeconds(sum(breakMinutes))

  const isLunchOverTime =
    hasBreakForLunch && getIsLunchOverTime(minutes[2] - minutes[1])

  return {
    hoursOfDay,
    hoursOfBreak,
    totalHoursOfDay,
    totalHoursOfLunch,
    totalMinutesOfBreak,
    isLunchOverTime,
    isWorkOverTime
  }
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
  employees: TEmployeeSchedule[],
  filters: TScheduleFilters
) => {
  const validFilters = Object.entries(filters).filter(([, value]) => value)
  if (validFilters.length === 0) {
    return employees.filter((employee) => employee.situation !== 'AFASTADO')
  }
  const workScheduleKeys: TWorkScheduleKey[] = []

  if (filters.low) workScheduleKeys.push('low')
  if (filters.full) workScheduleKeys.push('full')
  if (filters.sunday) workScheduleKeys.push('sunday')

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
      if (key === 'startOfWork') {
        workScheduleKeys.forEach((key) => {
          isValid.push(employee.workMinutes[key].hoursOfDay[0] === value)
        })
      }
      if (key === 'endOfWork') {
        workScheduleKeys.forEach((key) => {
          isValid.push(
            employee.workMinutes[key].hoursOfDay[
              employee.workMinutes[key].hoursOfDay.length - 1
            ] === value
          )
        })
      }
    })

    if (!filters.showInactive && employee.situation === 'AFASTADO') {
      isValid.push(false)
    }

    return isValid.every((isValid) => isValid)
  })

  return filteredEmployees
}

export const getEmployeesSchedule = async (filters: TScheduleFilters) => {
  const employees = (await readFile(
    'data/employees.json'
  )) as TEmployeeScheduleData[]

  const data: TEmployeeSchedule[] = employees.map((employee) => {
    const { workMinutes } = employee
    const low = getWorkMinutes(workMinutes.low)
    const full = getWorkMinutes(workMinutes.full)
    const sunday = getWorkMinutes(workMinutes.sunday)

    return {
      id: employee.id,
      name: employee.name,
      workMinutes: { low, full, sunday },
      situation: employee.situation,
      position: employee.position
    }
  })

  let key: TWorkScheduleKey = 'low'

  if (!filters.low && filters.full) key = 'full'
  if (!filters.low && filters.sunday) key = 'sunday'

  if (filters) {
    return sortEmployees(getFilteredEmployees(data, filters), key)
  }

  return sortEmployees(data, key)
}

export const getStartOfWork = async () => {
  const employees = (await readFile(
    'data/employees.json'
  )) as TEmployeeScheduleData[]

  const startOfWork = Array.from(
    new Set(
      employees.flatMap((employee) => [
        formatToHoursAndMinutes(employee.workMinutes.full.minutes[0]),
        formatToHoursAndMinutes(employee.workMinutes.low.minutes[0]),
        formatToHoursAndMinutes(employee.workMinutes.sunday.minutes[0])
      ])
    )
  ).sort(
    (a, b) =>
      formatHoursAndMinutesToMinutes(a) - formatHoursAndMinutesToMinutes(b)
  )

  return startOfWork
}

export const getEndOfWork = async () => {
  const employees = (await readFile(
    'data/employees.json'
  )) as TEmployeeScheduleData[]

  const endOfWork = Array.from(
    new Set(
      employees.flatMap((employee) => [
        formatToHoursAndMinutes(
          employee.workMinutes.full.minutes[
            employee.workMinutes.full.minutes.length - 1
          ]
        ),
        formatToHoursAndMinutes(
          employee.workMinutes.low.minutes[
            employee.workMinutes.low.minutes.length - 1
          ]
        ),
        formatToHoursAndMinutes(
          employee.workMinutes.sunday.minutes[
            employee.workMinutes.sunday.minutes.length - 1
          ]
        )
      ])
    )
  ).sort(
    (a, b) =>
      formatHoursAndMinutesToMinutes(a) - formatHoursAndMinutesToMinutes(b)
  )

  return endOfWork
}
