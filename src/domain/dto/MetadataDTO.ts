import { IsString } from "class-validator";

export class MetadataDTO {
  @IsString()
  CustomerID: string;
}