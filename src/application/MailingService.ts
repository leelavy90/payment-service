import { Inject, Injectable } from "@nestjs/common";
import { GmailEmailProvider } from "../infrastructure/GmailEmailProvider";
import { PaymentStatusDTO } from "../domain/dto/PaymentStatusDTO";

@Injectable()
export class MailingService {

  constructor(
    @Inject('EmailProvider') private readonly emailProvider: GmailEmailProvider,
  ) {}

  public async sendPaymentConfirmationEmail(paymentStatusDTO: PaymentStatusDTO) {
    await this.emailProvider.sendPaymentConfirmationEmail(paymentStatusDTO)
  }
}
