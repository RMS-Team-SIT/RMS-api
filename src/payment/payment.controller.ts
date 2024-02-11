import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from 'src/auth/decorator/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateResidencePaymentDto } from './dto/create-residence-payment.dto';
import { UpdateResidencePaymentDto } from './dto/update-residence-payment.dto';

@Controller('residence/:residenceId/payment')
@ApiTags('Payment')
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('')
  async createPayment(
    @Param('residenceId') residenceId: string,
    @Body() createResidencePaymentDto: CreateResidencePaymentDto,
  ) {
    return await this.paymentService.createPayment(
      residenceId,
      createResidencePaymentDto,
    );
  }

  @Get('/:paymentId')
  async getPayment(
    @Param('residenceId') residenceId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return await this.paymentService.findOnePaymentInResidence(
      residenceId,
      paymentId,
    );
  }

  @Put('/:paymentId')
  async updatePayment(
    @Param('residenceId') residenceId: string,
    @Param('paymentId') paymentId: string,
    @Body() updateResidencePaymentDto: UpdateResidencePaymentDto,
  ) {
    return await this.paymentService.updatePaymentInResidence(
      residenceId,
      paymentId,
      updateResidencePaymentDto,
    );
  }
}
