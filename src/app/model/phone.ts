export class Phone {
    id: number;
    phone: string;
    note: string
    used: Boolean;
    created_at: string;
    created_at_sec: string;
    last_update: string;
    last_update_sec: string;
    agent_id: number;
    moved_to_phone:string='0';
    accepted_moved_to_phone:string='0';
    agent_name:string;
    company_id:number;
    company_name:string;
    accepted_moved_date:string;
    accepted_moved_date_num:string;
    product_id:number;
    product_name:string; 
}
