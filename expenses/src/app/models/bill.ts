import {Provider} from "./provider";
import Period from "./period";
import Category from "./category";
import BillType from "./billType";

export interface Bill {
  expenditureId: number;
  expenditure_id: number;
  date: Date;
  amount: number;
  description: string;
  supplier: Provider;
  period: Period;
  category: Category;
  bill_type: BillType;
  status: string;
  //TODO PASAR TODO EN SNAKE CASE
}
