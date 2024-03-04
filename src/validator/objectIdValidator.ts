import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'objectId', async: false })
export class ObjectIdValidator implements ValidatorConstraintInterface {
  validate(id: any, args: ValidationArguments) {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid ObjectId`;
  }
}
