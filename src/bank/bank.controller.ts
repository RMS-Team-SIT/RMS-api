import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BankService } from './bank.service';
import { Bank } from './schemas/bank.schema';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from 'src/auth/decorator/public.decorator';

@ApiTags('bank')
@Controller('bank')
@SkipThrottle()
@Public()
@ApiBearerAuth()
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Bank[]> {
    return this.bankService.findAll();
  }
}
