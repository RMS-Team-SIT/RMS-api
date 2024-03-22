import { PartialType } from '@nestjs/swagger';
import { CreateBillDto } from './create-bill.dto';
import { BillRoomStatus } from '../enum/bill-room-status.enum';

export class UpdateBillDto extends PartialType(CreateBillDto) {}
