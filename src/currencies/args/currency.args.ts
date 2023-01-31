import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { BasePaginationArgs } from '../../utils';

export class GetCurrenciesArgs extends BasePaginationArgs {
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name?: string;
}
