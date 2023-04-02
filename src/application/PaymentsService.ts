import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { RestPaymentCheckoutGenerator } from "../infrastructure/RestPaymentCheckoutGenerator";
import { PaymentDTO } from "../domain/dto/PaymentDTO";
import { WebhookCheckoutAuthorizationSubscriber } from "../infrastructure/WebhookCheckoutAuthorizationSubscriber";
import { RestPaymentStatusTracker } from '../infrastructure/RestPaymentStatusTracker'
import { AxiosResponse } from "axios";
import { PaymentStatusDTO } from "../domain/dto/PaymentStatusDTO";

@Injectable()
export class PaymentsService implements OnModuleInit {

  constructor(
    @Inject('PaymentCheckoutGenerator') private readonly paymentCheckoutGenerator: RestPaymentCheckoutGenerator,
    @Inject('CheckoutAuthorizationSubscriber') private readonly checkoutAuthorizationSubscriber: WebhookCheckoutAuthorizationSubscriber,
    @Inject('PaymentStatusTracker') private readonly paymentStatusTracker: RestPaymentStatusTracker
  ) {}

  async onModuleInit() {
    await this.subscribeToCheckoutAuthorization()
  }

  public async createPayment(paymentDTO: PaymentDTO): Promise<string> {
    const paymentCheckoutLink = await this.paymentCheckoutGenerator.createPayment(paymentDTO)
    return paymentCheckoutLink
  }

  public async getPaymentStatusByAuthId(authId: string): Promise<AxiosResponse> {
    return await this.paymentStatusTracker.getPaymentStatusByAuthId(authId)
  }

  public createPaymentStatusDTO(paymentStatusData) {
    const { authorizationStatus, amount, items } = paymentStatusData
    return new PaymentStatusDTO(authorizationStatus, amount, items)
  }

  private async subscribeToCheckoutAuthorization() {
    try {
      await this.checkoutAuthorizationSubscriber.subscribe()
    } catch (error) {
      console.log(`subscription to webhook failed: ${error}`)
    }
  }
}
