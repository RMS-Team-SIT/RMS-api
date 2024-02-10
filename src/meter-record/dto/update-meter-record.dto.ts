import { PartialType } from '@nestjs/swagger';
import { CreateMeterRecordDto } from './create-meter-record.dto';

export class UpdateMeterRecord extends PartialType(CreateMeterRecordDto) {}
