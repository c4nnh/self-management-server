import { Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import * as moment from 'moment-timezone';
import { PaginationArgs } from '../../utils';

export class GetAssetsArgs extends PaginationArgs {
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value.trim())
  // Search by name or description
  search?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  priceFrom?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  priceTo?: number;

  @IsDate()
  @IsOptional()
  boughtDateFrom?: Date = new Date(1970, 0, 1);

  @IsDate()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) =>
    moment(value).endOf('day').toDate(),
  )
  boughtDateTo?: Date = moment().endOf('day').toDate();
}
