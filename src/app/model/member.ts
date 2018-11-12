export class Member {
    id: number=null;
    agent_id:number=null;
    agent_name:string=null;
    consumer_id:number=null;
    consumer_name:string=null;
    consumer_national_id:string=null;
    company_id:number=null;
    company_name:string=null;
    phone_id:number=null;
    phone:string=null;
    sim_id:number=null;
    sim:string=null;
    active: boolean=true;
    free: boolean=true;
    moved:boolean=false;
    moved_to_phone:string='0';
    note:string='';
    has_orders:Boolean=false;
    connected:number;
    connected_order:number;
    connected_to_date:string;
    note_trans_phone:string;
    note_trans_sim:string;
}