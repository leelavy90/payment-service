import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { PaymentCheckoutGenerator } from "../domain/services/PaymentCheckoutGenerator";
import { PaymentDTO } from "../domain/dto/PaymentDTO";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RestPaymentCheckoutGenerator implements PaymentCheckoutGenerator {
  private readonly privateKey: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {
    this.privateKey = configService.get<string>('PRIVATE_KEY')
  }

  async createPayment(paymentDTO: PaymentDTO): Promise<string> {

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.privateKey}`,
    };

    const response = await firstValueFrom(
      this.httpService.post('https://sandbox.unipaas.com/platform/pay-ins/checkout', paymentDTO, { headers }).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return response.data.shortLink
  }
}