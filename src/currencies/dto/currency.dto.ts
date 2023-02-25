import { Currency } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCurrencyDto
  implements Pick<Currency, 'name' | 'symbol' | 'code'>
{
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  symbol: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim().toUpperCase())
  code: string;
}

export class UpdateCurrencyDto
  implements Partial<Pick<Currency, 'name' | 'symbol' | 'code'>>
{
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value.trim())
  symbol?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value.trim().toUpperCase())
  code?: string;
}
