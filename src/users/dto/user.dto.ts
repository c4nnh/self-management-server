import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserCurrencyDto {
  @IsString()
  @IsNotEmpty()
  currencyId: string;
}
