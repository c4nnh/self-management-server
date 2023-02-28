import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CurrenciesModule } from 'src/currencies/currencies.module';
import { TontinesController } from './tontines.controller';
import { TontinesService } from './tontines.service';

@Module({
  imports: [AuthModule, CurrenciesModule],
  controllers: [TontinesController],
  providers: [TontinesService],
})
export class TontinesModule {}
