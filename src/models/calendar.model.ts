import {
  formatToHoursAndMinutes,
  getDayOfWeek,
  getNumberOfDaysInTheMonth,
  getNumberOfSundaysInTheMonth,
  getNumberOfWeeksInTheMonth,
  months,
  sum
} from '@/utils'

const getMinutesPerDayInTheMonth = (year: number, month: number) => {
  const days = new Array(getNumberOfDaysInTheMonth(year, month))
    .fill(0)
    .map((_, index) => {
      const date = index + 1

      const day = getDayOfWeek(year, month, date)

      if (day === 0) return 0

      if (day === 6) return 8 * 60

      if (date > 8 && date < 28) return 7 * 60 + 20

      return 8 * 60
    })

  return days
}

export const getYearCalendar = (year: number) => {
  const data: {
    name: string
    hours: string
    normalHours: string
    overtimeHours: string
    weeks: {
      days: ({
        date: number
        hours: string
      } | null)[]
      hours: string
    }[]
  }[] = []

  months.forEach((month, monthIndex) => {
    const minutesPerDay = getMinutesPerDayInTheMonth(year, monthIndex)
    const sundaysInTheMonth = getNumberOfSundaysInTheMonth(year, monthIndex)

    const daysInMonth = getNumberOfDaysInTheMonth(year, monthIndex)
    const workedDays = daysInMonth - sundaysInTheMonth

    const workedMinutes = sum(minutesPerDay)
    const normalMinutes = workedDays * (7 * 60 + 20)
    const overtimeMinutes = workedMinutes - normalMinutes

    data.push({
      name: month,
      hours: formatToHoursAndMinutes(workedMinutes),
      normalHours: formatToHoursAndMinutes(normalMinutes),
      overtimeHours: formatToHoursAndMinutes(overtimeMinutes),
      weeks: []
    })

    const weeks = getNumberOfWeeksInTheMonth(year, monthIndex)

    let date = 1

    for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
      let minutesInTheWeek = 0

      data[monthIndex].weeks.push({
        days: [],
        hours: ''
      })

      const firstDayOfWeek = getDayOfWeek(year, monthIndex, date)

      for (let day = 0; day < 7; day++) {
        if ((weekIndex === 0 && firstDayOfWeek > day) || date > daysInMonth) {
          data[monthIndex].weeks[weekIndex].days.push(null)
        } else {
          const minutesOfDay = minutesPerDay[date - 1]

          minutesInTheWeek += minutesOfDay

          data[monthIndex].weeks[weekIndex].days.push({
            date,
            hours: formatToHoursAndMinutes(minutesOfDay)
          })
          date++
        }

        data[monthIndex].weeks[weekIndex].hours =
          formatToHoursAndMinutes(minutesInTheWeek)
      }
    }
  })

  return data
}
