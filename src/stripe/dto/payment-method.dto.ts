import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { IsBankCardYear } from 'src/utils/validator';
import Stripe from 'stripe';

export class CreateStripePaymentMethodCardDto
  implements Stripe.PaymentMethodCreateParams.Card1
{
  @IsString()
  @Length(12)
  number: string;

  @IsNumber()
  @Max(12)
  @Min(1)
  exp_month: number;

  @IsNumber()
  @Min(0)
  @IsBankCardYear()
  exp_year: number;

  @IsString()
  @IsOptional()
  cvc?: string;
}
