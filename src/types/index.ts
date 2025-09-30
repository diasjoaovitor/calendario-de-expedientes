export type TSituation =
  | 'REGISTRADO'
  | 'EXPERIÊNCIA'
  | 'DESLIGADO'
  | 'AFASTADO'
  | 'FÉRIAS'
  | 'FOLGA'

export type TWorkSchedule = {
  minutes: number[]
  breakMinutes: number[]
}

export type TEmployeeScheduleData = {
  id: number
  name: string
  cpf: string
  workMinutes: {
    full: TWorkSchedule
    low: TWorkSchedule
    sunday: TWorkSchedule
  }
  situation: TSituation
  position: string
}
