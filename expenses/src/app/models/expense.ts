import Period from "./period"
export default class Expense{
    lotId : number = 0
    period : Period = new Period()
    totalAmount: Number|null=null
    liquidationDate: Date = new Date()
    state: string = ""
}