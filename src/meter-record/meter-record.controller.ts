import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { MeterRecordService } from "./meter-record.service";
import { CreateMeterRecordDto } from "./dto/create-meter-record.dto";
import { Public } from "src/auth/decorator/public.decorator";
import { ResidenceService } from "src/residence/residence.service";

@Controller('/residence/:residenceId/meter-record')
@ApiTags('Meter Record')
@ApiBearerAuth()
export class MeterRecordController {
    constructor(
        private readonly meterRecordService: MeterRecordService,
        private readonly residenceService: ResidenceService,
    ) { }

    @Post('')
    @Public()
    async createMeterRecordList(
        @Param('residenceId') residenceId: string,
        @Body() createMeterRecordListDto: CreateMeterRecordDto
    ) {
        return this.meterRecordService.createMeterRecord(residenceId, createMeterRecordListDto);
    }
}