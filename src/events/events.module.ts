import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [AuthModule],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
