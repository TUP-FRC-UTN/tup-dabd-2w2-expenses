import Period from "./period"
export default class Expense{
    lotId: number | null = null;
    period: Period = new Period();
    totalAmount: number | null = null;
    liquidationDate: Date = new Date();
    state: string = "";
    plotNumber: number | null = null;
    typePlot: string = "";  // O podría ser un enum si tienes tipos de parcelas predefinidos
    percentage: number = 0;
    billType: string = "";   


}