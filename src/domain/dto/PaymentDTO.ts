import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ItemDTO } from "./ItemDTO";
import { AddressDTO } from "./AddressDTO";
import { MetadataDTO } from "./MetadataDTO";

export class PaymentDTO {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  orderId: string;

  @IsString()
  description: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  reference: string;

  @IsString()
  invoiceUrl: string;

  @IsOptional()
  @IsString()
  dueDate: string;

  @IsOptional()
  @IsNumber()
  vatAmount: number;

  @IsOptional()
  @IsString()
  successfulPaymentRedirect: string;

  @ValidateNested({ each: true })
  @Type(() => ItemDTO)
  items: ItemDTO[];

  @ValidateNested({ each: true })
  @Type(() => AddressDTO)
  billingAddress: AddressDTO;

  @IsBoolean()
  shippingSameAsBilling: boolean;

  @ValidateNested({ each: true })
  @Type(() => AddressDTO)
  shippingAddress: AddressDTO;

  @ValidateNested({ each: true })
  @Type(() => MetadataDTO)
  metadata: MetadataDTO;
}
