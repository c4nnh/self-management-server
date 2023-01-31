import { TransactionType } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationArgs } from '../../utils';

export class GetTransactionsArgs extends PaginationArgs {
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value.trim())
  title?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsDate()
  from?: Date = new Date(1900, 0, 1);

  @IsDate()
  to?: Date = new Date();
}
