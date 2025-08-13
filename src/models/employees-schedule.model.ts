import {
  formatToHoursAndMinutes,
  formatToMinutesAndSeconds,
  readFile,
  sum
} from '@/utils'

type TSituation =
  | 'REGISTRADO'
  | 'EXPERIÊNCIA'
  | 'DESLIGADO'
  | 'AFASTADO'
  | 'FÉRIAS'
  | 'FOLGA'

type TWorkSchedule = {
  minutes: number[]
  breakMinutes: number[]
}

type TEmployeeScheduleData = {
  id: number
  name: string
  workMinutes: {
    full: TWorkSchedule
    low: TWorkSchedule
    sunday: TWorkSchedule
  }
  situation: TSituation
  position: string
}

type TFullWorkSchedule = {
  hoursOfDay: string[]
  hoursOfBreak: string[]
  totalHoursOfDay: string
  totalHoursOfLunch: string
  totalMinutesOfBreak: string
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

  const totalHoursOfDay = formatToHoursAndMinutes(
    minutes.length > 2
      ? minutes[3] - minutes[2] + minutes[1] - minutes[0]
      : minutes[1] - minutes[0]
  )

  const hasBreakForLunch = minutes.length > 2
  const totalHoursOfLunch = formatToHoursAndMinutes(
    hasBreakForLunch ? minutes[2] - minutes[1] : 0
  )

  const totalMinutesOfBreak = formatToMinutesAndSeconds(sum(breakMinutes))

  return {
    hoursOfDay,
    hoursOfBreak,
    totalHoursOfDay,
    totalHoursOfLunch,
    totalMinutesOfBreak
  }
}

type TScheduleFilters = {
  name?: string
  position?: string
  situation?: TSituation
  startOfWork?: string
  endOfWork?: string
}

const getFilteredEmployees = (
  employees: TEmployeeSchedule[],
  filters: TScheduleFilters
) => {
  const { name, position, situation, startOfWork, endOfWork } = filters

  const filteredEmployees = employees.filter((employee) => {
    let isTrue = false

    if (
      name &&
      employee.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
    ) {
      isTrue = true
    }

    if (
      position &&
      employee.position
        .toLocaleLowerCase()
        .includes(position.toLocaleLowerCase())
    ) {
      isTrue = true
    }

    if (situation && employee.situation === situation) {
      isTrue = true
    }

    if (
      startOfWork &&
      employee.workMinutes.full.hoursOfDay[0] === startOfWork
    ) {
      isTrue = true
    }

    if (endOfWork && employee.workMinutes.full.hoursOfDay[3] === endOfWork) {
      isTrue = true
    }

    return isTrue
  })

  return filteredEmployees
}

export const getEmployeesSchedule = async (filters?: TScheduleFilters) => {
  const employees = (await readFile(
    'data/employees.json'
  )) as TEmployeeScheduleData[]

  const data: TEmployeeSchedule[] = employees
    .map((employee) => {
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
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort((a, b) =>
      a.workMinutes.full.hoursOfDay[0].localeCompare(
        b.workMinutes.full.hoursOfDay[0]
      )
    )
    .sort((a, b) => a.position.localeCompare(b.position))

  if (filters) {
    return getFilteredEmployees(data, filters)
  }

  return data
}
