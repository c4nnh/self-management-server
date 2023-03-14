import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { StripePaymentMethodsController } from './payment-methods.controller';
import { StripeCustomersService } from './services/customers.service';
import { StripePaymentMethodsService } from './services/payment-methods.service';
import { StripeService } from './services/stripe.service';

@Module({
  imports: [AuthModule],
  providers: [
    StripeService,
    StripeCustomersService,
    StripePaymentMethodsService,
  ],
  exports: [StripeCustomersService, StripePaymentMethodsService],
  controllers: [StripePaymentMethodsController],
})
export class StripeModule {}
