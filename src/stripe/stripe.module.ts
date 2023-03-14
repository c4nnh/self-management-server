import { Module } from '@nestjs/common';
import { StripeCustomersService } from './stripe-customers.service copy';
import { StripePaymentMethodsService } from './stripe-payment-methods.service';
import { StripeService } from './stripe.service';

@Module({
  providers: [
    StripeService,
    StripeCustomersService,
    StripePaymentMethodsService,
  ],
  exports: [StripeCustomersService, StripePaymentMethodsService],
})
export class StripeModule {}
