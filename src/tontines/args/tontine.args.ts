import { Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import * as moment from 'moment-timezone';
import { PaginationArgs } from 'src/utils';

export class GetTontinesArgs extends PaginationArgs {
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value.trim())
  description?: string;

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
