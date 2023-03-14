import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StripeService } from 'src/stripe/stripe.service';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class StripeJobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  @Cron('0 0 0 * * *', {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async deleteUnusedImages() {
    console.log(`Delete unused stripe customer: ${new Date()}`);
    try {
      const users = await this.prisma.user.findMany({
        where: {
          stripeCustomerId: {
            not: null,
          },
        },
      });
      const stripeCustomers = await this.stripeService.getAll();
      const unusedCustomers = stripeCustomers.filter(
        (customer) =>
          !users.map((item) => item.stripeCustomerId).includes(customer.id),
      );
      await this.stripeService.deleteByIds(
        unusedCustomers.map((item) => item.id),
      );
    } catch {
      console.error('Can not execute delete unused stripe customer');
    }
  }
}
