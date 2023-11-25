// write a function to random secure string with length 20
import * as crypto from 'crypto';

export function randomResetPasswordToken(length: number = 20): string {
  return crypto.randomBytes(length).toString('hex');
}
