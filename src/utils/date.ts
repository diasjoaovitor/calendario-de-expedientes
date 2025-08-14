import 'dayjs/locale/pt-br'

import dayjs from 'dayjs'

dayjs.locale('pt-br')

export const months = new Array(12).fill(0).map((_, index) => {
  const month = dayjs().month(index).format('MMMM')
  const capitalized = month.charAt(0).toUpperCase() + month.slice(1)
  return capitalized
})

export const getCurrentYear = () => {
  return dayjs().year()
}

export const getDayOfWeek = (year: number, month: number, date: number) => {
  return dayjs().year(year).month(month).date(date).day()
}

export const getNumberOfDaysInTheMonth = (year: number, month: number) => {
  return dayjs().year(year).month(month).daysInMonth()
}

export const getNumberOfWeeksInTheMonth = (year: number, month: number) => {
  const daysInMonth = getNumberOfDaysInTheMonth(year, month)
  let numberOfWeeks = 0

  for (let i = 0; i < daysInMonth; i++) {
    const day = getDayOfWeek(year, month, i + 1)
    if (day === 0 || (numberOfWeeks === 0 && i === 0)) numberOfWeeks++
  }

  return numberOfWeeks
}

export const getNumberOfSundaysInTheMonth = (year: number, month: number) => {
  const daysInMonth = getNumberOfDaysInTheMonth(year, month)
  let numberOfSundays = 0

  for (let i = 0; i < daysInMonth; i++) {
    const day = getDayOfWeek(year, month, i + 1)
    if (day === 0) numberOfSundays++
  }

  return numberOfSundays
}

export const formatToHoursAndMinutes = (minutes: number) => {
  if (!minutes) return '00:00'

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`
}

export const formatToMinutesAndSeconds = (minutes: number) => {
  if (!minutes) return '00:00'

  const seconds = minutes * 60
  const remainingSeconds = seconds % 60

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const formatHoursAndMinutesToMinutes = (hoursAndMinutes: string) => {
  const [hours, minutes] = hoursAndMinutes.split(':')
  return parseInt(hours) * 60 + parseInt(minutes)
}
