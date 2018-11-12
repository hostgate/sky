export class Payment {
    id: number=null;
    amount:number=0.0;
    note:string;
    art:Art=Art.cash;
    rest_order:number=0;//der nummer der Order die falls sie gestopt wuerde.
    related_to_date:string=null;
    agent_id:number=null;
    agent_name:string='';
    credit:number=0;
    shek_number:string;
    bank_branch:string;
    bank_name:string;
    shek_maturity_date:string;
    bs_bank:string;
}
enum Art {
    shek,
    credit,
    cash,
    rest
}