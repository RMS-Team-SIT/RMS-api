import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    const saltRound = parseInt(process.env.BCRYPT_SALT) || 5;
    return bcrypt.hash(password, saltRound);
}

export async function isPasswordMatch(
    password: string,
    hash: string,
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}