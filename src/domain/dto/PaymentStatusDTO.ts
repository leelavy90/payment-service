import { IsEmail, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ItemDTO } from "./ItemDTO";

export class PaymentStatusDTO {
  @IsString()
  authorizationStatus: string

  @IsNumber()
  amount: number

  @IsString()
  @IsEmail()
  email: string;

  @ValidateNested({ each: true })
  @Type(() => ItemDTO)
  items: ItemDTO[]

  constructor(authorizationStatus: string, amount: number, email: string, items: ItemDTO[]) {
    this.authorizationStatus = authorizationStatus
    this.amount = amount
    this.email = email
    this.items = items
  }
}