import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BillService } from './bill.service';
import { Public } from 'src/auth/decorator/public.decorator';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { UpdateBillRoomDto } from './dto/update-bill-room.dto';

@ApiTags('Bill')
@Controller('/residence/:residenceId/bill')
// @ApiBearerAuth()
@Public() // <- For testing remove this
export class BillController {
  constructor(private readonly billService: BillService) {}

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
}
