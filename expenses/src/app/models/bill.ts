export interface Bill {
  date: Date | null
  amount: number | null
  provider: string | null
  paid: boolean
  description: string
}
