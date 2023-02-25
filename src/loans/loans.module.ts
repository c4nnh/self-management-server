import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';

@Module({
  imports: [AuthModule],
  providers: [LoansService],
  controllers: [LoansController],
})
export class LoansModule {}
