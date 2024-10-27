import {Provider} from "./provider";
import Period from "./period";
import Category from "./category";
import BillType from "./billType";


export class Bill {
  expenditureId: number;
  date: Date;
  amount: number;
  description: string;
  supplier?: Provider;
  period?: Period;
  category?: Category;
  billType?: BillType;
  status?: string;


  constructor(id?:number, date?: Date, amount?: number, description?: string, supplier?: Provider, period?: Period, category?: Category, billType?: BillType, status?:string) {
    this.expenditureId = id!== undefined ? id:0;
    this.date = date !==undefined ? date: new Date();
    this.amount = amount? amount: 0;
    this.description = description? description : "";
    this.supplier=supplier? supplier:undefined;
    this.period = period? period:undefined;
    this.category = category? category:undefined;
    this.billType = billType ? billType:undefined;
    this.status = status? status:undefined;
  }

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
