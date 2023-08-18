// Create user dto
// Compare this snippet from backend\src\user\interfaces\user.interface.ts:
export class CreateUserDto {
    readonly firstname: string;
    readonly lastname: string;
    readonly email: string;
    readonly password: string;
    readonly role: string;
    readonly age: number;
}
