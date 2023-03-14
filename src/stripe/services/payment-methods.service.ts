import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import Stripe from 'stripe';
import { CreateStripePaymentMethodCardDto } from '../dto/payment-method.dto';
import { StripeCustomersService } from './customers.service';
import { StripeService } from './stripe.service';

@Injectable()
export class StripePaymentMethodsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly stripeCustomersService: StripeCustomersService,
  ) {}

  private createPaymentMethod = (dto: Stripe.PaymentMethodCreateParams) =>
    this.stripeService.instance.paymentMethods.create(dto);

  private attachPaymentMethod = (customerId: string, paymentMethodId: string) =>
    this.stripeService.instance.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

  createCardPaymentMethod = async (
    userId: string,
    dto: CreateStripePaymentMethodCardDto,
  ) => {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const { email, name } = user;
      const customer = await this.stripeCustomersService.createCustomer({
        email,
        name,
      });
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: { currencyId: customer.id },
      });
      customerId = customer.id;
    }
    const paymentMethod = await this.createPaymentMethod({
      type: 'card',
      card: dto,
    });
    await this.attachPaymentMethod(customerId, paymentMethod.id);

    return paymentMethod;
  };
}
