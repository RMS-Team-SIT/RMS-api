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
                from: process.env.SENDER_EMAIL, // sender address
                subject: 'Testing Nest MailerModule ✔', // Subject line
                text: `welcome ${resetToken}`, // plaintext body
            })
            .then(() => { })
            .catch((err) => {
                console.log(err);
            });
    }

}
