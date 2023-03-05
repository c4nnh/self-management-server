import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AssetsModule } from './assets/assets.module';
import { ImagesModule } from './images/images.module';
import { GatewayModule } from './gateway/gateway.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CronJobsModule } from './cron-jobs/cron-jobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoansModule } from './loans/loans.module';
import { TontinesModule } from './tontines/tontines.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    DbModule,
    AuthModule,
    UsersModule,
    CurrenciesModule,
    TransactionsModule,
    AssetsModule,
    ImagesModule,
    GatewayModule,
    CronJobsModule,
    LoansModule,
    TontinesModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
