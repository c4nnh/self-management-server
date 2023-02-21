import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import * as moment from 'moment';
import { PaginationArgs } from '../../utils';

export class GetTransactionsArgs extends PaginationArgs {
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value.trim())
  title?: string;

  @IsEnum(TransactionType, { each: true })
  @IsOptional()
  @ApiProperty({
    enum: TransactionType,
    isArray: true,
  })
  types?: TransactionType[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  amountFrom?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  amountTo?: number;

  @IsDate()
  @IsOptional()
  dateFrom?: Date = new Date(1970, 0, 1);

  @IsDate()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) =>
    moment(value).endOf('day').toDate(),
  )
  dateTo?: Date = moment().endOf('day').toDate();
}
