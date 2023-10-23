import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          // host: config.get('MAILER_MAIL_HOST'),
          host: 'smtp.gmail.com',
          // port: config.get('MAILER_MAIL_PORT'),
          port: 587,
          secure: false,
          auth: {
            // user: config.get('MAIL_USER'),
            user: 'smartresidentcorp@gmail.com',
            // pass: config.get('MAIL_PASSWORD'),
            pass: 'yokxkyqwikhjlvma',
          },
        }
      }),
      inject: [ConfigService],
    })],
  exports: [MailService],
  providers: [MailService],
  controllers: [MailController]
})
export class MailModule { }
