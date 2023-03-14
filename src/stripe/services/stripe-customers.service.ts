import { Injectable } from '@nestjs/common';
import { CreateStripeCustomerDto } from '../dto/customer.dto';
import { StripeService } from './stripe.service';

@Injectable()
export class StripeCustomersService {
  constructor(private readonly stripeService: StripeService) {}

  findOneByEmail = async (email: string) => {
    const resp = await this.stripeService.instance.customers.list({
      email,
    });
    if (!resp.data.length) {
      return null;
    }
    return resp.data[0];
  };

  getAll = async () => {
    const resp = await this.stripeService.instance.customers.list();
    return resp.data;
  };

  createCustomer = (dto: CreateStripeCustomerDto) =>
    this.stripeService.instance.customers.create(dto);

  deleteByIds = (ids: string[]) =>
    Promise.all(ids.map((id) => this.stripeService.instance.customers.del(id)));
}