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
    amount: number;
    categoryCharge: CategoryCharge;
    chargeId: number;
    date: Date;
    fineId: number;
    lotId: number;
    period: number;
    status: boolean;
    
}

export interface CategoryCharge {
    categoryChargeId: number;
    description: string;
    name: string;
}