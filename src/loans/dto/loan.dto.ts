import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxDate,
  Min,
} from 'class-validator';
import * as moment from 'moment-timezone';

export class CreateLoanDto {
  @IsString()
  @IsNotEmpty()
  debtor: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currencyId: string;

  @IsDate()
  @IsOptional()
  @MaxDate(moment().tz(process.env.TZ).endOf('day').toDate())
  date?: Date;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateLoanDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  debtor?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  currencyId?: string;

  @IsDate()
  @IsOptional()
  @MaxDate(moment().tz(process.env.TZ).endOf('day').toDate())
  date?: Date;

  @IsString()
  @IsOptional()
  description?: string;
}
