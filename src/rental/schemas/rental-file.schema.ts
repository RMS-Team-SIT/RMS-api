import { Document } from 'mongoose';

export class RentailFile extends Document {
  _id: string;

  fileName: string;
}
