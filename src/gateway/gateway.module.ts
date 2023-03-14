import { Module } from '@nestjs/common';
import { StripeModule } from 'src/stripe/stripe.module';
import { ImagesModule } from '../images/images.module';
import { ImagesGateway } from './images.gateway';
import { StripeGateway } from './stripe.gateway';

@Module({
  imports: [ImagesModule, StripeModule],
  providers: [ImagesGateway, StripeGateway],
})
export class GatewayModule {}
