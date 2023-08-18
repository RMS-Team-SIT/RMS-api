import { Injectable } from '@nestjs/common';
import { User, UserRole } from './interfaces/user.interface';

@Injectable()
export class UserService {
    private readonly users: User[] = [
        {
            id: '1',
            firstname: 'John',
            lastname: 'Doe',
            email: 'johndoe@gmail.com',
            age: 25,
            password: '123456',
            role: UserRole.ADMIN,
            created_at: new Date(),
            updated_at: new Date(),
        }
    ];

    async findAll(): Promise<User[]> {
        return this.users;
    }
}
