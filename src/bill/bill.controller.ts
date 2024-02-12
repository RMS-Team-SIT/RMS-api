import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BillService } from './bill.service';
import { Public } from 'src/auth/decorator/public.decorator';
import { CreateBillDto } from './dto/create-bill.dto';

@ApiTags('Bill')
@Controller('/residence/:residenceId/bill')
// @ApiBearerAuth()
@Public() // <- For testing remove this 
export class BillController {
    constructor(
        private readonly billService: BillService
    ) { }

    @Post('')
    async createBill(
        @Req() req,
        @Param('residenceId') residenceId: string,
        @Body() createBillDto: CreateBillDto
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
        @Param('billId') billId: string
    ) {
        return this.billService.getBillById(residenceId, billId);
    }

}
