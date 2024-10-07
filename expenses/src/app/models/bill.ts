export interface Bill {
  date: Date | null
  anount: number | null
  provider: string | null
  paid: boolean
  description: string
}
