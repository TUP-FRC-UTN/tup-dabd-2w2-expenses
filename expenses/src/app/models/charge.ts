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
    fineId: number;
    lotId: number;
    date: Date;
    periodId: number;
    amount: number;
    categoryChargeId: number;
}