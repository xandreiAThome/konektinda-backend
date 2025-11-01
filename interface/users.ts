export interface User {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password_hash: string;
    phone_number: string;
    email_verified: boolean;
    role: 'CONSUMER' | 'SUPPLIER';
    profile_picture_url: string;
    supplier_id?: string;
}