import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { FacilityService } from './facility.service';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('facility')
@Controller('facility')
@SkipThrottle()
@ApiBearerAuth()
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Get()
  @Public()
  async findAll() {
    return this.facilityService.findAll();
  }
}
