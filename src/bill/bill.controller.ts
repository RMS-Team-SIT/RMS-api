import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BillService } from './bill.service';
import { Public } from 'src/auth/decorator/public.decorator';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { UpdateBillRoomDto } from './dto/update-bill-room.dto';
import { UpdateBillRoomPaidEvidenceDto } from './dto/update-bill-room-paid-evidence.dto';
import { UpdateBillRoomStatusDto } from './dto/update-bill-room-status.dto';

@ApiTags('Bill')
@Controller('/residence/:residenceId/bill')
// @ApiBearerAuth()
@Public() // <- For testing remove this
export class BillController {
  constructor(private readonly billService: BillService) { }

  @Post('')
  async createBill(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Body() createBillDto: CreateBillDto,
  ) {
    return this.billService.createBill(residenceId, createBillDto);
  }

  @Get('')
  async getBillByResidence(@Param('residenceId') residenceId: string) {
    return this.billService.getBillByResidence(residenceId);
  }

  @Get('/:billId')
  async getBillById(
    @Param('residenceId') residenceId: string,
    @Param('billId') billId: string,
  ) {
    return this.billService.findById(residenceId, billId);
  }

  @Put('/:billId/')
  async payBill(
    @Param('residenceId') residenceId: string,
    @Param('billId') billId: string,
    @Body() updateBillDto: UpdateBillDto,
  ) {
    return this.billService.updateBill(residenceId, billId, updateBillDto);
  }


  @Get('/:billId/bill-room/:billRoomId')
  async getBillRoomById(
    @Param('residenceId') residenceId: string,
    @Param('billId') billId: string,
    @Param('billRoomId') billRoomId: string,
  ) {
    return this.billService.findBillRoomById(billId, billRoomId);
  }

  @Put('/:billId/bill-room/:billRoomId')
  async updateBillRoom(
    @Param('residenceId') residenceId: string,
    @Param('billId') billId: string,
    @Param('billRoomId') billRoomId: string,
    @Body() updateBillRoomDto: UpdateBillRoomDto,
  ) {
    return this.billService.updateBillRoom(
      billId,
      billRoomId,
      updateBillRoomDto,
    );
  }

  @Put('/:billId/bill-room/:billRoomId/status')
  async updateBillRoomStatus(
    @Param('residenceId') residenceId: string,
    @Param('billId') billId: string,
    @Param('billRoomId') billRoomId: string,
    @Body() updateBillRoomDto: UpdateBillRoomStatusDto,
  ) {
    return this.billService.updateBillRoomStatus(
      billId,
      billRoomId,
      updateBillRoomDto,
    );
  }

  @Put('/:billId/bill-room/:billRoomId/paid-evidence')
  async updateBillRoomPaidEvidence(
    @Param('residenceId') residenceId: string,
    @Param('billId') billId: string,
    @Param('billRoomId') billRoomId: string,
    @Body() updateBillRoomDto: UpdateBillRoomPaidEvidenceDto,
  ) {
    return this.billService.updateBillRoomPaidEvidence(
      billId,
      billRoomId,
      updateBillRoomDto,
    );
  }

}
