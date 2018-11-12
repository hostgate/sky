export class Order{
    id:number=null;
    status:Status=Status.new;
    cancel_rest:number=null;
    created_at:string=null;
    created_at_sec:string=null;
    last_update:string=null;
    last_update_sec:string=null; 
    member_id:number=null;
    product_id:number=null;
    agent_id:number=null;
    add_by:number=null;
    declined_by:number=null;
    canceled_by:number=null;
    cancel_from:string=null;
    cancel_from_sec:string=null;
    completed_by:number=null;
    valid_from:string=null;
    valid_from_sec:string=null;
    price:number=null;
    price_agent:number=null;
    discount:number=null;
    profit:number=null;
    member_active:Boolean=null;
    member_free:Boolean=null;
    phone_id:number=null;
    phone:string=null;
    sim_id:number=null;
    sim:string=null;
    agent_name:string=null;
    product_name:string=null;
    company_id:number=null;
    company_name:string=null;
    note:string=null;
}

enum Status {
    new,// הזמנה חדשה אין אישור עדיין
    declined,// הזמנה חדשה שלא אושרה
    cancel,//הזנמה שהייתה פעילה ובוטלה אחריי כמה שעות
    completed,// הזמנה פעילה
    disconnected,//  הזמנה שהיתה בתוקף ונותקה על חשבון הזמנה אחרת שהופעלה לפני סיום התקופה
    finished// הזמנה שנותקה אחריי שסיימה את כל התקופה
}