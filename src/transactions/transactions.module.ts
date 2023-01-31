import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CurrenciesModule } from '../currencies/currencies.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [AuthModule, CurrenciesModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
