import { IsNumber, IsString } from "class-validator";

export class ItemDTO {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;

  @IsString()
  vendorId: string;

  @IsNumber()
  platformFee: number;

  @IsNumber()
  quantity: number;
}