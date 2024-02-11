import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Bill')
@Controller('/residence/:residenceId/bill')
@ApiBearerAuth()
export class BillController {
    
}
