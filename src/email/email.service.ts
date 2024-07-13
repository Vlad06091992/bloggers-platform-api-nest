import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(email: string, subject: string, text: string) {
    // Отправка почты
    await this.mailerService.sendMail({
      from: '"Vlad" <Smirnov.ru92@mail.ru>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text,
    });
    return;
  }

  async registrationConfirmation(email: string, confirmationCode: string) {
    const text = `<h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
      <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
    </p>`;

    // Отправка почты
    await this.mailerService.sendMail({
      from: '"bloggersAPI@testing" <Smirnov.ru92@mail.ru>', // sender address
      to: email, // list of receivers
      subject: 'Confirmation of registration', // Subject line
      html: text,
    });
    return;
  }

  async recoveryPassword(email: string, recoveryCode: string) {
    const html = `<h1>Recovery password</h1>
    <p>To finish recovery password please follow the link below:
      <a href='https://somesite.com/recovery-password?code=${recoveryCode}'>recovery password</a>
    </p>`;

    // Отправка почты
    await this.mailerService.sendMail({
      from: '"bloggersAPI@testing" <Smirnov.ru92@mail.ru>', // sender address
      to: email, // list of receivers
      subject: 'Recovery password', // Subject line
      html: html,
    });
    return;
  }
}
