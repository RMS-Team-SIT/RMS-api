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
          host: process.env.MAILER_MAIL_HOST,
          port: process.env.MAILER_MAIL_PORT,
          secure: false,
          auth: {
            user: process.env.MAILER_SENDER_EMAIL,
            pass: process.env.MAILER_SENDER_PASSWORD,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MailService],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
