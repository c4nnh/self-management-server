import { forwardRef, Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [CurrenciesService],
  controllers: [CurrenciesController],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
