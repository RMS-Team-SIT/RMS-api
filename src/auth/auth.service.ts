import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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

    if (!(await this.isPasswordMatch(signInDto.password, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user._id, user: user };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async isPasswordMatch(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
