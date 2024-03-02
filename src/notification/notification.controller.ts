import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { Roles } from 'src/auth/decorator/user-role.decorator';
import { UserRole } from 'src/auth/enum/user-role.enum';

@ApiTags('notification')
@Controller('notification')
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/all')
  @Roles(UserRole.ADMIN)
  async findAll() {
    return await this.notificationService.findAll();
  }

  @Get('my')
  async findByTo(@Req() req) {
    const currentUser = req.user.id;
    console.log(currentUser);

    return await this.notificationService.findByTo(currentUser);
  }
}
