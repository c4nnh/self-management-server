import { Module } from '@nestjs/common';
import { ImagesModule } from '../images/images.module';
import { CronJobsService } from './cron-jobs.service';

@Module({
  imports: [ImagesModule],
  providers: [CronJobsService],
})
export class CronJobsModule {}
