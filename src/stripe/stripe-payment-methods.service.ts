import { Injectable } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Injectable()
export class StripePaymentMethodsService {
  constructor(private readonly stripeService: StripeService) {}
}
