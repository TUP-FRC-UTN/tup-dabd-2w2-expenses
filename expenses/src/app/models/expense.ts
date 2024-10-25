import Period from "./period"
export default class Expense{
    lotId : number |null=null
    period? : Period = new Period()
    totalAmount: Number|null=null
    liquidationDate: Date = new Date()
    state: string = ""
    plotNumber: number |null = null
    typePlot:string | null=null
    percentage: number | null=null
    billType:string |null=null
}
