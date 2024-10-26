import Period from "./period";

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
    periodCharge: PeriodCharge;
    status: boolean;
    description: string;
    
}

export interface CategoryCharge {
    categoryChargeId: number;
    description: string;
    name: string;
}

export interface PeriodCharge {
    id: number ;
    month: number;
    year: number ;
    state:string;
    start_date : Date;
    end_date: Date ;
    status : string;
}

export enum ChargeFilters {
    NOTHING = 'NOTHING',
    PERIOD_ID = 'PERIOD_ID',
    LOT_NUMBER = 'LOT_NUMBER',
    CATEGORY_CHARGE = 'CATEGORY_CHARGE'
  }