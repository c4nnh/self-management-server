import { TransactionType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currencyId: string;
}
