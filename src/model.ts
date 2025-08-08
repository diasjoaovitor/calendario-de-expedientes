import {
  formatTime,
  getDayOfWeek,
  getNumberOfDaysInTheMonth,
  getNumberOfWeeksInTheMonth,
  months,
  sum
} from './utils'

const getMinutesPerDayInTheMonth = (year: number, month: number) => {
  const days = new Array(getNumberOfDaysInTheMonth(year, month))
    .fill(0)
    .map((_, index) => {
      const date = index + 1

      const day = getDayOfWeek(year, month, date)

      if (day === 0) return 0

      if (day === 6) return 8 * 60

      if (date > 10 && date < 25) return 7 * 60 + 20

      return 8 * 60
    })

  return days
}

export const getYearCalendar = (year: number) => {
  const data: {
    name: string
    hours: string
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

    data.push({
      name: month,
      hours: formatTime(sum(minutesPerDay)),
      weeks: []
    })

    const daysInMonth = getNumberOfDaysInTheMonth(year, monthIndex)
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
            hours: formatTime(minutesOfDay)
          })
          date++
        }

        data[monthIndex].weeks[weekIndex].hours = formatTime(minutesInTheWeek)
      }
    }
  })

  return data
}
