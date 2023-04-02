import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import { ConfigService } from "@nestjs/config";
import { CheckoutAuthorizationSubscriber } from "../domain/services/CheckoutAuthorizationSubscriber";
import { WebhookDTO } from "../domain/dto/WebhookDTO";

@Injectable()
export class WebhookCheckoutAuthorizationSubscriber implements CheckoutAuthorizationSubscriber {

  private readonly webhookName: string = 'authorization/update'
  private readonly webhookUrl: string;
  private readonly privateKey: string;
  private readonly platformEmail: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {
    this.privateKey = configService.get<string>('PRIVATE_KEY')
    this.platformEmail = configService.get<string>('PLATFORM_EMAIL')
    this.webhookUrl = `${configService.get<string>('BASE_URL')}/checkout-authorization-webhook`
  }

  async subscribe() {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.privateKey}`,
    };

    const webhookDTO = new WebhookDTO(this.webhookName, this.platformEmail, this.webhookUrl)

    await firstValueFrom(
      this.httpService.post('https://sandbox.unipaas.com/platform/webhooks', webhookDTO, { headers }).pipe(
        catchError((error: AxiosError) => {
          throw error.message
        }),
      ),
    );
  }
}