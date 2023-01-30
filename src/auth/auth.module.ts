import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './jwt.config';
import { AuthGuard } from './auth.guard';
import { CurrenciesModule } from '../currencies/currencies.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfig,
    }),
    CurrenciesModule,
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
