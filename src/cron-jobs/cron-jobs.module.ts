import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ImagesModule } from '../images/images.module';
import { CronJobsService } from './cron-jobs.service';

@Module({
  imports: [ImagesModule, HttpModule],
  providers: [CronJobsService],
})
export class CronJobsModule {}
