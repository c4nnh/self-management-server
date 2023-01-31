import { Prisma } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationArgs {
  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @IsNumber()
  @IsOptional()
  offset?: number = 0;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsString()
  @IsEnum(Object.keys(Prisma.SortOrder))
  orderDirection?: Prisma.SortOrder;
}
