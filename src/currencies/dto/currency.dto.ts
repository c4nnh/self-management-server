import { Currency } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCurrencyDto implements Pick<Currency, 'name'> {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateCurrencyDto implements Pick<Currency, 'name'> {
  @IsNotEmpty()
  @IsString()
  name: string;
}
