import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CurrenciesModule } from '../currencies/currencies.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, CurrenciesModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
