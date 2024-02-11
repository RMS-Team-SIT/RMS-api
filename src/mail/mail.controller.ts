import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { randomToken } from 'src/utils/random.utils';

@Controller('mail')
@ApiTags('Mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Post('send-reset-password')
  public sendResetPassword(): void {
    this.mailService.sendResetPassword({
      to: 'siriwatjaiyungyuen@gmail.com',
      resetToken: randomToken(),
    });
  }
}
