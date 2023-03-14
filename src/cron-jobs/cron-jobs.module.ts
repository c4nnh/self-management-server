import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { StripeModule } from 'src/stripe/stripe.module';
import { ImagesModule } from '../images/images.module';
import { ImageJobsService } from './image-jobs.service';
import { StripeJobsService } from './stripe-jobs.service';
import { SystemJobsService } from './system-jobs.service';

@Module({
  imports: [ImagesModule, HttpModule, StripeModule],
  providers: [SystemJobsService, ImageJobsService, StripeJobsService],
})
export class CronJobsModule {}
