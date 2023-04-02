import { IsString, IsEmail, IsUrl, IsNotEmpty } from "class-validator";

export class WebhookDTO {
  @IsNotEmpty()
  @IsString()
  webhookName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  constructor(webhookName: string, email: string, url: string) {
    this.webhookName = webhookName;
    this.email = email;
    this.url = url;
  }
}