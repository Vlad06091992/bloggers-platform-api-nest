import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(email: string, subject: string, text: string) {
    await this.mailerService.sendMail({
      from: '"Vlad" <Smirnov.ru92@mail.ru>',
      to: email,
      subject: subject,
      text: text,
    });
    return;
  }

  async registrationConfirmation(email: string, confirmationCode: string) {
    const text = `<h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
      <a href='https://some-front.com/confirm-registration?code=${confirmationCode}'>complete registration</a>
    </p>`;
    await this.mailerService.sendMail({
      from: '"bloggersAPI@testing" <Smirnov.ru92@mail.ru>',
      to: email,
      subject: 'Confirmation of registration',
      html: text,
    });
    return;
  }

  async recoveryPassword(email: string, recoveryCode: string) {
    const html = `<h1>Recovery password</h1>
    <p>To finish recovery password please follow the link below:
      <a href='https://somesite.com/recovery-password?code=${recoveryCode}'>recovery password</a>
    </p>`;

    await this.mailerService.sendMail({
      from: '"bloggersAPI@testing" <Smirnov.ru92@mail.ru>',
      to: email,
      subject: 'Recovery password',
      html: html,
    });
    return;
  }
}
