import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { isPasswordMatch } from 'src/utils/password.utils';
import { SignInRenterDto } from './dto/signin-renter.dto';
import { RenterService } from 'src/renter/renter.service';
import { UserRole } from './enum/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
    private renterService: RenterService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<object> {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user)
      throw new UnauthorizedException({
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      });

    if (!(await isPasswordMatch(signInDto.password, user.password))) {
      throw new UnauthorizedException({
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      });
    }

    const payload = {
      sub: user._id.toString(),
      id: user._id.toString(),
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      payload,
      role: user.role,
    };
  }

  async signInRenter(signInRenter: SignInRenterDto): Promise<object> {
    const { residenceId, username, password } = signInRenter;

    try {
      const renter = await this.renterService.signInRenter(
        residenceId,
        username,
        password,
      );
      console.log('renter', renter);

      const payload = {
        sub: renter._id.toString(),
        id: renter._id.toString(),
        role: UserRole.RENTER,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
        payload,
        role: UserRole.RENTER,
      };
    } catch (e) {
      throw new UnauthorizedException({
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
      });
    }
  }
}
