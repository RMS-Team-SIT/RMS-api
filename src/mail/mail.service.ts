import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

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
        subject: 'รีเซทรหัสผ่านสำหรับ RMS', // Subject line
        text: `โปรดใช้ลิงก์ต่อไปนี้เพื่อรีเซ็ตรหัสผ่านของคุณ: ${process.env.CLIENT_URL}/reset-password/${resetToken}\n\nโปรดเพิกเฉยต่ออีเมลนี้หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน\n\n\nทีมงาน RMS`, // plaintext body
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
        subject: 'ยืนยันบัญชีของคุณใน RMS',
        text: `โปรดใช้ลิงก์ต่อไปนี้เพื่อยืนยันบัญชีของคุณ: ${process.env.CLIENT_URL}/verify/${token}\n\nโปรดอย่าสนใจอีเมลนี้หากคุณไม่ได้สร้างบัญชี\n\n\nทีมงาน RMS`,
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
    title: string;
    content: string;
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
