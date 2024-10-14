import {Provider} from "./provider";
import Period from "./period";
import Category from "./category";
import BillType from "./billType";

export interface Bill {
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

/*
* {
    "expenditure_id": 1,
    "categoryName": "Utilities",
    "description": "Description for bill 4",
    "amount": 2500,
    "suplier": null,
    "date": "2024-10-13T18:51:07",
    "typeName": "Ordinarias",
    "period": 1,
    "status": "ACTIVE"
  }*/
