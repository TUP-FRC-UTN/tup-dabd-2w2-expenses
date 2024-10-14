export interface Charge2 {
    id: number;
    fechaEmision: string;
    lote: number;
    tipo: string;
    periodo: string;
    monto: number;
    descripcion: string;
}

export interface Charge {
    date: Date;
    amount: number;
    periodId: number;
    category: CategoryCharge;
    status: boolean;
    charge_Id: number;
    fine_Id: number;
    lot_Id: number;
}

export interface CategoryCharge {
    categoryChargeId: number;
    name: string;
    description: string;
}