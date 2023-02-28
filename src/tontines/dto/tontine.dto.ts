import { IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTontineDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currencyId: string;

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTontineDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  currencyId?: string;

  @IsDate()
  @IsOptional()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  @IsOptional()
  description?: string;
}
