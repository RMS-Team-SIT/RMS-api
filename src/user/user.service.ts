import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    getUsers(): Array<object> {
        return [{ name: 'John Doe' }, { name: 'Jane Doe' }];
    }
}
