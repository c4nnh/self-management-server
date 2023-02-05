import { Module } from '@nestjs/common';
import { ImagesModule } from '../images/images.module';
import { ImagesGateway } from './images.gateway';

@Module({
  imports: [ImagesModule],
  providers: [ImagesGateway],
})
export class GatewayModule {}
