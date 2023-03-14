import { Module } from '@nestjs/common';
import { StripeCustomersService } from './services/stripe-customers.service';
import { StripePaymentMethodsService } from './services/stripe-payment-methods.service';
import { StripeService } from './services/stripe.service';

@Module({
  providers: [
    StripeService,
    StripeCustomersService,
    StripePaymentMethodsService,
  ],
  exports: [StripeCustomersService, StripePaymentMethodsService],
})
export class StripeModule {}
