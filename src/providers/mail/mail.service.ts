import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('NODEMAILER_EMAIL'),
        pass: this.configService.get<string>('NODEMAILER_PASSWORD'),
      },
    });
  }

  async sendOtp(email: string, otp: string) {
    const mailOptions = {
      from: this.configService.get<string>('NODEMAILER_EMAIL'),
      to: email,
      subject: 'OTP for verification',
      html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Verification Code</h2>
        <p>Your one-time password to verify your email is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This code expires in 3 minutes. Please do not share it with anyone.</p>
      </div>
    `,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to send OTP',
        error as Error,
      );
    }
  }
}
