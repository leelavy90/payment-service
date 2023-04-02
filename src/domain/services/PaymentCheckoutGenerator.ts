import { PaymentDTO } from "../dto/PaymentDTO";

export interface PaymentCheckoutGenerator {
  createPayment(paymentDTO: PaymentDTO): Promise<string>
}