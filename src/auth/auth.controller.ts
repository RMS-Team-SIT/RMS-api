import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignInRoomUserDto } from './dto/signin-room-user.dto';
import { Public } from './decorator/public.decorator';

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signinwithroomuser')
  signInWithRoomUser(@Body() signInRoomUserDto: SignInRoomUserDto) {
    return this.authService.signIn(null);
  }
}
