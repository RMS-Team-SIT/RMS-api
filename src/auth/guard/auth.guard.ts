import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { UserService } from 'src/user/user.service';
import { UserRole } from '../enum/user-role.enum';
import { RenterService } from 'src/renter/renter.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly userService: UserService,
    private readonly renterService: RenterService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      const { id, role } = payload;

      if (role === UserRole.RENTER) {
        const renter = await this.renterService.findOneRenter(id);
        if (!renter) {
          throw new UnauthorizedException();
        }
        request['user'] = { id, roles: role, renter };
      } else {
        const user = await this.userService.findOne(id);
        if (!user) {
          throw new UnauthorizedException();
        }
        request['user'] = { id, roles: user.role };
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private getTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
