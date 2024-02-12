import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MeterRecordService } from './meter-record.service';
import { CreateMeterRecordDto } from './dto/create-meter-record.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { ResidenceService } from 'src/residence/residence.service';
import { UpdateMeterRecord } from './dto/update-meter-record.dto';
import { MeterRecord } from './schemas/meter-record.schema';

@Controller('/residence/:residenceId/meter-record')
@ApiTags('Meter Record')
@ApiBearerAuth()
export class MeterRecordController {
  constructor(
    private readonly meterRecordService: MeterRecordService,
    private readonly residenceService: ResidenceService,
  ) { }

  @Post('')
  async createMeterRecord(
    @Param('residenceId') residenceId: string,
    @Body() createMeterRecordListDto: CreateMeterRecordDto,
  ) {
    return this.meterRecordService.createMeterRecord(
      residenceId,
      createMeterRecordListDto,
    );
  }

  @Get('')
  async getMeterRecord(@Param('residenceId') residenceId: string) {
    return this.meterRecordService.getMeterRecordByResidence(residenceId);
  }

  @Get('/latest')
  async getLatestMeterRecord(@Param('residenceId') residenceId: string) {
    const meterRecord = await this.meterRecordService.getLastMeterRecordByResidence(residenceId);
    console.log('meterRecord', meterRecord);

    return { latestdMeterRecord: meterRecord };
  }

  @Get('/:meterRecordId')
  async getMeterRecordById(
    @Param('residenceId') residenceId: string,
    @Param('meterRecordId') meterRecordId: string,
  ) {
    return this.meterRecordService.getMeterRecordByIdAndResidenceId(
      meterRecordId,
      residenceId,
    );
  }

  @Put('/:meterRecordId')
  async updateMeterRecord(
    @Param('residenceId') residenceId: string,
    @Param('meterRecordId') meterRecordId: string,
    @Body() updateMeterRecordDto: UpdateMeterRecord,
  ) {
    return this.meterRecordService.updateMeterRecord(
      residenceId,
      meterRecordId,
      updateMeterRecordDto,
    );
  }
}
