import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateStripePaymentMethodCardDto } from './dto/payment-method.dto';
import { StripePaymentMethodsService } from './services/payment-methods.service';

@Controller('stripe-payment-methods')
@UseGuards(AuthGuard)
@ApiTags('Stripe payment method')
@ApiBearerAuth()
export class StripePaymentMethodsController {
  constructor(private readonly service: StripePaymentMethodsService) {}

  @Post('cards')
  createPaymentMethods(
    @Req() request,
    @Body() dto: CreateStripePaymentMethodCardDto,
  ) {
    return this.service.createCardPaymentMethod(request.user.id, dto);
  }
}
