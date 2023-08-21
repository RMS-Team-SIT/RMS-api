import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

    constructor(private readonly mailerService: MailerService) {

    }

    async sendResetPassword({
        to,
        resetToken,
    }: {
        to: string,
        resetToken: string,
    }): Promise<void> {
        await this.mailerService
            .sendMail({
                to, // list of receivers
                from: process.env.SENDER_EMAIL,
                subject: 'Password reset for SmartResident account', // Subject line
                text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password?token=${resetToken}\n\nPlease ignore this email if you did not request a password reset.\n\n\nSmartResident Team`, // plaintext body
            })
            .then(() => {
                console.log('Email sent successfully');
            })
            .catch((err) => {
                console.log(err);
            });
    }

}
