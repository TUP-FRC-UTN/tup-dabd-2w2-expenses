import Period from "./period"
export default class Expense{
    lotId : number |null=null
    period : Period |null = null
    totalAmount: Number|null=null
    liquidationDate: Date = new Date()

}