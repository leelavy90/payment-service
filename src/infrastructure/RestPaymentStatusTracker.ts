import { Injectable } from "@nestjs/common";
import { PaymentStatusTracker } from "../domain/services/PaymentStatusTracker";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError, AxiosResponse } from "axios";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RestPaymentStatusTracker implements PaymentStatusTracker {
  private readonly privateKey: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {
    this.privateKey = configService.get<string>('PRIVATE_KEY')
  }

  async getPaymentStatusByAuthId(authId: string): Promise<AxiosResponse> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.privateKey}`,
    };

    const response = await firstValueFrom(
      this.httpService.get(`https://sandbox.unipaas.com/platform/pay-ins/${authId}`,{ headers }).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    return response
  }

}