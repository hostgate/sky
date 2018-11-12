export class Product {
    id: number;
    name: string;
    name_ar: string;
    name_en: string;
    description: string;
    description_ar: string;
    description_en: string;
    price: number;
    active: Boolean;
    company_id: number;
    created_at: string;
    created_at_sec: string;
    last_update: string;
    last_update_sec: string;
    level_id: number;
    company_name:string;
    company_name_ar:string;
    company_name_en:string;
    days_or_months:string='months';
    days_or_months_numbers:number;
}