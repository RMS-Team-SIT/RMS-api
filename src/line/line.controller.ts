import { Controller, Post, Get, Req, Body } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { LineService } from './line.service';

@Controller('line')
@ApiTags('line')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Post('oauth')
  async lineOAuth(@Body() body): Promise<object> {
    // return this.userService.lineOAuth(body);
    return {};
  }

  @Public()
  // line callback
  @Get('oauth/callback')
  async lineOAuthCallback(@Req() req): Promise<object> {
    // return this.userService.lineOAuthCallback(req);
    return {};
  }
}
