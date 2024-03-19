import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('/health')
@ApiTags('HealthCheck')
@Public()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) { }

  @Get('/check')
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  checkRunning() {
    return 'running';
  }

}
