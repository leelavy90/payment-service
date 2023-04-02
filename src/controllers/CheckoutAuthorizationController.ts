import { Body, Controller, Post, Headers } from "@nestjs/common";
import { createHmac } from "crypto";
import { ConfigService } from "@nestjs/config";
import { MailingService } from "../application/MailingService";
import { PaymentsService } from "../application/PaymentsService";

@Controller('/checkout-authorization-webhook')
export class CheckoutAuthorizationController {
  private readonly privateKey: string;

  constructor(
    private mailingService: MailingService,
    private configService: ConfigService,
    private paymentService: PaymentsService
  ) {
    this.privateKey = configService.get<string>('PRIVATE_KEY')
  }

  @Post()
  async receiveCheckoutStatus(@Body() body: any, @Headers() headers: any) {
    const { authorizationStatus, authorizationId } = body
    console.log('receiveCheckoutStatus body')
    console.log(body)
    const shouldSendConfirmationEmail = this.verifyWebhookOrigin(body, headers) && authorizationStatus === 'Captured'
    if (!shouldSendConfirmationEmail) {
      return
    }
    const paymentStatusData = await this.paymentService.getPaymentStatusByAuthId(authorizationId)
    console.log('receiveCheckoutStatus paymentStatusData')
    console.log(paymentStatusData)
    const paymentStatusDTO = this.paymentService.createPaymentStatusDTO(paymentStatusData.data)
    await this.mailingService.sendPaymentConfirmationEmail(paymentStatusDTO)
  }

  private verifyWebhookOrigin(body: any, headers: any): boolean {
    const signedHeader = headers['x-hmac-sha256'];
    const hash = createHmac('sha256', this.privateKey)
      .update(JSON.stringify(body))
      .digest('hex');
    const buff = Buffer.from(hash);
    const calculated = buff.toString('base64');

    return calculated === signedHeader
  }
}