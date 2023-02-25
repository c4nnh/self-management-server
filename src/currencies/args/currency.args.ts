import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationArgs } from '../../utils';

export class GetCurrenciesArgs extends PaginationArgs {
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value.trim())
  // Search by name, symbol and code
  search?: string;
}
