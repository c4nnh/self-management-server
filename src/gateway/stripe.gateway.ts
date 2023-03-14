import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway } from '@nestjs/websockets';
import { PrismaService } from 'src/db/prisma.service';
import { CreateStripeCustomerDto } from 'src/stripe/dto/customer.dto';
import { StripeService } from 'src/stripe/stripe.service';
import { EVENT_EMITTER } from '../utils';

@WebSocketGateway()
export class StripeGateway {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  @OnEvent(EVENT_EMITTER.CREATE_USER)
  async createUser(dto: CreateStripeCustomerDto & { id: string }) {
    const { id, email, name } = dto;
    let customer = await this.stripeService.findOneByEmail(dto.email);
    if (!customer) {
      customer = await this.stripeService.createCustomer({
        email,
        name,
      });
    }
    await this.prisma.user.update({
      where: { id },
      data: { stripeCustomerId: customer.id },
    });
  }
}
