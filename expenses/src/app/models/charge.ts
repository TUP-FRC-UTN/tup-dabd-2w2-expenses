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
    charge_id: number;
    fine_id: number;
    lot_id: number;
}

export interface CategoryCharge {
    categoryChargeId: number;
    name: string;
    description: string;
}