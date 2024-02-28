import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendResetPassword({
    to,
    resetToken,
  }: {
    to: string;
    resetToken: string;
  }): Promise<{ result: boolean; message: string; errorMessage: string }> {
    return await this.mailerService
      .sendMail({
        to, // list of receivers
        from: process.env.SENDER_EMAIL,
        subject: 'Password reset for RMS account', // Subject line
        text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${resetToken}\n\nPlease ignore this email if you did not request a password reset.\n\n\nRMS Team`, // plaintext body
      })
      .then(() => {
        console.info('Email sent successfully');
        return {
          result: true,
          message: 'Email sent successfully',
          errorMessage: null,
        };
      })
      .catch((err) => {
        console.warn(err);
        return { result: true, message: 'Error Occured', errorMessage: err };
      });
  }

  async sendVerification({
    to,
    token,
  }: {
    to: string;
    token: string;
  }): Promise<{ result: boolean; message: string; errorMessage: string }> {
    return await this.mailerService
      .sendMail({
        to, // list of receivers
        from: process.env.SENDER_EMAIL,
        subject: 'Account verification for RMS account',
        text: `Please use the following link to verify your account: ${process.env.CLIENT_URL}/verify/${token}\n\nPlease ignore this email if you did not create account.\n\n\nRMS Team`, // plaintext body
      })
      .then(() => {
        console.info('Email sent successfully');
        return {
          result: true,
          message: 'Email sent successfully',
          errorMessage: null,
        };
      })
      .catch((err) => {
        console.warn(err);
        return { result: true, message: 'Error Occured', errorMessage: err };
      });
  }

  async sendNotification({
    to,
    title,
    content,
  }: {
    to: string;
    title: string,
    content: string,
  }): Promise<{ result: boolean; message: string; errorMessage: string }> {
    return await this.mailerService
      .sendMail({
        to, // list of receivers
        from: process.env.SENDER_EMAIL,
        subject: 'มีการแจ้งเตือนใหม่สำหรับ RMS', // Subject line
        text: `แจ้งเตือนใหม่สำหรับคุณ \n${title}\n${content}`, // plaintext body
      })
      .then(() => {
        console.info('Email sent successfully');
        return {
          result: true,
          message: 'Email sent successfully',
          errorMessage: null,
        };
      })
      .catch((err) => {
        console.warn(err);
        return { result: true, message: 'Error Occured', errorMessage: err };
      });
  }

}
