 class ChargeType{
    constructor(id:number,name:string){
        this.id=id
        this.name=name
    }
    id:number|null=null
    name:string=""
}

 let listCharge: ChargeType[]=[
]

listCharge[0]= new ChargeType(1,"Servicio limpieza")
listCharge[1]= new ChargeType(1,"Varios")
listCharge[2]= new ChargeType(1,"Deudas")

export { listCharge, ChargeType }