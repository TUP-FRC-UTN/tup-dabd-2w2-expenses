import {Provider} from "./provider";
import Period from "./period";
import Category from "./category";
import BillType from "./billType";

export class BillDto {
  expenditure_id: number = 0;
  date: Date = new Date();
  amount: number = 0;
  description: string = '';
  supplier?: Provider;
  period?: Period;
  category?: Category;
  bill_type?: BillType;
  status: string = '';
}


