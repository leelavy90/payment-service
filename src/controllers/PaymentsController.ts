import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { PaymentsService } from "../application/PaymentsService";
import { PaymentDTO } from "../domain/dto/PaymentDTO";

@Controller('/create-payment')
export class PaymentsController {

  constructor(private paymentService: PaymentsService) {}

  @Post()
  async createPayment(@Body(new ValidationPipe()) paymentDTO: PaymentDTO): Promise<string> {
    return this.paymentService.createPayment(paymentDTO);
  }
}