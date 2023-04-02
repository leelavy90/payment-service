import { IsString } from "class-validator";

export class AddressDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  line1: string;

  @IsString()
  line2: string;

  @IsString()
  postalCode: string;

  @IsString()
  state: string;
}