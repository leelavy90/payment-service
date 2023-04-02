import { PaymentStatusDTO } from "../dto/PaymentStatusDTO";

export interface EmailProvider {
  sendPaymentConfirmationEmail(paymentConfirmationEmailDTO: PaymentStatusDTO)
}