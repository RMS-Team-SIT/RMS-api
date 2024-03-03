import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export function validateObjectIdFormat(
  objectId: string,
  fieldName?: string,
): boolean {
  // if (!Types.ObjectId.isValid(objectId)) {
  //   throw new BadRequestException(`${fieldName || objectId} is invalid format`);
  // }
  return true;
}
