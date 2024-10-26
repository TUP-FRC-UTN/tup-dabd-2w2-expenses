export class BillPostRequest {
  description: string = '';
  amount: number = 0;
  date: Date = new Date();
  status: string = '';
  category_id: number = 0;
  supplier_id: number = 0;
  supplier_employee_type: string = 'SUPPLIER';
  type_id: number = 0;
  period_id: number = 0;
  link_pdf: string = '';
}

