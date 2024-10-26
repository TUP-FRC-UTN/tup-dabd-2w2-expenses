import Period from "./period"

export default class Expense{
    lotId: number | null = null;
    period: Period = new Period();
    totalAmount: number = 0;
    liquidationDate: Date = new Date();
    state: string = "";
    plotNumber: number | null = null;
    typePlot: string = "";  
    percentage: number = 0;
    billType: string = "";
}