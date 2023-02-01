import { TransactionType } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import * as moment from 'moment';
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
  from?: Date = new Date(1970, 0, 1);

  @IsDate()
  @Transform(({ value }: TransformFnParams) =>
    moment(value).endOf('day').toDate(),
  )
  to?: Date = moment().endOf('day').toDate();
}
