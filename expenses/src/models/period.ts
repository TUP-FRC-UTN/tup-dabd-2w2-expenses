export default class Period{
    id:number|null=null;
    
    month:number=0;

    year:number=0

    getNameMonth(){
        const months = [
            'Enero',   
            'Febrero',
            'Marzo',   
            'Abril',   
            'Mayo',
            'Junio',  
            'Julio',   
            'Agosto',
            'Septiembre', 
            'Octubre', 
            'Noviembre', 
            'Diciembre' 
        ];

        return months[this.month - 1];
    }
}