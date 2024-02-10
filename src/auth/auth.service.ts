import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { isPasswordMatch } from 'src/utils/password.utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<any> {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user)
      throw new UnauthorizedException({ message: 'Invalid credentials' });

    if (!(await isPasswordMatch(signInDto.password, user.password))) {
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    }

    const payload = { sub: user._id.toString(), id: user._id.toString() };
    return {
      access_token: await this.jwtService.signAsync(payload),
      payload,
    };
  }
}
