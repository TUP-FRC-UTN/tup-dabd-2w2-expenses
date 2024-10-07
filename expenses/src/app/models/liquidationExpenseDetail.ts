import { Bill } from "./bill"

export default class LiquidationExpenseDetail {
  expense_id: number | null = null
  type: string | null = null
  category: string | null = null
  total_amount: number | null = null
  billS: Bill[] = []
}
