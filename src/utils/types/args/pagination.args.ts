import { Prisma } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PaginationArgs {
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number = 10;

  @IsNumber()
  @IsOptional()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  orderBy?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(Object.keys(Prisma.SortOrder))
  orderDirection?: Prisma.SortOrder;
}
