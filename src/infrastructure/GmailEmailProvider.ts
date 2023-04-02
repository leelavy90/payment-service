import { Injectable } from '@nestjs/common';
import { EmailProvider } from '../domain/services/EmailProvider';
import { PaymentStatusDTO } from '../domain/dto/PaymentStatusDTO';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class GmailEmailProvider implements EmailProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  public async sendPaymentConfirmationEmail(paymentStatusDTO: PaymentStatusDTO) {
    await this.sendMail(paymentStatusDTO);
  }

  public async sendMail(paymentStatusDTO: PaymentStatusDTO) {
    const { items, email } = paymentStatusDTO;
    try {
      await this.setTransport();
      this.mailerService
        .sendMail({
          transporterName: 'gmail',
          to: email,
          from: 'lee.unipaas@gmail.com',
          subject: 'Payment Confirmation Email',
          template: 'confirmationEmailTemplate',
          context: {
            items: items
          },
        })
        .then((success) => {
          console.log(success);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error)
    }
  }

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('GOOGLE_EMAIL'),
        clientId: this.configService.get('GOOGLE_CLIENT_ID'),
        clientSecret: this.configService.get('GOOGLE_CLIENT_SECRET'),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }
}
