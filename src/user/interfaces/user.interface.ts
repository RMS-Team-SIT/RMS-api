export interface User {
    id: string;
    firstname: string;
    lastname: string;
    age: number;
    email: string;
    password: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
}

export enum UserRole {
    ADMIN = 'admin',
    LANDLORD = 'landlord',
    TENANT = 'tenant',
}