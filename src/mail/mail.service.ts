import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer;

  constructor(private configService: ConfigService) {
    
    console.log('SMTP Config:', {
      host: this.configService.get('SMTP_HOST'),
      port: Number(this.configService.get('SMTP_PORT')),
      user: this.configService.get('SMTP_USER'),
      pass: this.configService.get('SMTP_PASS'),
    });

    const smtpHost = this.configService.get('SMTP_HOST');
    const smtpPort = Number(this.configService.get('SMTP_PORT'));
    const smtpUser = this.configService.get('SMTP_USER');
    const smtpPass = this.configService.get('SMTP_PASS');

    this.transporter = nodemailer.createTransport(
      {
        // host: "sandbox.smtp.mailtrap.io",
        // port: 2525,
        // auth: {
        //   user: "6a25b16fabddaf",
        //   pass: "e14bbbeddb710b"
        // }
        host: smtpHost,
        port: smtpPort,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
    });
  }
  
  
  async sendPasswordReset(email: string, resetLink: string) {
    await this.transporter.sendMail({
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset',
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });
  }
}