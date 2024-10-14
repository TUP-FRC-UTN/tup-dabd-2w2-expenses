export class BillPostRequest {
  category_id: number = 0;
  description: string = '';
  amount: number = 0;
  date: Date = new Date();
  supplier_id: number = 0;
  type_id: number = 0;
  period_id: number = 0;
  status: string = '';
}
