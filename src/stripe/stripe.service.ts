import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { CreateStripeCustomerDto } from './dto/customer.dto';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  findOneByEmail = async (email: string) => {
    const resp = await this.stripe.customers.list({
      email,
    });
    if (!resp.data.length) {
      return null;
    }
    return resp.data[0];
  };

  getAll = async () => {
    const resp = await this.stripe.customers.list();
    return resp.data;
  };

  createCustomer = (dto: CreateStripeCustomerDto) =>
    this.stripe.customers.create(dto);

  deleteByIds = (ids: string[]) =>
    Promise.all(ids.map((id) => this.stripe.customers.del(id)));
}
