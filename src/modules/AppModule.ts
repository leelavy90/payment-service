import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { HttpModule } from "@nestjs/axios";
import { PaymentsController } from "../controllers/PaymentsController";
import { CheckoutAuthorizationController } from "../controllers/CheckoutAuthorizationController";
import { PaymentsService } from "../application/PaymentsService";
import { MailingService } from "../application/MailingService";
import { RestPaymentCheckoutGenerator } from "../infrastructure/RestPaymentCheckoutGenerator";
import { RestPaymentStatusTracker } from "../infrastructure/RestPaymentStatusTracker";
import { WebhookCheckoutAuthorizationSubscriber } from "../infrastructure/WebhookCheckoutAuthorizationSubscriber";
import { GmailEmailProvider } from "../infrastructure/GmailEmailProvider";

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [PaymentsController, CheckoutAuthorizationController],
  providers: [
    PaymentsService,
    MailingService,
    {
      provide: 'PaymentCheckoutGenerator',
      useClass: RestPaymentCheckoutGenerator
    },
    {
      provide: 'PaymentStatusTracker',
      useClass: RestPaymentStatusTracker
    },
    {
      provide: 'CheckoutAuthorizationSubscriber',
      useClass: WebhookCheckoutAuthorizationSubscriber
    },
    {
      provide: 'EmailProvider',
      useClass: GmailEmailProvider
    },
  ],
})
export class AppModule {}
