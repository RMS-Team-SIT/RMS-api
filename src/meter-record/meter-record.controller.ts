import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MeterRecordService } from "./meter-record.service";
import { CreateMeterRecordListDto } from "./dto/create-meter-record-list.dto";
import { Public } from "src/auth/decorator/public.decorator";

@Controller('meter-record')
@ApiTags('Meter Record')
export class MeterRecordController {
    constructor(
        private readonly meterRecordService: MeterRecordService
    ) { }

    @Post("/:id")
    @Public()
    async createMeterRecordList(
        @Param('id') residenceId: string,
        @Body() createMeterRecordListDto: CreateMeterRecordListDto
    ) {
        return this.meterRecordService.createMeterRecordList(residenceId, createMeterRecordListDto);
    }
}