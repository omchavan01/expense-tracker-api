import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendOtp(email: string, otp: string) {
    const mailOptions = {
      from: `"Expense Tracker" <${this.configService.get<string>('RESEND_EMAIL')}>`,
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
    const response = await this.resend.emails.send(mailOptions);
    if (response.error) {
      console.error(
        JSON.stringify(response.error, null, 2),
        'Error sending OTP',
      );
      throw new InternalServerErrorException('Failed to send OTP');
    }
    return true;
  }
}
